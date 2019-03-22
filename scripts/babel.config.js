module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        exclude: ['transform-regenerator', 'transform-async-to-generator']
      }
    ]
  ],
  plugins: [
    'transform-inline-environment-variables',
    '@babel/plugin-transform-spread',
    [
      'module:fast-async',
      {
        compiler: {
          noRuntime: true
        }
      }
    ]
  ]
};
