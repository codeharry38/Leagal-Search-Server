const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const judgeSchema = new Schema({
  name:{type:String, required:true,index:true},
  prefix:{type:mongoose.Types.ObjectId, required:true,index:true, ref:'salutations'},
  status:{type:Boolean, required:true},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});

  const Judge = mongoose.model('judges', judgeSchema);

  module.exports =  Judge;