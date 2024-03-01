const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')
// Create a schema
const ActTreeSchema = new Schema({
    recordType: {type:Schema.Types.ObjectId, default:null, ref:'actsections', es_type:'nested', es_include_in_parent:true},
    name: {type: String, es_index:true},
    number: {type:Number, es_index:true},
    description:{type:String, es_index:true},
    parent:{type:Schema.Types.ObjectId, default:null, index:true, ref:'acttrees'},
    actid:{type:Schema.Types.ObjectId, ref:'acts'},
    status: Boolean,
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now},
});
/*ActTreeSchema.plugin(mongoosastic,{
    populate:[
      {path: 'recordType', select: 'name'},
    ]  
})*/
const ActTree = mongoose.model('acttrees',ActTreeSchema);
module.exports = ActTree;