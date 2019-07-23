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
const changed = require('gulp-changed');

const babelConfig = require('./babel.config');

const taskName = 'jsC4Scripts';

const prod = process.env.NODE_ENV === 'production';
const BUILT_PREFIX = 'built-';

const DESTINATION = './assets';

module.exports = gulp => {
  gulp.task(taskName, () => {
    return (
      gulp
        .src('scripts/*/index.js')
        .pipe(
          gulpRollup(
            {
              rollup,
              plugins: [
                rollupNodeResolve(),
                rollupCommonJs(),
                babel({ babelrc: false, ...babelConfig, exclude: [/core-js/] }),
                prod &&
                  terser({
                    compress: {
                      passes: 4,
                      unsafe: true,
                      pure_getters: true
                    },
                    mangle: true
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
            // Rename from asdf/index.js to built-asdf.js
            path.basename = `${BUILT_PREFIX}${path.dirname}`;
            path.dirname = './';
          })
        )
        // We don't want files to be written to `assets` if they are not different.
        // Otherwise themekit will re-upload them
        .pipe(changed(DESTINATION, { hasChanged: changed.compareContents }))
        .pipe(gulp.dest(DESTINATION))
    );
  });

  return taskName;
};
