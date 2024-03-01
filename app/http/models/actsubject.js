const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actSubjectSchema = new Schema({
  name:{type:String, required:true,index:true},
  status:{type:Boolean, required:true},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});

  const ActSubject = mongoose.model('actsubjects', actSubjectSchema);

  module.exports =  ActSubject;