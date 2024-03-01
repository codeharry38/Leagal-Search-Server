const { validationResult } = require('express-validator');
const {ActTree} = require('../models');
const mongoose = require('mongoose');
// ActTree Constoller
class ActTreeController {
    //--------------Fetch All ActTrees--------------------
    index(req,res,next){
        ActTree.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New ActTree-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.parent = req.body.parent;
        objData.recordType = req.body.recordType;
        objData.number = req.body.number;
        objData.description = req.body.description;
        objData.actid = req.body.actid;
        //objData.createdBy = req.user_id,
        objData.createdAt = new Date();
        const data = new ActTree(objData);
        data.save().then(doc =>{
            if(req.body.parent == null){
                //
            }else{
                ActTree.update({_id: req.body.parent}, { $push: { children: doc._id } });
            }
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'Content has been Added', record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    //---------------Update ActTree-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.parent = req.body.parent;
        objData.recordType = req.body.recordType;
        objData.number = req.body.number;
        objData.description = req.body.description;
        objData.updateddAt = new Date();
        // MongoDB Query
        ActTree.findOneAndUpdate({_id:req.body.id},{
            $set:objData
        })
        .then(data =>{
            ActTree.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Content has been updated.', record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------ActTree find By Id-------------------
    findByID(req,res,next){
        ActTree.findById(req.params.id).populate([{path: 'recordType', select: 'name'}])
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete ActTree--------------------
    async delete (req,res,next){
        try{
            let Ids = req.params.id.split(',');
            const check = await ActTree.findById(req.params.id);
            await ActTree.remove({'_id': {$in : Ids}});
            await ActTree.remove({'_id': {$in : check.children}});
            return res.status(202).json({action:true, message:'Selected ActTree has been deleted.'});
        }catch(error){
            return res.json({action:false, message:'Something went wrong!!', error:error});
        }
    }
    //------------------ Fetch Tree -------------------
    fetchActTree(req,res,next){
        ActTree.aggregate( [
            { $match: { "parent": null, "actid": mongoose.Types.ObjectId(req.params.actid) } },
            {   $lookup:{
                    from:'actsections',
                    localField:'recordType',
                    foreignField:'_id',
                    as:'recordType'
                }
            },
            {
               $graphLookup: {
                  from: "acttrees",
                  startWith: "$_id",
                  connectFromField: "parent",
                  connectToField: "parent",
                  as: "children",
                  maxDepth: 3,
               },
            },
            {$addFields:{Counter:{$size: "$children"}}},
            { $unwind : {path: "$children", preserveNullAndEmptyArrays:true}},
            {
                $lookup:{
                    from:'actsections',
                    localField:'children.recordType',
                    foreignField:'_id',
                    as:'RecordType'
                }
            },
            { "$group" :
                {
                    "children" :{ $push: { $cond:[{ $gt: [ "$Counter", 0 ] },{ "number" : "$children.number", "name" :"$children.name","_id":"$children._id","recordType":"$RecordType.sName"},0]}},
                    "_id" : '$_id',
                    "name":{ "$first": "$name" },
                    "number":{ "$first": "$number" },
                    "recordType":{ "$first": "$recordType.sName" },
                }
            },
            {
                $project: {
                    children: {
                        $cond: [
                            {$eq: [{$arrayElemAt: [ "$children", 0 ]}, 0]}, // if
                            [], // then
                            "$children" // else
                        ]
                    },
                    _id:1,
                    name:1,
                    number:1,
                    recordType:1
                }
            }
         ]).then(docs => {
            return res.status(200).json({action:true, records:docs});
         }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
         })
          
    }

    // ------------------------- SEARCH FOR CITATION &  BLOCK ----------------------------
    LocalhSearch(req,res,next){
        ActTree.search({
            query_string: {
                query: req.body.query.replace(/[^a-zA-Z ]/g, "")
            }
        },
        function(err, docs) {
            return res.status(200).json({action:true, records:docs.hits.hits, error:err});
        });
    }
}
module.exports = new ActTreeController();