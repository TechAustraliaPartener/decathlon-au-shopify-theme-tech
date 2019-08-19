/** @prettier */

// Babel-jest was not being run without this file

const config = {
  presets: [
    [
      '@babel/preset-env',
      { loose: true, targets: { node: 'current' }, modules: 'commonjs' }
    ]
  ]
};
module.exports = require('babel-jest').createTransformer(config);
