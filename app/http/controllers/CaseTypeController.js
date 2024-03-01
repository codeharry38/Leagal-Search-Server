const { validationResult } = require('express-validator');
const {CaseType} = require('../models');
// CaseType Constoller
class CaseTypeController {
    //--------------Fetch All CaseTypes--------------------
    index(req,res,next){
        CaseType.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New CaseType-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        const data = new CaseType(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'CaseType has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update CaseType-------------------
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
        CaseType.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            CaseType.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'CaseType has been updated.', record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
            
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------CaseType find By Id-------------------
    findByID(req,res,next){
        CaseType.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete CaseType--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        CaseType.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected CaseType has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new CaseTypeController();