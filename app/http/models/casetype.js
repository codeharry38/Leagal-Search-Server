const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema;

const CaseTypeSchema = new Schema({
  name:{type:String, required:true,es_index:true},
  status:{type:Boolean, required:true},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});
CaseTypeSchema.plugin(mongoosastic);

  const CaseType = mongoose.model('casetypes', CaseTypeSchema);

  module.exports =  CaseType;