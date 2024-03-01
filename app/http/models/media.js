const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  fileName:{type:String, required:true},
  filePath:{type:String, required:true},
  type:{type:String, required:true},
  size:{type:String, required:true},
  extention:{type:String, required:true},
  createdAt:{type:Date, default: Date.now},
  updatedAt:{type:Date, default: Date.now}
});

  const Media = mongoose.model('medias', mediaSchema);

  module.exports =  Media;