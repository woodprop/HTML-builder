const fs = require('fs').promises;
const path = require('path');

async function getStyleFiles() {
  return (
    await fs.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    })
  ).filter((file) => {
    return (
      file.isFile() &&
      path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
    );
  });
}

async function getStyles() {
  const files = await getStyleFiles();
  const styles = [];

  for (const file of files) {
    styles.push(
      await fs.readFile(path.join(__dirname, 'styles', file.name), 'utf-8'),
    );
  }

  return styles;
}

async function createBundle() {
  const styles = await getStyles();
  await fs.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    styles,
    'utf-8',
  );
}

createBundle().catch((error) => console.log(error.message));
