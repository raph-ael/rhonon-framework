const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

async function releaseGithubRelease() {
  const { version } = pkg;

  console.log(`Creating release ${version}`);

  const semVerMatch = version.match(/^[0-9.]+/);
  const semVer = semVerMatch[0];

  let command = `./node_modules/release/bin/release.js ${version}`;
  const preReleaseMatch = version.match(/[-]+[a-z]+/);

  let preRelease = null;

  if (preReleaseMatch && preReleaseMatch.length > 0) {
    preRelease = preReleaseMatch[0].replace('-', '');
  }

  if (preRelease) {
    command += ` pre ${preRelease}`;
  }

  const { stdout, stderr } = await exec(command);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

async function releaseNPMPackage() {
  const { stdout, stderr } = await exec('ls ./node_modules');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

(async () => {
  await releaseGithubRelease();
  // await releaseNPMPackage();
})();
