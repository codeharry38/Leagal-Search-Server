const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema;

const courtSchema = new Schema({
  name:{type:String, required:true, es_index:true},
  sName:{type:String, required:true, es_index:true},
  status:{type:Boolean, required:true, es_index:true},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});
  courtSchema.plugin(mongoosastic)
  const Court = mongoose.model('courts', courtSchema);
  

  module.exports =  Court;