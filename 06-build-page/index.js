const fs = require('fs');
const path = require('path');

const dirName = 'assets';
const project = path.join(__dirname, 'project-dist');
const newDirPath = path.join(project, dirName);
const dirPath = path.join(__dirname, dirName);
const srcStyles = path.join(__dirname, 'styles');
const outputStyles = path.join(project, 'style.css');
const componentsDir = path.join(__dirname, 'components');

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
      console.log(`--Data from ${dirPath} copied successfully`);
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

function mergeStyles(soursePath, outputPath) {
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

        console.log(`--File ${outputPath} created successfully`);
      }
    })
  });
}

function createHtml(project, componentsDir) {
  const readFile = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf8');
  const writeFile = fs.createWriteStream(path.join(project, 'index.html'), 'utf8');
  
  readFile.on('data', async (data) => {
    const template = await htmlBuild();
    writeFile.write(template);
    console.log(`--File ${path.join(project, 'index.html')} created successfully`)

    async function htmlBuild() {
      let template = data.toString();
      const componentsArr = template.match(/{{(.*)}}/gi);
      for (let item of componentsArr) {
        tag = item.replace(/[\{\}]/g, '').trim();
        const component = await fs.promises.readFile(path.join(componentsDir, `${tag}.html`));
        template = template.replace(item, component.toString());
      }
      return template;
    }
  })
}

fs.rm(project, { recursive: true, force: true }, (err) => {
  if (err) console.log(err.message);
  fs.mkdir(project, { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      copyDir(dirPath, newDirPath);
      mergeStyles(srcStyles, outputStyles);
      createHtml(project, componentsDir);
    }
  });
});