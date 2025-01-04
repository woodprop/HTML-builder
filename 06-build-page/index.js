const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const distPath = path.join(__dirname, 'project-dist');
  const templatePath = path.join(__dirname, 'template.html');
  const resultPath = path.join(distPath, 'index.html');

  await fs.mkdir(distPath, { recursive: true });

  let pageTemplate = await fs.readFile(templatePath, 'utf-8');

  while (pageTemplate.indexOf('{{') !== -1) {
    const tagStartIdx = pageTemplate.indexOf('{{');
    if (tagStartIdx === -1) return false;
    const tagEndIdx = pageTemplate.indexOf('}}', tagStartIdx);
    if (tagEndIdx === -1) return false;
    const tag = pageTemplate.slice(tagStartIdx + 2, tagEndIdx);
    const componentPath = path.join(__dirname, 'components', `${tag}.html`);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    pageTemplate = pageTemplate.replace(`{{${tag}}}`, '\n' + componentContent);
  }
  // console.log(pageTemplate);
  await fs.writeFile(resultPath, pageTemplate, 'utf-8');
}



buildPage();
