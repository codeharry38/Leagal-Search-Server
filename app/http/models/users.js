const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{type:String, required:true,index:true},
  phone:{type:Number, required:true, unique:true, index:true},
  email:{type:String, required:true, unique:true, index:true},
  username:{type:String, required:true, unique:true, index:true},
  password:{type:String, required:true, index:true},
  role:{type:mongoose.Types.ObjectId, default:null,ref:'roles'},
  status:{type:Boolean, required:true,},
  createdAt:{type:Date, default: Date.now},
  updatedAt:{type:Date, default: Date.now}
});

  const User = mongoose.model('users', userSchema);

  module.exports =  User;