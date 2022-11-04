const fs = require('fs');
const path = require('path');

const soursePath = path.join(__dirname, 'styles');
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(outputPath, { recursive: true, force: true }, (err) => {
  if (err) console.log(err.message);
  fs.readdir(soursePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      const output = fs.createWriteStream(outputPath, 'utf-8');

      files.forEach(file => {
        if (file.isFile() && path.extname(path.join(soursePath, file.name)) === '.css') {
          const input = fs.createReadStream(path.join(soursePath, file.name), 'utf8');
          input.on('data', data => output.write(data));
        }
      });

      console.log('File bundle.css created successfully!\n');
    }
  })
});

