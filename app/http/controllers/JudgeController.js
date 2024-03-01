const { validationResult } = require('express-validator');
const {Judge} = require('../models');
// Judge Constoller
class JudgeController {
    //------------- Experiment -----------
    test(req,res,next){
        const { page = 1, limit = 5 } = req.query;
        Judge.aggregate([
            { $match: { } },
            { '$facet'    : {
                metadata: [ { 'totla' : { $divide: [ $count, 8 ] }}, { $addFields: { page: Number(1) } } ],
                data: [ { $skip: 20 }, { $limit: 20 } ] 
            } }
            ]
            )
        .then(docs => {
            Judge.count().then(count => {
                return res.status(200).json({action:true, records:docs});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }


    //--------------Fetch All Judges--------------------
    index(req,res,next){
        const { page = 1, limit = 30 } = req.query;
        Judge.find({}).limit(limit * 1)
        .skip((page - 1) * limit).populate('prefix').select('prefix name status')
        .then(docs => {
            Judge.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Judge-------------------
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
        const data = new Judge(objData);
        data.save().then(data =>{
            return res.status(201).json({action:true, message:'Judge has been created',record:data});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Judge-------------------
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
       // objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        Judge.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            Judge.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Judge has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Judge find By Id-------------------
    findByID(req,res,next){
        Judge.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Judge--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Judge.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Judge has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new JudgeController();