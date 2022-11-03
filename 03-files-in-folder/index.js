const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, (_, files) => {
  files.forEach((file) => {
    const info = path.parse(file);

    fs.stat(path.resolve(dir, file), (_, stats) => {
      if (stats.isFile()) {
        const size = stats.size / 1024
        console.log(`${info.name} - ${info.ext.replace('.', '')} - ${size}kb`)
      }
    })
  })
})