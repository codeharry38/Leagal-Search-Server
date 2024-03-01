const { validationResult } = require('express-validator');
const {Advocate} = require('../models');
// Advocate Constoller
class AdvocateController {
    //--------------Fetch All Advocates--------------------
    index(req,res,next){
        const { page = 1, limit = 30 } = req.query;
        Advocate.find({}).limit(limit * 1)
        .skip((page - 1) * limit).populate('prefix').select('prefix name status')
        .then(docs => {
            Advocate.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Advocate-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.prefix = req.body.prefix;
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new Advocate(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Advocate has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Advocate-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.prefix = req.body.prefix;
        objData.name = req.body.name;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        Advocate.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            Advocate.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Advocate has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })            
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Advocate find By Id-------------------
    findByID(req,res,next){
        Advocate.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Advocate--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Advocate.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Advocate has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new AdvocateController();