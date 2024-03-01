const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic')
const {Court, CaseStatus, CaseType, Party} = require('./index')
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  // Court
  court:{type:Schema.Types.ObjectId, ref:'courts', es_type:'nested', es_include_in_parent:true},
  // Petitioner
  CaseId:{type:String},
  petitioner:{type:Schema.Types.ObjectId, ref:'parties', es_type:'nested', es_include_in_parent:true},
  // Respondent
  respondent:{type:Schema.Types.ObjectId, ref:'parties', es_type:'nested', es_include_in_parent:true},
  //Case Type
  caseType:{type:Schema.Types.ObjectId, ref:'casetypes', es_type:'nested', es_include_in_parent:true},
  //Case Status
  caseStatus:{type:Schema.Types.ObjectId, ref:'casestatus', es_type:'nested', es_include_in_parent:true},
  // Judges
  judges:[{type:Schema.Types.ObjectId, default:null, ref:'connjudges', es_include_in_parent:true,
  es_type: 'completion',
  es_index_analyzer: 'simple',
  es_search_analyzer: 'simple',
  es_payloads: true
  }],
  // Advocates
  advocates:[{type:Schema.Types.ObjectId, default:null, ref:'connadvs', es_include_in_parent:true,
    es_type: 'completion',
    es_index_analyzer: 'simple',
    es_search_analyzer: 'simple',
    es_payloads: true
  }],
  //Citation
  cites:[{type:Schema.Types.ObjectId, default:null, ref:'cases', es_type:'nested', es_include_in_parent:true}],
  // Referred
  referres:[{type:Schema.Types.ObjectId, default:null, ref:'cases', es_type:'nested', es_include_in_parent:true}],
  // HeadNote
  headnotes:[{type:Schema.Types.ObjectId, default:null, ref:'headnotes', es_type:'nested', es_include_in_parent:true}],
  //caseNumber:{type:Number, default:null, es_index:true},
  //caseYear:{type:Number, default:null, es_index:true},
  // Equivalent Citation
  
  dod: {type:Date, es_index:true},
  judgement: {type:String, default:null, es_index:true},
  importantNote:{type:String, default:null,es_index:true},  
  attachments:{type:Schema.Types.ObjectId, default:null, index:true, ref:'media'},
  status:{type:Boolean, es_index:true},
  createdBy: {type:Schema.Types.ObjectId, default:null, ref:'users'},
  updateBy: {type:Schema.Types.ObjectId, default:null, ref:'users'},
  createdAt: {type:Date, default: Date.now},
  updatedAt: {type:Date, default: Date.now}
});
caseSchema.plugin(mongoosastic,{
  bulk: {
    size: 100000, // preferred number of docs to bulk index
    delay: 100 //milliseconds to wait for enough docs to meet size constraint
  },
  populate:[
    {path: 'cites', select: 'petitioner respondent dod caseStatus',
      populate:[
        {path:'petitioner', model:'parties', select:'name'},
        {path:'respondent', model:'parties', select:'name'},
        {path:'caseStatus', model:'casestatus', select:'name'}
      ]
    },
    {path: 'referres', select: 'petitioner respondent dod caseStatus',
      populate:[
        {path:'petitioner', model:'parties', select:'name'},
        {path:'respondent', model:'parties', select:'name'},
        {path:'caseStatus', model:'casestatus', select:'name'}
      ]
    },
    {path: 'headnotes', select:'act point matter repeatMatter',
      populate:[
        {path:'act', model:'acts', select:'name'},
        {path:'point', model:'acttrees', select:'name recordType', 
          populate:[
            {path:'recordType', model:'actsections', select:'name sName'}
          ]
        },
      ]
    },
    {path: 'judges', select: 'judge desgn',
      populate:[
        {path:'judge', model:'judges', select:'name'},
        {path:'desgn', model:'judgedesgns', select:'name sName'}
      ]
    },
    {path: 'advocates', select: 'advocate desgn',
      populate:[
        {path:'advocate', model:'advocates', select:'name'},
        {path:'desgn', model:'advdesgns', select:'name sName'}
      ]
    },
    {path: 'court', select: 'name'},
    {path: 'petitioner', select: 'name'},
    {path: 'respondent', select: 'name'},
    {path: 'caseStatus', select: 'name'},
    {path: 'caseType', select: 'name'},
  ]
});
var Case = mongoose.model('cases', caseSchema);
 /* , stream = Case.synchronize()
  , count = 0;

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});
  //const Case = mongoose.model('cases', caseSchema);

 /*var stream = Case.synchronize() , count = 0;
  stream.on('data', function(err, doc){
    count++;
  });
  stream.on('close', function(){
    console.log('Case indexed ' + count + ' documents!');
  });
  stream.on('error', function(err){
    console.log(err);
  });*/
  module.exports =  Case;