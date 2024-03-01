const { validationResult } = require('express-validator');
const {ActSection} = require('../models');
// ActSection Constoller
class ActSectionController {
    //--------------Fetch All ActSections--------------------
    index(req,res,next){
        ActSection.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ActSection-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.parent = req.body.parent;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new ActSection(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Section has been created', record: doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update ActSection-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.parent = req.body.parent;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        ActSection.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            ActSection.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Section has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ActSection find By Id-------------------
    findByID(req,res,next){
        ActSection.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ActSection--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        ActSection.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Section has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new ActSectionController();