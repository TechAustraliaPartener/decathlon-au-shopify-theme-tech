const browserslist = require('browserslist');

const allSupportedBrowsers = browserslist();

// This is better than setting { esmodules:true } with babel-preset-env
// Babel's esmodules does not merge with the existing browserslist, it overrides it
const esmBrowsers = allSupportedBrowsers.filter(
  browser => !browser.startsWith('ie')
);

module.exports = api => {
  // Passed from rollup config
  const isModernBundle = api.env('modern');
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // Enabling loose transforms results in much smaller output code that works for most use cases
          loose: true,
          exclude: ['transform-regenerator', 'transform-async-to-generator'],
          targets: isModernBundle ? esmBrowsers : allSupportedBrowsers
        }
      ]
    ],
    plugins: [
      // Extracts all shared utils into imports so that they don't get duplicated in the bundle
      [
        '@babel/plugin-transform-runtime',
        // See https://github.com/babel/babel/issues/10261#issuecomment-514687857 for why the `version` field is needed
        { useESModules: true, version: '^7.5' }
      ],
      'transform-inline-environment-variables',
      // This gets included in preset-env, but for this plugin specifically we need it to have `loose: false` (the default)
      // The loose transform spread only works with spreading arrays, no iterables. so it doesn't work for our use case.
      !isModernBundle && '@babel/plugin-transform-spread',
      // This gets included in preset-env, but for this plugin specifically we need it to have `useBuiltIns: true`
      // so that Object.assign is used instead of _extends (polyfill.io gives us a conditional polyfill for this)
      [
        '@babel/plugin-proposal-object-rest-spread',
        { useBuiltIns: true, loose: true }
      ],
      // For the legacy bundle we are transpiling async/await to .then/.catch rather than to generators + regeneratorRuntime
      // because regeneratorRuntime (generator polyfill) is large and slow-ish
      // We are leaving async/await as-is for modern browsers
      !isModernBundle && [
        'module:fast-async',
        {
          compiler: {
            noRuntime: true
          }
        }
      ]
    ].filter(Boolean)
  };
};
