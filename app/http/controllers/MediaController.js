const {Media} = require('../models');
var multer= require('multer');
var fs = require('fs');
var path = require('path');
const upload = require('../../helper/media')
// Media Constoller
class MediaController {
    // ======== Fetch All Media =========
    index(req, res, next){
        Media.find({}).then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }

    // ========== Upload Media ===========
    uploader(req, res, next){
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError){
                console.log(err);
                return res.json({action:false, message:'Something went wrong!!', error:err});
            } else if (err) {
                console.log(err);
                return res.json({action:false, message:'Something went wrong!!', error:err});
            }
            else{
              const imgs = [];
              //const now = Date.now();
              for(let i = 0; i<=req.files.length-1;i++){
                var filePath = req.files[i].path.split('public');
                imgs.push({
                    fileName: req.files[i].filename,
                    type: req.files[i].mimetype,
                    size: req.files[i].size,
                    extention: req.files[i].filename.split('.').pop(),
                    filePath: filePath[1],
                    //fileWebLink: '/uploads',
                    createdAt: new Date()
                });
              }
              
                Media.insertMany(imgs).then(doc =>{
                    return res.status(201).json({action:true, message:'Files has been uploaded successfully', record:doc});
                }).catch(error => {
                    return res.json({action:false, message:'Something went wrong!!', error:error});
                });
            }
        });
    }
    // =========== find by Id ===========
    findByID(req, res, next){
        Media.findById(req.params.id)
        .then(doc =>{
            return res.status(200).json({action:true, record:doc});
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
    // =========== Search Media By Name ===========
    mediaByName(req, res, next){
        Media.find( { fileName: { $regex: req.query.media } } ).then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    // =========== Search Media By Date ===========
    mediaByDate(req, res, next){
        Media.find({createdAt: { $gte: new Date(2012, 7, 14), $lt: new Date(2012, 7, 15)}}).then(docs => {
            return res.status(200).json({action:true, records:docs});
        }).catch(error => {
            return res.json({action:false, message:'Somethink went wrong!!', error:error});
        })
    }
    // ============ Delete Media ==========
    delete(req,res,next){
        Media.findById(req.params.id).then(data =>{
            fs.unlinkSync(path.resolve(__dirname, '../../../public'+data.filePath));
            Media.remove({'_id': req.params.id})
            .then(() =>{
                return res.status(202).json({action:true, message:'Selected file has been deleted.'});
            }).catch(error => {
                return res.json({action:false, message:'Something went wrong!!', error:error});
            });
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        });
    }
}
module.exports = new MediaController();