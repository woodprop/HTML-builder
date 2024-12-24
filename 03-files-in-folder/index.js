const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout } = process;

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileName = path.parse(filePath).name;
        const fileExt = path.extname(filePath).slice(1);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            throw new Error(err.message);
          }
          const fileSize = (stats.size / 1024).toFixed(3);
          stdout.write(`${fileName} - ${fileExt} - ${fileSize}kb\n`);
        });
      }
    });
  })
  .catch((error) => stdout.write(error.message));
