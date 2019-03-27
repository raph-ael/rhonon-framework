const rollup  = require('rollup');
const path    = require('path');
const babel   = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const UglifyJS = require('uglify-js');
const fs = require('fs');
const regenerator = require('rollup-plugin-regenerator');
const pkg     = require(path.resolve(__dirname, '../../package.json'));
const year    = new Date().getFullYear();

const format = 'umd';
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

module.exports = async function (fileName, srcFile) {
  const fileDest  = `${fileName}.js`
  const fileDestMin = `${fileName}.min.js`

  console.log(`Building ${fileName} package...`);

  const start = new Date();
  const bundle = await rollup.rollup({
    input: path.resolve(__dirname, srcFile),
    plugins,
  });

  try {
    const file = path.resolve(__dirname, `../../dist/js/${fileDest}`);
    const fileMin = path.resolve(__dirname, `../../dist/js/${fileDestMin}`);
    const fileMinMap = path.resolve(__dirname, `../../dist/js/${fileDestMin}.map`);

    await bundle.write({
      banner: `/*!
    * Phonon v${pkg.version} (${pkg.homepage})
    * Copyright 2015-${year} ${pkg.author}
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    */`,
      file,
      format,
      name: 'phonon',
      format,
      name: fileName,
      sourcemap: true,
    });

    const result = UglifyJS.minify(fs.readFileSync(file, 'utf8'), {
      sourceMap: {
        filename: fileDestMin,
        url: `${fileDestMin}.map`,
      },
    });

    if (result.error) throw result.error;

    // minified file
    fs.writeFileSync(fileMin, result.code, 'utf8');

    // source map
    fs.writeFileSync(fileMinMap, result.map, 'utf8');

    const end = new Date();

    console.log(`Done in ${(end.getTime() - start.getTime()) / 1000}s.`);
  } catch(err) {
    console.error(`${fileName}: ${err}`);
  }
}
