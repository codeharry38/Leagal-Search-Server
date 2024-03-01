const { validationResult } = require('express-validator');
const {User} = require('../models');
// User Constoller
class UserController {
    //--------------Fetch All Users--------------------
    index(req,res,next){
        User.find({})
        .then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------User Info-------------------------
    info(req,res,next){
        User.findById(req.user._id)
        .then(doc => {
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    //---------------Create New User-------------------
    store(req,res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        var objData = {};
        objData.name = req.body.name;
        objData.email = req.body.email;
        objData.phone = req.body.phone;
        objData.password = req.body.password;
        objData.role = req.body.role;
        objData.status = req.body.status;
        const data = new User(objData);
        data.save().then(doc =>{
            return res.status(201).json({action:true, message:'User has been created',record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------Update User-------------------
    update(req,res,next){
        // Init Data Here
        var objData = {};
        objData.name = req.body.name,
        objData.email = req.body.email,
        req.body.password == '' || req.body.password == null  ? '' : objData.password = req.body.password,
        objData.phone = req.body.phone,
        objData.role = req.body.role,
        objData.status = req.body.status,
        // MongoDB Query
        User.findByIdAndUpdate(req.body.id,{
            $set:objData
        })
        .then(data =>{
            User.findById(data._id).then(doc =>{
                return res.status(201).json({action:true, message:'User has been updated.',record:doc});
            }).catch(error =>{
                return res.json({action:false, message:'Something went wrong!!', error:error});
            })
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------User Own Updation-------------------
    updateByUser(req,res,next){
        // Init Data Here
        var objData = {};
        objData.name = req.body.name;
        objData.email = req.body.email;
        req.body.password == '' || req.body.password == null  ? '' : objData.password = req.body.password;
        objData.phone = req.body.phone;
        // MongoDB Query
        User.findOneAndUpdate({_id:req.user._id},{$set:{objData}})
        .then(() =>{
            return res.status(201).json({action:true, message:'Your data has been updated.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //---------------User find By Id-------------------
    findByID(req,res,next){
        User.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    //----------------Delete User--------------------
    delete(req,res,next){
        let id = req.params.id.split(',')
        USer.remove({'_id': {$in : id}})
        .then(() =>{
            return res.status(202).json({action:true, message:'Selected user has been deleted.'});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new UserController();