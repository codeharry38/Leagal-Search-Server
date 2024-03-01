const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AD = new Schema({
    ActId:{type:String},
    Description:{type:String}
});
const actd = mongoose.model('actdescription', AD);

const CT = new Schema({
  CaseID:{type:String},
  citedcaseid:{type:String},
  citid:{type:String},
  status:{type:String}
});
const cited = mongoose.model('cites', CT);












  module.exports =  { actd, cited };