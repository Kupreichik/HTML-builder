const fs = require('fs');
const path = require('path');
const process = require('process');
const rl = require('readline');
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

const file = path.join(__dirname, 'text.txt');

fs.open(file, 'r+', (err) => {
  if (err) {
    fs.open(file, 'w', (err) => {
      if (err) {
        console.log('Произошла ошибка при работе с файловой системой')
      }
    })
  };
});

process.stdout.write('Введите данные для записи в файл:\n');

readline.on('line', (input) => {
  let isExit = input.toLowerCase().trim().slice(-4);
  if (isExit === 'exit') {
    let text = input.trim().slice(0, -4).trim() + ' ';
    fs.appendFile(file, text, (err) => {
      if (err) console.log(err.message);
    });
    readline.close();
  } else {
    let text = input + ' ';
    fs.appendFile(file, text, (err) => {
      if (err) console.log(err.message);
    });
  }
});

process.on('SIGINT', () => readline.close());
readline.on('close', () => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) console.log(err.message);
    console.log(`\nОперация успешно завершена. Содержание файла:\n${data}\n`)
  })
});