const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
stream.on('data', (chunk) => console.log(chunk));
reader.on('error', (error) => console.log(error.message));