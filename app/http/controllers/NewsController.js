const { validationResult } = require('express-validator');
const {News} = require('../models');
// Advocate Constoller
class NewsController {
    //--------------Fetch All Advocates--------------------
    index(req,res,next){
        News.find({}).populate('cover')
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New Advocate-------------------
    store(req,res,next){
        /*const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }*/
        var objData = {};
        objData.title = req.body.title;
        objData.description = req.body.description;
        objData.cover = req.body.cover;
        objData.type = req.body.type;
        objData.content = req.body.content;
        objData.status = req.body.status;
        //objData.createBy = req.user._id;
        objData.createdAt = new Date();
        // MongoDB Query
        const data = new News(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'News has been created',record:doc});
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
        objData.title = req.body.title;
        objData.description = req.body.description;
        objData.cover = req.body.cover;
        objData.type = req.body.type;
        objData.content = req.body.content;
        objData.status = req.body.status;
        //objData.updatedBy = req.user._id;
        objData.upatedAt = new Date();
        // MongoDB Query
        News.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            News.findById(data._id).then(doc => {
                return res.status(201).json({action:true, message:'News has been updated.',record: doc});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })            
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Advocate find By Id-------------------
    findByID(req,res,next){
        News.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete Advocate--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        News.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected News has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new NewsController();