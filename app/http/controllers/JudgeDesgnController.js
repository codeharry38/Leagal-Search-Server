const { validationResult } = require('express-validator');
const {JudgeDesgn} = require('../models');
// JudgeDesgn Constoller
class JudgeDesgnController {
    //--------------Fetch All JudgeDesgns--------------------
    index(req,res,next){
        JudgeDesgn.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New JudgeDesgn-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new JudgeDesgn(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Designation has been created', record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update JudgeDesgn-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        JudgeDesgn.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            JudgeDesgn.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Designation has been updated.',record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------JudgeDesgn find By Id-------------------
    findByID(req,res,next){
        JudgeDesgn.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete JudgeDesgn--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        JudgeDesgn.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Designation has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new JudgeDesgnController();