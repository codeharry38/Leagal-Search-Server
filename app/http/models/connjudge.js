const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connJudgeSchema = new Schema({
  judge:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'judges'},
  CaseNId:{type: String},
  desgn:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'judgedesgns'},
  caseid:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'cases'},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
});

  const ConnJudge = mongoose.model('connjudges', connJudgeSchema);

  module.exports =  ConnJudge;