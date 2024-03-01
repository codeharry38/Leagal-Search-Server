const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connavdSchema = new Schema({
  advocate:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'advocates'},
  desgn:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'advdesgns'},
  caseid:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'cases'},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
});

  const ConnAdv = mongoose.model('connadvs', connavdSchema);

  module.exports =  ConnAdv;