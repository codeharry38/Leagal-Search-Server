const { validationResult } = require('express-validator');
const {Case, HeadNote} = require('../models');
// Case Constoller
class CaseController {
    //--------------Fetch All Cases--------------------
    index(req,res,next){
        const { page = 1, limit = 15 } = req.query;
        Case.find({}).limit(limit * 1)
        .skip((page - 1) * limit).populate(
            [
                {path:'petitioner',select:'name'},
                {path:'respondent',select:'name'},
                {path:'court',select:'name sName'},
                {path:'caseType',select:'name'},
            ]).select('petitioner respondent court caseType caseYear dod caseNumber')
        .then(docs => {
            Case.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Case-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.court = req.body.court;
        objData.caseType = req.body.caseType;
        objData.caseStatus = req.body.caseStatus;
        objData.caseNumber = req.body.caseNumber;
        objData.caseYear = req.body.caseYear;
        objData.petitioner = req.body.petitioner;
        objData.respondent = req.body.respondent;
        //objData.caseParty = req.body.respondent;
        objData.dod = req.body.dod;
        objData.status = req.body.status;
        //objData.createdBy = req.user_id,
        objData.createdAt = new Date();
        const data = new Case(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'Case has been created', record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Save judgement-----------------
    judgement(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.judgement = req.body.judgement;
        //objData.updatedBy = req.user_id;
        objData.updateddAt = new Date();
        // MongoDB Query
        Case.findByIdAndUpdate(req.body.id,{$set:objData}, {upsert: true,'new': true})
        .then(() =>{
            return res.status(201).json({action:true, message:'Judgement has been updated.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Case find By Id-------------------
    findJudgement(req,res,next){
        Case.findById(req.params.id).select('judgement')
        .then(doc =>{
            return res.status(200).json({action:true, record:doc.judgement});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    //---------------Save Important Note-----------------
    ImportantNote(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.importantNote = req.body.importantNote;
        //objData.updatedBy = req.user_id;
        objData.updateddAt = new Date();
        // MongoDB Query
        Case.findByIdAndUpdate(req.body.id,{$set:objData}, {upsert: true,'new': true})
        .then(() => {
            return res.status(201).json({action:true, message:'Important Note has been updated.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Case find By Id-------------------
    findImportantNote(req,res,next){
        Case.findById(req.params.id).select('importantNote')
        .then(doc =>{
            return res.status(200).json({action:true, record:doc.importantNote});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Case-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.court = req.body.court;
        objData.caseType = req.body.caseType;
        objData.caseStatus = req.body.caseStatus;
        objData.caseNumber = req.body.caseNumber;
        objData.caseYear = req.body.caseYear;
        objData.petitioner = req.body.petitioner;
        objData.respondent = req.body.respondent;
        objData.dod = req.body.dod;
        objData.status = req.body.status;
        //objData.updatedBy = req.user_id;
        objData.updateddAt = new Date();
        // MongoDB Query
        Case.findOneAndUpdate({_id:req.body.id},{$set:objData},{upsert: true,'new': true})
        .then(data =>{
            Case.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Case has been updated.', record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Case find By Id-------------------
    findByID(req,res,next){
        Case.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Case--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Case.remove({'_id': {$in : id}})
        .then(doc =>{
            doc.on('es-removed', function(err, res){
                //
            });
            return res.status(202).json({action:true, message:'Selected Case has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // ===============================================================================================
// ======================================== CITATION MANAGEMENT ======================================

    // -------------------------------- FETCH CITATION -----------------------------------
    fetchCitation(req, res, next){
        Case.findById(req.params.id).select('cites _id').populate({
            path: 'cites',
            select: 'petitioner respondent dod caseStatus',
            populate: [
                {path:'petitioner', model:'parties', select:'name'},
                {path:'respondent', model:'parties', select:'name'},
                {path:'caseStatus', model:'casestatus', select:'name'}
            ]
        }).then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // -------------------------------- ADD CITATION --------------------------------------
    addCitation(req, res, next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        //objData.updateddAt = new Date();
        Case.findOneAndUpdate({_id:req.body.id}, { $push:{ cites: req.body.cites } }, {upsert: true, 'new': true})
        .then(data =>{
            data.on('es-indexed', function(err, res){
                console.log(err);
            });
            return res.status(201).json({action:true, message:'Citation has been added.', record:data});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // ------------------------------- REMOVE CITATION -----------------------------------
    removeCitation(req, res, next){
        Case.findOneAndUpdate({_id:req.params.caseid}, { $pull:{ cites: req.params.id } },{upsert: true,'new': true})
        .then(doc =>{
            doc.index(function(err, res){
                console.log("egads! I've been indexed!");
            });
            return res.status(202).json({action:true, message:'Citation has been removed.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });

    }

    // ======================================== REFERRED MANAGEMENT ======================================

    // -------------------------------- FETCH REFERRED -----------------------------------
    fetchRefer(req, res, next){
        Case.findById(req.params.id).select('referres _id').populate({
            path: 'referres',
            select: 'petitioner respondent dod caseStatus',
            populate: [
                {path:'petitioner', model:'parties', select:'name'},
                {path:'respondent', model:'parties', select:'name'},
                {path:'caseStatus', model:'casestatus', select:'name'}
            ]
        }).then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // -------------------------------- ADD REFERRED --------------------------------------
    addRefer(req, res, next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        //objData.updateddAt = new Date();
        Case.findOneAndUpdate({_id:req.body.id}, { $push:{ referres: req.body.referres } }, {upsert: true,'new': true})
        .then(data =>{
            data.on('es-indexed', function(err, res){
                console.log(err);
            }); 
            return res.status(201).json({action:true, message:'Referred has been added.', record:data});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // ------------------------------- REMOVE REFERRED -----------------------------------
    removeRefer(req, res, next){
        Case.findOneAndUpdate({_id:req.params.caseid}, { $pull:{ referres: req.params.id } },{upsert: true,'new': true})
        .then(doc =>{
            doc.on('es-indexed', function(err, res){
                console.log(err);
            }); 
            return res.status(202).json({action:true, message:'Referred has been removed.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    // ======================================== HEADNOTE MANAGEMENT ======================================

    // -------------------------------- FETCH HEADNOTE -----------------------------------
    fetchHeadNote(req, res, next){
        HeadNote.find({parent:req.params.caseId}).populate([
            {path:'act',select:'name'},
            {path:'point',select:'name recordType number', 
            populate:[{path:'recordType',model:'actsections',select:'sName'}]},
        ]).select('act point matter repeatMatter')
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    // -------------------------------- ADD HEADNOTE -----------------------------------
    addHeadNote(req, res, next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.parent = req.body.parent;
        objData.act = req.body.act;
        objData.point = req.body.point;
        objData.matter = req.body.matter;
        objData.repeatMatter = req.body.repeatMatter;
        objData.updatedAt = new Date();
        const data = new HeadNote(objData);
        data.save().then(doc =>{
            Case.findOneAndUpdate({_id:doc.parent}, { $push:{ headnotes: doc._id }},{upsert: true,'new': true})
            .then(data =>{ 
                data.on('es-indexed', function(err, res){
                    console.log(err);
                });              
                return res.status(201).json({action:true, message:'HeadNote has been added.', record:data});            
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
        
    }
    // -------------------------------- Remove HEADNOTE -----------------------------------
    removeHeadNote(req, res, next){
        Case.findOneAndUpdate({_id:req.params.caseid}, { $pull:{ headnotes: req.params.id } },{upsert: true,'new': true})
        .then(doc =>{
            data.on('es-indexed', function(err, res){
                console.log(err);
            }); 
            HeadNote.remove({_id:req.params.id})
            .then(() => {
                return res.status(202).json({action:true, message:'Referred has been removed.'});
            })
            .catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
            
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }






































    // ------------------------- SEARCH FOR CITATION &  BLOCK ----------------------------
    LocalhSearch(req,res,next){
        Case.search({
            query_string: {
                query: req.body.query.replace(/[^a-zA-Z ]/g, "")
            }},
            function(err, docs) {
                //result = docs.hits;
                return res.status(200).json({action:true, records:docs.hits.hits, error:err});
            })
            
            /*/.then(docs =>{
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });*/
    }
}
module.exports = new CaseController();