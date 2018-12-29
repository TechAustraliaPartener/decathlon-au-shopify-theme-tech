// Imported/called by parent gulp task

const rename = require('gulp-rename');
const gulpRollup = require('gulp-better-rollup');
const rollup = require('rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

const babelConfig = require('./babel.config');

const taskName = 'jsPersistentCart';

const prod = process.env.NODE_ENV === 'production';

module.exports = gulp => {
  gulp.task(taskName, () => {
    return gulp
      .src(require.resolve('.'))
      .pipe(
        gulpRollup(
          {
            rollup,
            plugins: [
              rollupNodeResolve(),
              rollupCommonJs(),
              babel({ babelrc: false, ...babelConfig }),
              terser({
                compress: {
                  passes: 4,
                  unsafe: true,
                  pure_getters: true,
                  join_vars: prod
                },
                mangle: prod,
                output: { beautify: !prod }
              })
            ],
            external: ['jquery']
          },
          {
            format: 'iife',
            globals: { jquery: 'jQuery' }
          }
        )
      )
      .pipe(rename('persistent-cart.js'))
      .pipe(gulp.dest('assets'));
  });

  return taskName;
};
