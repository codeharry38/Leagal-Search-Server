const fs = require('fs');
const { exit } = require('process');
const path = `${__dirname}/../app/http/controllers/`;
function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
process.argv.slice(2).forEach((index) => {
    try {
        //console.log();
        if (fs.existsSync(`${path}${index}Controller.js`)) {
            //throw new Error (`${index}Controller.js all ready exist`);
            console.log('\x1b[31m', `${index}Controller.js all ready exist`);
            exit();
        }else{
            var data = "class "+capitalize(index+'Controller');
            var writeStream = fs.createWriteStream(path+''+capitalize(index+'Controller.js'));
            writeStream.write(path+''+capitalize(index+'Controller.js'),data,function (err){
                if(err){
                    console.log("\x1b[31m",`Error:${err}`);
                }
                console.log("\x1b[36m", `${index}Controller.js Created Successfully`);
            });
            exit();
        }
      } catch(err) {
        console.log("\x1b[31m",`Error:${err}`);
      }
  })