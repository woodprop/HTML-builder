const { readdir } = require('fs/promises');
const path = require('path');
const { stdout } = process;

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((files) => {
    console.log(files);
  })
  .catch((error) => stdout.write(error.message));
