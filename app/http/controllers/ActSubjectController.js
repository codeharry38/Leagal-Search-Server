const { validationResult } = require('express-validator');
const {ActSubject} = require('../models');
// ActSubject Constoller
class ActSubjectController {
    //--------------Fetch All ActSubjects--------------------
    index(req,res,next){
        ActSubject.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ActSubject-------------------
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
        const data = new ActSubject(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Subject has been created', record: doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update ActSubject-------------------
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
        ActSubject.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            ActSubject.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Subject has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ActSubject find By Id-------------------
    findByID(req,res,next){
        ActSubject.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ActSubject--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        ActSubject.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Subject has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new ActSubjectController();