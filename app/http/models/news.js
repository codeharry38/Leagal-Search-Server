const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title:{type:String, required:true, index:true},
  description:{type:String, required:true},
  content:{type:String, required:true},
  cover:{type:mongoose.Types.ObjectId, default:null, ref:'medias'},
  type:{type:String},
  status:{type:Boolean, required:true},
  createBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:mongoose.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});
  const News = mongoose.model('news', newsSchema);

  module.exports =  News;