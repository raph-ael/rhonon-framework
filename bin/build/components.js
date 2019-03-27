/*
* Script to build our plugins to use them separately.
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
*/
const rollup  = require('rollup')
const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve');
const fs = require('fs');
const regenerator = require('rollup-plugin-regenerator');

const rootPath = '../../dist/js/components/';

const plugins = [
  resolve({
    module: true,
    main: true,
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  regenerator(),
];

const format = 'cjs'
const components = {
  Alert: path.resolve(__dirname, '../../src/js/components/alert/index.js'),
  Collapse: path.resolve(__dirname, '../../src/js/components/collapse/index.js'),
  Accordion: path.resolve(__dirname, '../../src/js/components/accordion/index.js'),
  Modal: path.resolve(__dirname, '../../src/js/components/modal/index.js'),
  ModalConfirm: path.resolve(__dirname, '../../src/js/components/modal/confirm.js'),
  ModalLoader: path.resolve(__dirname, '../../src/js/components/modal/loader.js'),
  ModalPrompt: path.resolve(__dirname, '../../src/js/components/modal/prompt.js'),
  Selectbox: path.resolve(__dirname, '../../src/js/components/selectbox/index.js'),
  Loader: path.resolve(__dirname, '../../src/js/components/loader/index.js'),
  Notification: path.resolve(__dirname, '../../src/js/components/notification/index.js'),
  OffCanvas: path.resolve(__dirname, '../../src/js/components/off-canvas/index.js'),
  Progress: path.resolve(__dirname, '../../src/js/components/progress/index.js'),
  Tab: path.resolve(__dirname, '../../src/js/components/tab/index.js'),
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = async function () {
  console.log('Building components...');
  const start = new Date();

  await asyncForEach(Object.keys(components), async (pluginKey) => {
    const bundle = await rollup.rollup({
      input: components[pluginKey],
      plugins,
    });

    const file = path.resolve(__dirname, `${rootPath}${pluginKey.toLowerCase()}.js`);

    try {
      await bundle.write({
        format,
        name: pluginKey,
        sourcemap: true,
        file,
      });

      const content = fs.readFileSync(file);
      const version = content.toString().match(/VERSION[ ]?=[ ]?['"]?([a-z0-9-_\.]+)['"]?/)[1];

      console.log(`|─ ${pluginKey}@${version}`);
    } catch(err) {
      console.error(`${pluginKey}: ${err}`)
    }
  });

  const end = new Date();

  console.log(`Done in ${(end.getTime() - start.getTime()) / 1000}s.`);
}
