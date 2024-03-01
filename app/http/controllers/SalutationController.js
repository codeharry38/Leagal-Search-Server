const { validationResult } = require('express-validator');
const {Salutation} = require('../models');
// Salutation Constoller
class SalutationController {
    //--------------Fetch All Parties--------------------
    index(req,res,next){
        Salutation.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Salutation-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.prefix = req.body.prefix;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new Salutation(objData);
        data.save().then(data =>{
            return res.status(201).json({action:true, message:'Salutation has been created',record:data});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Salutation-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.prefix = req.body.prefix;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        Salutation.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            Salutation.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Salutation has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Salutation find By Id-------------------
    findByID(req,res,next){
        Salutation.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Salutation--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Salutation.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Salutation has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new SalutationController();