const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

/**
 * Creates the docs for the release
 */
async function createDocs() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const { version } = pkg;

  // create directory for the version
  const outputPath = './site/docs';
  const outputVersionDir = `${outputPath}/${version}`;
  const outputLatestDir = `${outputPath}/latest`;

  if (!fs.existsSync(outputVersionDir)) {
    fs.mkdirSync(outputVersionDir);
  }

  await exec(`./node_modules/documentor/bin/documentor.js docs -o ${outputVersionDir}/index.html`);

  // copy and update directory for latest docs
  if (!fs.existsSync(outputLatestDir)) {
    fs.mkdirSync(outputLatestDir);
  }

  await exec(`rm -rf ${outputLatestDir}/*`);
  await exec(`cp -r ${outputVersionDir}/. ${outputLatestDir}`);
}

(async () => {
  await createDocs();
})();
