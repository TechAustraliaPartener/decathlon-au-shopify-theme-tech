// Allows reading of environment variables from `.env` file
require('dotenv').config();

// Imported/called by parent gulp task

const gulpRollup = require('rollup-vinyl-stream2');
const rollup = require('rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonJs = require('rollup-plugin-commonjs');
const babel = require('@babel/core');
const hasha = require('hasha');
const { terser } = require('rollup-plugin-terser');
const glob = require('glob');
const path = require('path');
const del = require('del');
const mergeStreams = require('merge-stream');

const taskName = 'jsC4Scripts';

const prod = process.env.NODE_ENV === 'production';
const BUILT_PREFIX = 'built-';

const DESTINATION = './assets';

/**
 * In-memory babel cache to be shared between rebuilds.
 * This is used because a new Rollup instance is created on each file change,
 * so Rollup cannot know which files have changed since last time,
 * so it runs all transforms on all files every time
 * @type {Map<string, {inputHash: string, data: any }>}
 */
const babelCache = new Map();

function globals(modules) {
  // The null character (\0) is used to prevent other plugins from interfering with this one
  // Other rollup plugins will ignore module ids that start with \0 because they know they belong to other plugins
  const PREFIX = `\0virtual:`;

  // We are using a unique index for every import,
  // so that re-importing the same global in multiple entry points does not result in it being added to a shared chunk
  // because having it in a shared chunk provides no benefit and can result in unnecessary code loading
  let index = 0;

  return {
    name: 'globals',

    resolveId(id) {
      if (id in modules) return `${PREFIX}${id}?${index++}`;
    },

    load(id) {
      if (id.startsWith(PREFIX)) {
        const realId = id.slice(PREFIX.length).replace(/\?.*/, '');
        const globalName = modules[realId];
        // If this starts failing at some point in the future
        // (Rollup might throw an error saying that the variable isn't defined)
        // then this should be changed to `const ${globalName} = window.${globalName}; export default ${globalName}`
        return `export default ${globalName}`;
      }
    }
  };
}

module.exports = gulp => {
  gulp.task(taskName, () => {
    // Creates an object like: { checkout: 'scripts/checkout/index.js' }
    const entryModules = glob
      .sync('scripts/*/index.js')
      .reduce((entryModules, file) => {
        // 'scripts/checkout/index.js' => 'scripts/checkout' => 'checkout'
        const outputName = path.dirname(file).replace(/.*\//, '');
        entryModules[outputName] = file;
        return entryModules;
      }, {});

    del.sync(`assets/${BUILT_PREFIX}chunk-*`);

    const createRollupConfig = (input, type) => {
      const modern = type === 'modern';
      return gulpRollup({
        input,
        output: {
          format: modern ? 'esm' : 'iife',
          chunkFileNames: modern
            ? `${BUILT_PREFIX}[name]-[hash].js`
            : `${BUILT_PREFIX}[name]-[hash]-legacy.js`,
          entryFileNames: modern
            ? `${BUILT_PREFIX}[name].js`
            : `${BUILT_PREFIX}[name]-legacy.js`,
          preferConst: true
        },
        rollup,
        plugins: [
          // When we import jquery or handlebars, rollup will change references to the global variables
          // Rollup `externals` don't work with { format: 'esm' }
          globals({
            jquery: 'jQuery',
            handlebars: 'Handlebars'
          }),
          rollupNodeResolve(),
          rollupCommonJs({ include: 'node_modules/**' }),
          {
            name: 'rollup-plugin-babel',
            async transform(code, id) {
              if (!id.endsWith('.js')) return null;
              const envName = modern ? 'modern' : 'legacy';
              // We are keeping 2 copies of each file in the cache,
              // one for the modern output, and one for the legacy output
              const filenameHash = hasha([id, envName]);
              const inputHash = hasha(code);
              const cachedValue = babelCache.get(filenameHash);
              // If the file hasn't changed since last time it was transformed, use the result from last time
              if (cachedValue && cachedValue.inputHash === inputHash)
                return cachedValue.data;
              const transformed = await babel.transformAsync(code, {
                configFile: require.resolve('./babel.config.js'),
                filename: id,
                envName,
                caller: {
                  name: 'rollup-plugin-babel',
                  supportsStaticESM: true,
                  supportsDynamicImport: true
                }
              });
              babelCache.set(filenameHash, { inputHash, data: transformed });
              return transformed;
            }
          },
          prod &&
            terser({
              // With ecma set to 6+ terser will do some additional transforms to change things from es5 to smaller es6 equivalents
              // for example {a: a} will get transformed to {a}
              ecma: modern ? 6 : 5,
              compress: {
                passes: 4,
                unsafe: true,
                pure_getters: true
              },
              mangle: true
            })
        ],
        experimentalOptimizeChunks: true,
        chunkGroupingSize: 10000
      }).pipe(gulp.dest(DESTINATION));
    };

    return mergeStreams(
      createRollupConfig(entryModules, 'modern'),
      ...Object.entries(entryModules).map(([outputName, inputPath]) => {
        return createRollupConfig({ [outputName]: inputPath }, 'legacy');
      })
    );
  });

  return taskName;
};
