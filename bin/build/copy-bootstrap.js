const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

function copyFile(filePath, outputPath) {
  fs.createReadStream(filePath).pipe(fs.createWriteStream(outputPath));
}

module.exports = async function () {
  const bootstrapScss = '../../node_modules/bootstrap/scss';
  const destScssPath = '../../src/scss/bootstrap';
  const bootstrap = fs.readFileSync(path.resolve(__dirname, `${bootstrapScss}/bootstrap.scss`));

  const reg = /@import ["']+([a-z_-]*?)["']+/g;
  const files = (bootstrap.toString().match(reg) || []).map(e => e.replace(reg, '$1'));

  const excludes = [
    'transitions',
    'modal',
    'dropdown',
    'tooltip',
    'popover',
    'carousel',
    'jumbotron',
    'shadows',
    'spinners',
    'toasts',
  ];


  const includeFiles = files.filter(f => excludes.indexOf(f) === -1);

  // clean directory
  fse.emptyDirSync(path.resolve(__dirname, (destScssPath)));

  // gen bootstrap CSS file
  console.log('... Generating Bootstrap CSS dependencies');

  const fileContent = includeFiles.map(f => `@import '${f}';\n`).toString().replace(/,/g, '');

  fs.writeFileSync(path.resolve(__dirname, `${destScssPath}/bootstrap.scss`), `// Bootstrap dependencies\n${fileContent}`);

  // move bootstrap files
  includeFiles.forEach((f) => {
    const scssFilename = `_${f}.scss`;
    const srcFile = path.resolve(__dirname, `${bootstrapScss}/${scssFilename}`);
    const srcDir = path.resolve(__dirname, `${bootstrapScss}/${f}`);

    if (fs.existsSync(srcDir) && fs.lstatSync(srcDir).isDirectory()) {
      // copy directory
      console.log(`... Moving ${f}`);
      fse.copySync(srcDir, path.resolve(__dirname, `${destScssPath}/${f}`));
    }

    // dir and file can both exist (mixins/ and _mixins.scss)
    if (fs.existsSync(srcFile) && fs.lstatSync(srcFile).isFile()) {
      // copy SCSS file
      console.log(`... Moving ${scssFilename}`);
      fse.copySync(srcFile, path.resolve(__dirname, `${destScssPath}/${scssFilename}`));
    }
  });

  console.log('Bootstrap dependencies loaded!');
}
