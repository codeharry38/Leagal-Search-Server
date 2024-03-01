const { validationResult } = require('express-validator');
const {Court} = require('../models');
// Court Constoller
class CourtController {
    //--------------Fetch All Courts--------------------
    index(req,res,next){
        const { page = 1, limit = 30 } = req.query;
        Court.find({}).limit(limit * 1)
        .skip((page - 1) * limit)
        .then(docs => {
            Court.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Court-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new Court(objData);
        data.save().then(doc =>{
            doc.on('es-indexed', function(err, res){
                if (err) throw err;
                /* Document is indexed */
                });
            return res.status(201).json({action:true, message:'Court has been created',record:data});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Court-------------------
    update(req,res,next){
        // Init Data Here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.sName = req.body.sName;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.updatedAt = new Date();
        // MongoDB Query
        Court.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then( data =>{
            Court.findById(data._id).then(doc =>{
                return res.status(200).json({action:true, message:'Court has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Court find By Id-------------------
    findByID(req,res,next){
        Court.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Court--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Court.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Court has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new CourtController();