module.exports = {
  presets: [
    ['@babel/env', {
      useBuiltIns: 'entry', // .browserslistrc file to specify targets
    }],
  ],
};
