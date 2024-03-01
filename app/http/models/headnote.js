const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const HeadNoteSchema = new Schema({
    parent: {type:Schema.Types.ObjectId, default:null, ref:'cases'},
    act: {type:Schema.Types.ObjectId, default:null, ref:'acts'},
    point: [{type:Schema.Types.ObjectId, default:null, ref:'acttrees'}],
    matter:{type:String},
    repeatMatter:{type:String},
    updatedAt: {type:Date, default:Date.now},
});
const HeadNote = mongoose.model('headnotes',HeadNoteSchema);
module.exports = HeadNote;