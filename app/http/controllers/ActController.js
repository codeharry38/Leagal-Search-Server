const { validationResult } = require('express-validator');
const {Act} = require('../models');
// Act Constoller
class ActController {
    //--------------Fetch All Acts--------------------
    index(req,res,next){
        Act.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Act-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.state = req.body.state;
        objData.actNumber = req.body.actNumber;
        objData.actYear = req.body.actYear;
        objData.dod = req.body.dod;
        objData.gInformation = req.body.gInformation;
        objData.description = req.body.description;
        objData.department = req.body.department;
        objData.subject = req.body.subject;
        objData.status = req.body.status;
        //objData.createdBy = req.user_id,
        objData.createdAt = new Date();
        const data = new Act(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'Act has been created', record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    //---------------Update Act-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.state = req.body.state;
        objData.actNumber = req.body.actNumber;
        objData.actYear = req.body.actYear;
        objData.dod = req.body.dod;
        objData.gInformation = req.body.gInformation;
        objData.description = req.body.description;
        objData.department = req.body.department;
        objData.subject = req.body.subject;
        objData.status = req.body.status;
        //objData.updatedBy = req.user_id;
        objData.updateddAt = new Date();
        // MongoDB Query
        Act.findOneAndUpdate({_id:req.body.id},{
            $set:objData
        })
        .then(data =>{
            Act.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Act has been updated.', record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Act find By Id-------------------
    findByID(req,res,next){
        Act.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Act--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Act.remove({'_id': {$in : id}})
        .then(doc =>{
            doc.on('es-removed', function(err, res){
                //
            });
            return res.status(202).json({action:true, message:'Selected Act has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    // ------------------------- SEARCH FOR CITATION &  BLOCK ----------------------------
    LocalhSearch(req,res,next){
        Act.search({
            query_string: {
                query: req.body.query.replace(/[^a-zA-Z ]/g, "")
            }
        },
        function(err, docs) {
            return res.status(200).json({action:true, records:docs.hits.hits, error:err});
        });
            
            /*/.then(docs =>{
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });*/
    }
}
module.exports = new ActController();