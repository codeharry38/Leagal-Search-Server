const Models = require('../models');
//const mongoose = require('mongoose');

class RecordController {


    /*updateData(req,res,next){
        Salutation.find().select('PrefixId')
        .then(doc =>{
            return res.status(200).json(doc);
        }).catch(error => {
            return res.json({action:false, message:'Something went wrong!!', error:error});
        }); 
    }*/


    // ================== Judge Combination ============
    /*async updateData(req,res,next){
        try{
            const datafrom = await Case.aggregate([ 
                { $match: { CaseStatusId: "1" }},
        
            ]);
            //res.json(datafrom);
            datafrom.forEach
            (
                async function(x)
               { 
                    await ConnJude.updateMany({"CaseNId": x.CaseId},{$set:{"caseID": x._id}}); 
                    console.log(x._id);
                //res.json({action:true,message:'Well Done Harry'});
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }

    }*/

    // ================================================ BOOKS CONNECT  ========================================
    
    // ================== Connect Books _id with Equivalent Citation ============

    /*async updateData(req,res,next){
        try{
            const datafrom = await Models.Book.aggregate([ 
                { $match: { status: false }},
                { $project: {_id: 1,BookId:1},},
                
            ]);
           //res.json(datafrom);
           let count = 0;
            datafrom.forEach
            (
                async function(x)
               { 
                    try{
                        await Models.EquivalentCite.updateMany({'BookId': x.BookId},{$set:{'book': x._id}},{multi:true}); 
                       console.log(++count);
                    }catch(error){
                        console.log(error);
                    }                
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }
    }*/

    // ================== Connect Cases _id with Equivalent Citation ============

   /* async updateData(req,res,next){
        try{
            const datafrom = await Models.Case.aggregate([ 
                { $match: { __v: 1 }},
                { $project: {_id: 1,CaseId:1},},
                
            ]);
           //res.json(datafrom);
           let count = 0;
            datafrom.forEach
            (
                async function(x)
               { 
                    try{
                        await Models.EquivalentCite.updateMany({'CaseId': x.CaseId},{$set:{'case': x._id}},{multi:true}); 
                       console.log(++count);
                    }catch(error){
                        console.log(error);
                    }                
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }
    }*/






    // ================================================ CASES  ========================================
    
    // ================== Case Citation Description ============

    async updateData(req,res,next){
        try{
            const datafrom = await Models.Recorder.cited.aggregate([ 
                { $match: { status: "1" }},
                { $project: {_id: 1,CaseID:1, citid:1},},
                
            ]);
            //res.json(datafrom);
           // const datafrom = await Models.Case.find({}).select('CaseId');
           // res.json(datafrom);
           let count = 0;
            datafrom.forEach
            (
                async function(x)
               { 
                    try{
                        await Models.Case.updateMany({'CaseId': x.CaseID},{$push:{'cites': x.citid}},{multi:true}); 
                       console.log(++count);
                    }catch(error){
                        console.log(error);
                    }                
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }

    }


    /*async updateData(req,res,next){
        try{
            const datafrom = await Models.Recorder.cited.aggregate([ 
                { $match: { status: "1" }},
                { $project: {_id: 1,CaseID:1, citid:1},},
                
            ]);
            //res.json(datafrom);
           // const datafrom = await Models.Case.find({}).select('CaseId');
           // res.json(datafrom);
           let count = 0;
            datafrom.forEach
            (
                async function(x)
               { 
                    try{
                        await Models.Case.updateMany({'CaseId': x.CaseID},{$push:{'cites': x.citid}},{multi:true}); 
                       console.log(++count);
                    }catch(error){
                        console.log(error);
                    }                
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }

    }*/


    





// ==================================== ACTS =====================================

    // ================== ACT Description ============

   /* async updateData(req,res,next){
        try{
            const datafrom = await Models.Recorder.actd.find({});

            datafrom.forEach
            (
                async function(x)
               { 
                    await Models.Act.updateMany({"ActId": x.ActId},{$set:{"description": x.Description}}); 
                    console.log(x._id);
                res.json({action:true,message:'Well Done Harry'});
               }
            )
            res.json({action:true,message:'Well Done Harry'});
        }catch(error){
            res.json({action:false,error:error,message:'Something Not Good!'});
        }

    }*/

   

}

module.exports = new RecordController();