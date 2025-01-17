const fs = require('fs').promises;
const path = require('path');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });

  const files = await fs.readdir(src, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await copyDir(path.join(src, file.name), path.join(dest, file.name));
    } else {
      await fs.copyFile(path.join(src, file.name), path.join(dest, file.name));
    }
  }
}

copyDir(src, dest).catch((err) => console.log(err.message));
