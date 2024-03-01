const { validationResult } = require('express-validator');
const {ConnAdv, Case} = require('../models');
const mongoose = require('mongoose');
// ConnAdv Constoller
class ConnAdvController {
    //--------------Fetch All ConnAdvs--------------------
    index(req,res,next){
        ConnAdv.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ConnAdv-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.advocate = req.body.advocate;
        objData.desgn = req.body.desgn;
        objData.caseid = req.body.caseid;
        //objData.createdBy = req.user_id,
        objData.createdAt = new Date();
        const data = new ConnAdv(objData);
        data.save().then(doc =>{
            Case.findOneAndUpdate({_id:req.body.caseid}, { $push:{ advocates: doc._id } }, {upsert: true, 'new': true})
            .then(data => {
                data.on('es-indexed', function(err, res){
                    console.log(err);
                });
                return res.status(201).json({action:true, message:'Advocate has been Attached'});
            })
            .catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ConnAdv find By Id-------------------
    findByCase(req,res,next){
        ConnAdv.aggregate([
            {
                $match: {caseid: new mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $lookup: {
                    from: "advocates",
                    localField: "advocate",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "advocate"
                }
            },
            {
                $lookup: {
                    from: "advdesgns",
                    localField: "desgn",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "desgn"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$advocate", 0 ] }, "$$ROOT" ] } }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$desgn", 0 ] }, "$$ROOT" ] } }
            },
            {
                $project:{
                    advocate:'$advocate.name','desgn':'$desgn.name'
                }
            }
        ]).then(doc =>{
            return res.status(200).json({action:true, records:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ConnAdv find By Id-------------------
    findByID(req,res,next){
        ConnAdv.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ConnAdv--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        ConnAdv.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Advocate has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new ConnAdvController();