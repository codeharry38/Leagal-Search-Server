const { validationResult } = require('express-validator');
const {AdvDesgn} = require('../models');
// AdvDesgn Constoller
class AdvDesgnController {
    //--------------Fetch All AdvDesgns--------------------
    index(req,res,next){
        AdvDesgn.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New AdvDesgn-------------------
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
        const data = new AdvDesgn(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Designation has been created', record: doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update AdvDesgn-------------------
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
        AdvDesgn.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            AdvDesgn.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Designation has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------AdvDesgn find By Id-------------------
    findByID(req,res,next){
        AdvDesgn.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete AdvDesgn--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        AdvDesgn.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Designation has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new AdvDesgnController();