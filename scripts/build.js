// Allows reading of environment variables from `.env` file
require('dotenv').config();

// Imported/called by parent gulp task

const rename = require('gulp-rename');
const gulpRollup = require('gulp-better-rollup');
const rollup = require('rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

const babelConfig = require('./babel.config');

const taskName = 'jsC4Scripts';

const prod = process.env.NODE_ENV === 'production';

module.exports = gulp => {
  gulp.task(taskName, () => {
    return gulp
      .src('scripts/*/index.js')
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
            external: ['jquery', 'handlebars']
          },
          {
            format: 'iife',
            globals: {
              jquery: 'jQuery',
              handlebars: 'Handlebars'
            }
          }
        )
      )
      .pipe(
        rename(path => {
          // Rename from /scripts/asdf/index.js to /scripts/asdf.js
          path.basename = path.dirname;
          path.dirname = './';
        })
      )
      .pipe(gulp.dest('assets'));
  });

  return taskName;
};
