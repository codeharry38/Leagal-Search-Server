const { validationResult } = require('express-validator');
const {ActState} = require('../models');
// ActState Constoller
class ActStateController {
    //--------------Fetch All ActStates--------------------
    index(req,res,next){
        ActState.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ActState-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new ActState(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'State has been created', record: doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update ActState-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        ActState.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            ActState.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'State has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ActState find By Id-------------------
    findByID(req,res,next){
        ActState.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ActState--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        ActState.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected State has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new ActStateController();