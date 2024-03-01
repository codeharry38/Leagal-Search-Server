var multer= require('multer');
let fs = require('fs')
var path = require('path');

const fileFilter = function(req, file, cb) {
    const allowedType = ["image/jpeg","image/png","image/gif","application/pdf","video/mpeg","video/mp4","audio/mpeg","application/msword","application/vnd.ms-word.document.macroEnabled.12","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel.sheet.binary.macroEnabled.12","application/vnd.ms-excel","application/vnd.ms-excel.sheet.macroEnabled.12","application/vnd.ms-powerpoint.slideshow.macroEnabled.12","application/vnd.ms-powerpoint","application/vnd.ms-powerpoint.presentation.macroEnabled.12","application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if(!allowedType.includes(file.mimetype)){
        const error = new Error("Wrong file type");
        error.code ="LIMIT_FILE_TYPES";
        return cb(error,false);
    }
    cb(null, true);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //const newPath = __dirname+'../../../public/uploads/'+ new Date().getFullYear() +'/'+ new Date().getMonth();
      ////if (!fs.existsSync(newPath)){
        //fs.mkdir(newPath, { recursive: true }).then(() => {
          cb(null, path.resolve(__dirname, '../../public/uploads/'+ new Date().getFullYear() +'/'+ new Date().getMonth()));
      //  }).catch((err) => {
      //      console.log(err);
       // })  
      
    },
    filename: function (req, file, cb) {
        var now = Date.now();
        var fileName = now+"_"+"lawheraledonline_"+file.originalname.replace(/ /g,"_");
        cb(null, fileName)
    }
  })
var uploads = multer({storage: storage,
    fileFilter: fileFilter,
  });
  
  var upload = uploads.any();

  module.exports = upload;

