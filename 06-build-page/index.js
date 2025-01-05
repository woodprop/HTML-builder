const fs = require('fs').promises;
const path = require('path');

const htmlTemplateFile = path.join(__dirname, 'template.html');
const htmlComponentsFolder = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');
const distFolder = path.join(__dirname, 'project-dist');
const htmlDistFile = path.join(distFolder, 'index.html');
const cssDistFile = path.join(distFolder, 'style.css');

async function createDir() {
  await fs
    .rm(distFolder, { recursive: true, force: true })
    .finally(async () => {
      await fs.mkdir(distFolder, { recursive: true });
    });
}

async function createHtml() {
  let pageTemplate = await fs.readFile(htmlTemplateFile, 'utf-8');

  while (pageTemplate.indexOf('{{') !== -1) {
    const tagStartIdx = pageTemplate.indexOf('{{');
    const tagEndIdx = pageTemplate.indexOf('}}', tagStartIdx);
    const tag = pageTemplate.slice(tagStartIdx + 2, tagEndIdx);
    const componentPath = path.join(htmlComponentsFolder, `${tag}.html`);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    pageTemplate = pageTemplate.replace(`{{${tag}}}`, '\n' + componentContent);
  }

  await fs.writeFile(htmlDistFile, pageTemplate, 'utf-8');
}

async function createStyleBundle() {
  const styles = [];
  const stylesPath = path.join(__dirname, 'styles');
  const files = (await fs.readdir(stylesPath, { withFileTypes: true })).filter(
    (file) => {
      return (
        file.isFile() &&
        path.extname(path.join(stylesPath, file.name)) === '.css'
      );
    },
  );

  for (const file of files) {
    styles.push(await fs.readFile(path.join(stylesPath, file.name), 'utf-8'));
  }

  await fs.writeFile(cssDistFile, styles, 'utf-8');
}

async function copyDir(src, dest = distFolder) {
  const newDirName = path.parse(src).name;
  const newDirPath = path.join(dest, newDirName);
  await fs.mkdir(newDirPath, { recursive: true });
  const files = await fs.readdir(src, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await copyDir(path.join(src, file.name), newDirPath);
    } else {
      await fs.copyFile(
        path.join(src, file.name),
        path.join(newDirPath, file.name),
      );
    }
  }
}

async function build() {
  await createDir();
  await createHtml();
  await createStyleBundle();
  await copyDir(assetsFolder);
}

build().catch((error) => console.log(error.message));
