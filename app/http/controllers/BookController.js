const { validationResult } = require('express-validator');
const {Book} = require('../models');
// Book Constoller
class BookController {
    //--------------Fetch All Books--------------------
    index(req,res,next){
        const { page = 1, limit = 30 } = req.query;
        Book.find({}).limit(limit * 1)
        .skip((page - 1) * limit)
        .then(docs => {
            Book.count().then(count => {
                return res.status(200).json({action:true, records:docs, totalPages: Math.ceil(count/limit),
                currentPage: page});
            });
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Book-------------------
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
        const data = new Book(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'Book has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update Book-------------------
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
        Book.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            Book.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'Book has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })            
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Book find By Id-------------------
    findByID(req,res,next){
        Book.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Book--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        Book.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected Book has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new BookController();