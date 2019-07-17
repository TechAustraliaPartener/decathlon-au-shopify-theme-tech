/** @prettier */
const clean = require('gulp-clean');
const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sequence = require('gulp-sequence');
const spawn = require('cross-spawn');

const c4ScriptsTask = require('./scripts/build')(gulp);

const PATTERNS_PATH = 'patterns/';
const ASSETS_PATH = 'assets/';
const SNIPPETS_PATH = 'snippets/';

const patternCwd = path.join(__dirname, PATTERNS_PATH);

/**
 * update Patterns
 */
gulp.task('cleanPatternAssets', function() {
  // TODO: Decisions need to be made about how to handle images that are
  //       removed or renamed. This task just deletes all pattern images
  //       before copying the new images from the patterns submodule.
  return gulp.src('assets/patterns-*.*').pipe(clean());
});

gulp.task('cleanPatternSnippets', function() {
  // TODO: Decisions need to be made about how to handle patterns that are
  //       removed or renamed. This task just deletes all patterns before
  //       replacing with the new contents of the patterns submodule.
  return gulp.src('snippets/patterns-*.liquid').pipe(clean());
});

gulp.task(
  'cleanPatterns',
  sequence('cleanPatternAssets', 'cleanPatternSnippets')
);

gulp.task('updatePatternsSubmodule', function(callback) {
  const child = spawn(
    'git',
    ['submodule', 'update', '--remote', PATTERNS_PATH],
    { stdio: 'inherit' }
  );
  child.on('close', callback);
});

gulp.task('patterns:install', function(callback) {
  const child = spawn('npm', ['ci'], {
    cwd: patternCwd,
    stdio: 'inherit'
  });
  child.on('close', function(code) {
    if (code !== 0) throw new Error('npm install in patterns directory failed');
    callback();
  });
});

/* TODO: Debug: for some reason this task appears to complete without
         completing the /dist directory, which causes the subsequent
		 copy tasks to be no-ops. */
gulp.task('patterns:build', function(callback) {
  var shellOpts = {
    cwd: patternCwd,
    env: {
      ...process.env, // Extends existing environment variables
      NODE_ENV: 'production' // For optimized files
    },
    stdio: 'inherit'
  };
  spawn('npm', ['run', 'build'], shellOpts).on('close', callback);
});

gulp.task('patterns:copy:css', function() {
  return gulp
    .src('patterns/dist/styles/toolkit.css')
    .pipe(
      rename(function(path) {
        path.basename = 'patterns-' + path.basename;
        path.dirname = '';
      })
    )
    .pipe(gulp.dest(ASSETS_PATH));
});

gulp.task('patterns:copy:images', function() {
  return gulp
    .src([
      'patterns/dist/images/**/*',
      '!patterns/dist/images/{demos,demos/**}',
      '!patterns/dist/images/{fpo,fpo/**}'
    ])
    .pipe(
      rename(function(path) {
        path.basename = 'patterns-' + path.basename;
        path.dirname = '';
      })
    )
    .pipe(gulp.dest(ASSETS_PATH));
});

gulp.task('patterns:copy:js', function() {
  return gulp
    .src('patterns/dist/scripts/toolkit.js')
    .pipe(
      rename(function(path) {
        path.basename = 'patterns-' + path.basename;
        path.dirname = '';
      })
    )
    .pipe(gulp.dest(ASSETS_PATH));
});

gulp.task(
  'patterns:copy',
  sequence('patterns:copy:css', 'patterns:copy:images', 'patterns:copy:js')
);

gulp.task('transformPatterns', function() {
  return gulp
    .src(PATTERNS_PATH + 'src/content/_includes/patterns/**/*.liquid')
    .pipe(
      rename(function(path) {
        path.basename =
          'patterns-' + path.dirname.replace(/\//g, '-') + '-' + path.basename;
        path.dirname = '';
      })
    )
    .pipe(
      replace(/include ('?patterns[0-9A-Za-z\/\.\-\_]+)/g, function(match) {
        match = match.replace(/\'/g, '');
        match = match.replace(/\//g, '-');
        match = match.replace('.liquid', '');
        match = match.replace(/include\s+/, "include '");
        match += "'";
        return match;
      })
    )
    .pipe(gulp.dest(SNIPPETS_PATH));
});

gulp.task(
  'updatePatterns',
  sequence(
    'cleanPatterns',
    'updatePatternsSubmodule',
    'patterns:install',
    'patterns:build',
    'patterns:copy',
    'transformPatterns'
  )
);

/**
 * watch task
 */
gulp.task('watch', function() {
  gulp.watch('scripts/**/*.js', [c4ScriptsTask]);
});

/**
 * default gulp task - activates all watch tasks
 */
gulp.task('default', ['watch']);

/**
 * build task - builds all sprites, sass, and javascript
 */
gulp.task('build', [c4ScriptsTask]);
