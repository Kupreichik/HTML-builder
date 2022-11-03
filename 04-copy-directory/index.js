const fs = require('fs');
const path = require('path');

let dirName = 'files';
let copyDirName = dirName + '-copy';
let newDirPath = path.join(__dirname, copyDirName);
let dirPath = path.join(__dirname, dirName);

function copyFiles(dirPath, newDirPath) {
  fs.readdir(dirPath, (err, files) => {
    
    files.forEach(file => {
      fs.stat(path.join(dirPath, file), (_, stats) => {
        if (stats.isDirectory()) {
          copyDir(
            path.join(dirPath, file),
            path.join(newDirPath, file));
        } else {
          fs.copyFile(
            path.join(dirPath, file),
            path.join(newDirPath, file),
            (err) => {
              if (err) console.log(err.message);
            }
          )
        }
      })
    });

    if (err) {
      console.log(err.message);
    } else {
      console.log(`Data from ${dirPath} copied successfully\n`);
    }
  })
}

function copyDir(dirPath, newDirPath) {
  fs.rm(newDirPath, { recursive: true, force: true }, (err) => {
    if (err) console.log(err.message);
    fs.mkdir(newDirPath, { recursive: true }, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        copyFiles(dirPath, newDirPath);
      }
    });
  });
};

copyDir(dirPath, newDirPath);