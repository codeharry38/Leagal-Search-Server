const express = require('express');
const _ = require('../app/http/controllers/Controller');
const router = express.Router();
require('../app/helper/Validator');

// ----------------------------------------- COURT MANAGER -----------------------------------------
router.get('/court/records', _.CourtController.index);
router.get('/court/findbyid/:id', _.CourtController.findByID);
router.post('/court/create', CourtValidator, _.CourtController.store);
router.put('/court/update', CourtValidator, _.CourtController.update);
router.delete('/court/delete/:id', _.CourtController.delete);

// ----------------------------------------- PARTY MANAGER -----------------------------------------
router.get('/party/records', _.PartyController.index);
router.get('/party/findbyid/:id', _.PartyController.findByID);
router.post('/party/search', _.PartyController.Search);
router.post('/party/create', NameValidator, _.PartyController.store);
router.put('/party/update', NameValidator, _.PartyController.update);
router.delete('/party/delete/:id', _.PartyController.delete);

// ----------------------------------------- SALUTATION MANAGER -----------------------------------------
router.get('/salutation/records', _.SalutationController.index);
router.get('/salutation/findbyid/:id', _.SalutationController.findByID);
router.post('/salutation/create', SalutationValidator, _.SalutationController.store);
router.put('/salutation/update', SalutationValidator, _.SalutationController.update);
router.delete('/salutation/delete/:id', _.SalutationController.delete);

// ----------------------------------------- JUDGE MANAGER AND JUDGES -----------------------------------------

// JUDGE Controller
router.get('/judge/records', _.JudgeController.index);
router.get('/judge/findbyid/:id', _.JudgeController.findByID);
router.post('/judge/create', _.JudgeController.store);
router.put('/judge/update', _.JudgeController.update);
router.delete('/judge/delete/:id', _.JudgeController.delete);

// JUDGE DESIGNATION Controller
router.get('/judge/desgn/records', _.JudgeDesgnController.index);
router.get('/judge/desgn/findbyid/:id', _.JudgeDesgnController.findByID);
router.post('/judge/desgn/create', _.JudgeDesgnController.store);
router.put('/judge/desgn/update', _.JudgeDesgnController.update);
router.delete('/judge/desgn/delete/:id', _.JudgeDesgnController.delete);

// ----------------------------------------- ADVOCATE MANAGER AND ADVOCATES -----------------------------------------

// ADVOCATE Controller
router.get('/advocate/records', _.AdvocateController.index);
router.get('/advocate/findbyid/:id', _.AdvocateController.findByID);
router.post('/advocate/create', _.AdvocateController.store);
router.put('/advocate/update', _.AdvocateController.update);
router.delete('/advocate/delete/:id', _.AdvocateController.delete);

// ADVOCATE DESIGNATION Controller
router.get('/advocate/desgn/records', _.AdvDesgnController.index);
router.get('/advocate/desgn/findbyid/:id', _.AdvDesgnController.findByID);
router.post('/advocate/desgn/create', _.AdvDesgnController.store);
router.put('/advocate/desgn/update', _.AdvDesgnController.update);
router.delete('/advocate/desgn/delete/:id', _.AdvDesgnController.delete);



// ----------------------------------------- CASE MANAGER CONNECTER AND CASES -----------------------------------------

// =================================================== CITATION MANAGER ===============================================
    router.get('/case/cited/records/:id', _.CaseController.fetchCitation);
    router.post('/case/cited/create', _.CaseController.addCitation);
    router.delete('/case/cited/delete/:caseid/:id', _.CaseController.removeCitation);

    // =================================================== REFERRED MANAGER ===============================================
    router.get('/case/refer/records/:id', _.CaseController.fetchRefer);
    router.post('/case/refer/create', _.CaseController.addRefer);
    router.delete('/case/refer/delete/:caseid/:id', _.CaseController.removeRefer);

    // =================================================== HEADNOTE MANAGER ===============================================
    router.get('/case/headnote/records/:caseId', _.CaseController.fetchHeadNote);
    router.post('/case/headnote/create', _.CaseController.addHeadNote);
    router.delete('/case/headnote/delete/:caseid/:id', _.CaseController.removeHeadNote);

// CASE Controller
router.get('/case/records', _.CaseController.index);
router.get('/case/findbyid/:id', _.CaseController.findByID);
router.post('/case/create', _.CaseController.store);
router.put('/case/update', _.CaseController.update);
router.delete('/case/delete/:id', _.CaseController.delete);
// CASE Judgement
router.put('/case/judgement/save', _.CaseController.judgement);
router.get('/case/judgement/record/:id', _.CaseController.findJudgement);

// CASE Important Note
router.put('/case/importantnote/save', _.CaseController.ImportantNote);
router.get('/case/importantnote/record/:id', _.CaseController.findImportantNote);

// JUDGE CONNECTION Controller
router.get('/case/judge/records/:id', _.ConnJudgeController.findByCase);
router.get('/case/judge/findbyid/:id', _.ConnJudgeController.findByID);
router.post('/case/judge/create', _.ConnJudgeController.store);
router.delete('/case/judge/delete/:id', _.ConnJudgeController.delete);

// Advocate CONNECTION Controller
router.get('/case/advocate/records/:id', _.ConnAdvController.findByCase);
router.get('/case/advocate/findbyid/:id', _.ConnAdvController.findByID);
router.post('/case/advocate/create', _.ConnAdvController.store);
router.delete('/case/advocate/delete/:id', _.ConnAdvController.delete);

