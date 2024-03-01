const { validationResult } = require('express-validator');
const {ConnJudge, Case} = require('../models');
const mongoose = require('mongoose');
// ConnJudge Constoller
class ConnJudgeController {
    //--------------Fetch All ConnJudges--------------------
    index(req,res,next){
        ConnJudge.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ConnJudge-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.judge = req.body.judge;
        objData.desgn = req.body.desgn;
        objData.caseid = req.body.caseid;
        //objData.createdBy = req.user_id,
        objData.createdAt = new Date();
        const data = new ConnJudge(objData);
        data.save().then(doc =>{
            Case.findOneAndUpdate({_id:req.body.caseid}, { $push:{ judges: doc._id } }, {upsert: true, 'new': true})
            .then(data => {
                data.on('es-indexed', function(err, res){
                    console.log(err);
                });
                return res.status(201).json({action:true, message:'Judge has been Attached'});
            })
            .catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ConnJudge find By Id-------------------
    findByCase(req,res,next){
        ConnJudge.aggregate([
            {
                $match: {caseid: new mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $lookup: {
                    from: "judges",
                    localField: "judge",
                    foreignField: "_id",
                    as: "judge"
                }
            },
            {
                $lookup: {
                    from: "judgedesgns",
                    localField: "desgn",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "desgn"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$judge", 0] }, "$$ROOT" ] } }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$desgn", 0] }, "$$ROOT" ] } }
            },
            {
                $project:{
                    judge:'$judge.name','desgn':'$desgn.name'
                }
            }
        ]).then(doc =>{
           return  res.status(200).json({action:true, records:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
       
    }
    //---------------ConnJudge find By Id-------------------
    findByID(req,res,next){
        ConnJudge.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ConnJudge--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        ConnJudge.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Judge has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new ConnJudgeController();