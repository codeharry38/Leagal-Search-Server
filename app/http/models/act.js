const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')

// Create a schema
const ActSchema = new Schema({
    name: {type:String, required:true, es_index:true},
    state: {type:Schema.Types.ObjectId, default:null, ref:'actstates', es_type:'nested', es_include_in_parent:true},
    actNumber: {type:Number, default:null, es_index:true},
    actYear: {type:Number, default:null, es_index:true},
    dod: {type:Date, default:null, es_index:true},
    gInformation: {type:String, default:null, es_index:true},
    description: {type:String, default:null, es_index:true},
    related:[{type:Schema.Types.ObjectId, default:null, ref:'acts', es_type:'nested', es_include_in_parent:true}],
    department:{type:Schema.Types.ObjectId, default:null, ref:'actdepartments', es_type:'nested', es_include_in_parent:true},
    subject:{type:Schema.Types.ObjectId, default:null, ref:'actsubjects', es_type:'nested', es_include_in_parent:true},
    //notifications:[{type:String, ref:'actnotifications'}],
    //keywords:[{type:String, ref:'actnotifications'}],
    //aditionkeywords:String,
    status: Boolean,
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now},
});

/*ActSchema.plugin(mongoosastic,{
    populate:[
      {path: 'state', select: 'name'},
      {path: 'petitioner', select: 'name'},
      {path: 'department', select: 'name'},
      {path: 'subject', select: 'name'},
    ]
  
  })*/

const Act = mongoose.model('acts',ActSchema);
module.exports = Act;