//CASE STATUS Controller
router.get('/case/status/records', _.CaseStatusController.index);
router.get('/case/status/findbyid/:id', _.CaseStatusController.findByID);
router.post('/case/status/create', NameValidator, _.CaseStatusController.store);
router.put('/case/status/update', NameValidator, _.CaseStatusController.update);
router.delete('/case/status/delete/:id', _.CaseStatusController.delete);

//CASE TYPE Controller
router.get('/case/type/records', _.CaseTypeController.index);
router.get('/case/type/findbyid/:id', _.CaseTypeController.findByID);
router.post('/case/type/create', NameValidator, _.CaseTypeController.store);
router.put('/case/type/update', NameValidator, _.CaseTypeController.update);
router.delete('/case/type/delete/:id', _.CaseTypeController.delete);

// ---------------------------- CASE SEARCH --------------------------
        // -------------------- LOCAL SEARCH -------------------------
        router.post('/case/local/search', _.CaseController.LocalhSearch);


// ----------------------------------------- ACT MANAGER CONNECTER AND ACTS -----------------------------------------
// ---------------------------- ACT SEARCH --------------------------
    // -------------------- LOCAL SEARCH -------------------------
    router.post('/act/local/search', _.ActController.LocalhSearch);

// Act Tree
router.get('/acttree/records', _.ActTreeController.index);
router.get('/acttree/findbyid/:id', _.ActTreeController.findByID);
router.post('/acttree/create', _.ActTreeController.store);
router.put('/acttree/update', _.ActTreeController.update);
router.delete('/acttree/delete/:id', _.ActTreeController.delete);

//Fetch Tree
router.get('/acttree/tree/:actid', _.ActTreeController.fetchActTree);


// ACT Controller
router.get('/act/records', _.ActController.index);
router.get('/act/findbyid/:id', _.ActController.findByID);
router.post('/act/create', _.ActController.store);
router.put('/act/update', _.ActController.update);
router.delete('/act/delete/:id', _.ActController.delete);

//ACT SECTION Controller
router.get('/act/section/records', _.ActSectionController.index);
router.get('/act/section/findbyid/:id', _.ActSectionController.findByID);
router.post('/act/section/create', NameValidator, _.ActSectionController.store);
router.put('/act/section/update', NameValidator, _.ActSectionController.update);
router.delete('/act/section/delete/:id', _.ActSectionController.delete);

//ACT SUBJECT Controller
router.get('/act/subject/records', _.ActSubjectController.index);
router.get('/act/subject/findbyid/:id', _.ActSubjectController.findByID);
router.post('/act/subject/create', NameValidator, _.ActSubjectController.store);
router.put('/act/subject/update', NameValidator, _.ActSubjectController.update);
router.delete('/act/subject/delete/:id', _.ActSubjectController.delete);

//ACT DEPARTMENT Controller
router.get('/act/department/records', _.ActDepartmentController.index);
router.get('/act/department/findbyid/:id', _.ActDepartmentController.findByID);
router.post('/act/department/create', NameValidator, _.ActDepartmentController.store);
router.put('/act/department/update', NameValidator, _.ActDepartmentController.update);
router.delete('/act/department/delete/:id', _.ActDepartmentController.delete);

//ACT STATE Controller
router.get('/act/state/records', _.ActStateController.index);
router.get('/act/state/findbyid/:id', _.ActStateController.findByID);
router.post('/act/state/create', NameValidator, _.ActStateController.store);
router.put('/act/state/update', NameValidator, _.ActStateController.update);
router.delete('/act/state/delete/:id', _.ActStateController.delete);

// ----------------------------------------- USER MANAGER CONNECTER AND USER -----------------------------------------

//USER Controller
router.get('/user/records', _.UserController.index);
router.get('/user/findbyid/:id', _.UserController.findByID);
router.get('/user/info', _.UserController.info);
router.post('/user/create', UserValidator , _.UserController.store);
router.put('/user/update', _.UserController.update);
router.put('/user/update/byuser', _.UserController.updateByUser);
router.delete('/user/delete/:id', _.UserController.delete);
/*
// ROLE Controller
router.get('/user/role/records', _.RoleController.index);
router.get('/user/role/findbyid/:id', _.RoleController.findByID);
router.post('/user/role/create', NameValidator, _.RoleController.store);
router.put('/user/role/update', NameValidator, _.RoleController.update);
router.delete('/ser/role/delete/:id', _.RoleController.delete);

// ACLS Controller
router.get('/user/acls/records', _.AclsController.index);
router.get('/user/acls/findbyid/:id', _.AclsController.findByID);
router.post('/user/acls/create', NameValidator, _.AclsController.store);
router.put('/user/acls/update', NameValidator, _.AclsController.update);
router.delete('/ser/acls/delete/:id', _.AclsController.delete);*/



// =========================== DATABASE UPDATE
router.get('/records/update', _.RecordController.updateData);

// =========================== Media Manager
router.post('/media/upload',_.MediaController.uploader);
router.get('/media',_.MediaController.index);
router.get('/media/findbyid/:id', _.MediaController.findByID);
router.get('/media/delete/:id',_.MediaController.delete);

// =========================== News Manager
router.get('/news/records', _.NewsController.index);
router.get('/news/findbyid/:id', _.NewsController.findByID);
router.post('/news/create', _.NewsController.store);
router.put('/news/update', _.NewsController.update);
router.delete('/news/delete/:id', _.NewsController.delete);
// =========================== Books Manager
router.get('/book/records', _.BookController.index);
router.get('/book/findbyid/:id', _.BookController.findByID);
router.post('/book/create', _.BookController.store);
router.put('/book/update', _.BookController.update);
router.delete('/book/delete/:id', _.BookController.delete);


// =========================== Testing
router.get('/judge/test', _.JudgeController.test);

module.exports = router;
