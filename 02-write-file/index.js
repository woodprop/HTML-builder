const { stdin, stdout } = process;
const os = require('os');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Please enter the data: ');
stdin.on('data', (inputData) => parseUserInput(inputData));

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Thank you...'));

function parseUserInput(data) {
  const str = data.toString();

  if (str.split(os.EOL)[0] === 'exit') {
    process.exit();
  }

  output.write(str);
}
