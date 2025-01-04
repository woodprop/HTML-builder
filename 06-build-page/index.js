const fs = require('fs').promises;
const path = require('path');

const htmlTemplateFile = path.join(__dirname, 'template.html');
const htmlComponentsFolder = path.join(__dirname, 'components');
const distFolder = path.join(__dirname, 'project-dist');
const htmlDistFile = path.join(distFolder, 'index.html');
const cssDistFile = path.join(distFolder, 'style.css');

async function buildPage() {
  await fs.mkdir(distFolder, { recursive: true }); //ToDO separate <----------------------------------------
  let pageTemplate = await fs.readFile(htmlTemplateFile, 'utf-8');

  while (pageTemplate.indexOf('{{') !== -1) {
    const tagStartIdx = pageTemplate.indexOf('{{');
    const tagEndIdx = pageTemplate.indexOf('}}', tagStartIdx);
    const tag = pageTemplate.slice(tagStartIdx + 2, tagEndIdx);
    const componentPath = path.join(htmlComponentsFolder, `${tag}.html`);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    pageTemplate = pageTemplate.replace(`{{${tag}}}`, '\n' + componentContent);
  }
  // console.log(pageTemplate);
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
  // console.log(files);

  for (const file of files) {
    styles.push(await fs.readFile(path.join(stylesPath, file.name), 'utf-8'));
  }

  // console.log(styles);
  await fs.writeFile(cssDistFile, styles, 'utf-8');
}

buildPage();
createStyleBundle();
