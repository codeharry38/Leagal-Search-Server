const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ecite = new Schema({
    CaseId:{type:String},
    Year:{type:String},
    Volume:{type:String},
    BookId:{type:String},
    Page:{type:String},
    book: {type:Schema.Types.ObjectId, default:null, ref:'books'},
    case: {type:Schema.Types.ObjectId, default:null, ref:'cases'}
});

const EquivalentCite = mongoose.model('equivalentcites', Ecite);

module.exports =  EquivalentCite;