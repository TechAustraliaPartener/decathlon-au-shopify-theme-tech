module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'usage',
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
    ],
    require.resolve('./babel-plugin-transform-remove-regex-polyfill')
  ]
};
