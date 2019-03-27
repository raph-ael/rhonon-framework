const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function deploy() {
  // Copy Phonon
  const phononCSS = 'phonon.min.css';
  const phononJS = 'phonon.min.js';

  await exec(`cp ./dist/css/${phononCSS} ./site/${phononCSS}`);
  await exec(`cp ./dist/js/${phononJS} ./site/${phononJS}`);

  // Push to gh-pages
  // first push
  // await exec('git subtree push --prefix site origin gh-pages');

  // update
  await exec('git subtree split --prefix site origin gh-pages');
}

(async () => {
  await deploy();
})();
