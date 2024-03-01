const { validationResult } = require('express-validator');
const {Party} = require('../models');
// Party Constoller
class PartyController {
    //--------------Fetch All Parties--------------------
    index(req,res,next){
        const { page = 1, limit = 30 } = req.query;
        Party.find({}).limit(limit * 1)
        .skip((page - 1) * limit)
        .then(docs => {
            Party.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Party-------------------
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
        const data = new Party(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
            if (err) throw err;
            /* Document is indexed */
            });
            return res.status(201).json({action:true, message:'Party has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Party-------------------
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
        Party.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            Party.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Party has been updated.',record:doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Party find By Id-------------------
    findByID(req,res,next){
        Party.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Party--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Party.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Party has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }

    // ------------------------- Search For TEXT -------------------
    Search(req,res,next){
        Party.search({
            query_string: {
                query: req.body.query
            }},
            {
                hydrate: true,
                hydrateWithESResults: true,
                hydrateOptions: {select: 'name'}
            },
            function(err, docs) {
                //result = docs.hits;
                return res.status(200).json({action:true, records:docs.hits.hits});
            })
            
            /*/.then(docs =>{
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });*/
    }
}
module.exports = new PartyController();