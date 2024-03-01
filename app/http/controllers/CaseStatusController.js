const { validationResult } = require('express-validator');
const {CaseStatus} = require('../models');
// CaseStatus Constoller
class CaseStatusController {
    //--------------Fetch All CaseStatuss--------------------
    index(req,res,next){
        CaseStatus.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New CaseStatus-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        const data = new CaseStatus(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'CaseStatus has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update CaseStatus-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.updateBy = req.user._id;
        // MongoDB Query
        CaseStatus.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            CaseStatus.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Case status has been updated.',record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------CaseStatus find By Id-------------------
    findByID(req,res,next){
        CaseStatus.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete CaseStatus--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        CaseStatus.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected CaseStatus has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new CaseStatusController();