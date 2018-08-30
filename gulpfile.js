/**
 * Polyfills
 */
require('es6-promise').polyfill();

/**
 * Plugins
 */
var clean = require('gulp-clean'),
	concat = require('gulp-concat'),
 	cp = require('child_process'),
 	del = require('del'),
 	fs	= require('fs'),
	git = require('gulp-git'),
 	gulp = require('gulp'),
 	jshint = require('gulp-jshint'),
 	mqpacker = require('css-mqpacker'),
 	prefix = require('gulp-autoprefixer'),
 	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
 	sass = require('gulp-sass'),
	sequence = require('gulp-sequence'),
 	size = require('gulp-size'),
 	sourcemaps = require('gulp-sourcemaps'),
 	svgSprite = require('gulp-svg-sprite'),
 	uglify = require('gulp-uglify'),
 	util = require('gulp-util'),
	watch = require('gulp-watch');

/**
 * Load Config Files
 */
var config = require('./gulp-config.json');

/**
 * handle error
 */
function handleError(err) {
	util.log(err.toString());
	this.emit('end');
}

/**
 * update Patterns
 */
gulp.task('updatePatternsSubmodule', function() {
	git.updateSubmodule({ args: '--remote patterns' });
});

gulp.task('copyPatterns', function() {
// TODO: Copy Assets, CSS, and JS
// TODO: Address old patterns - clean everything prefixed with 'patterns-'?
	return gulp.src(config.path.patterns + 'src/content/_includes/patterns/**/*.liquid')
		.pipe(rename(function(path) {
			path.basename = "patterns-" + path.dirname.replace(/\//g, "-") + "-" + path.basename;
			path.dirname = "";
		}))
		// TODO: Make this cleaner than a distinct operation
		//       for each level of nested directories
		.pipe(replace(
			/include \'([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\']+)\.liquid\'/,
		 	"include \'$1\-$2\-$3\-$4\-$5.liquid\'"
		))
		.pipe(replace(
			/include \'([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\']+)\.liquid\'/,
		 	"include \'$1\-$2\-$3\-$4.liquid\'"
		))
		.pipe(replace(
			/include \'([^\/]+)\/([^\/]+)\/([^\']+)\.liquid\'/,
		 	"include \'$1\-$2\-$3.liquid\'"
		))
		.pipe(replace(
			/include \'([^\/]+)\/([^\']+)\.liquid\'/,
		 	"include \'$1\-$2.liquid\'"
		))
		.pipe(gulp.dest(config.path.snippets));
});

gulp.task('updatePatterns', sequence('updatePatternsSubmodule', 'copyPatterns'));


/**
 * clean sprites
 */
gulp.task('clean-sprites', function () {
	return gulp.src(config.path.assets + 'sprite-*.svg', {read: false})
    	.pipe(clean());
});

/**
 * create svg sprite
 * @param  {String} key name of the sprite
 */
function spriteTask(key) {

	var taskName = key + 'Svg',
		taskDir = config.sprite.dir + key + '/*',
		taskSassDest = config.sprite.scss + '_' + key + '.scss',
		taskFileName = 'sprite-' + key + '.svg';

	gulp.task(taskName,['clean-sprites'],function() {
		return gulp.src(taskDir)
			.pipe(svgSprite({
				shape: {
					dimension : {
						precision : 0,
						attributes : true
					},
					spacing : {
						padding : 1,
						box : 'content'
					}
				},
				mode: {
					css: {
						dest: "",
						layout: "vertical",
						bust: false,
						sprite: taskFileName,
						render: {
							scss: {
								dest: taskSassDest,
								template: config.sprite.tpl
							}
						},
						prefix : key + "--%s",
						recursive : true,
						example : false,
						common : key,
						mixin : key + '-svg'
					}
				}
			}))
			.on('error',handleError)
			.pipe(gulp.dest(config.path.assets));
	});
};

/**
 * register sprite tasks
 * @type {Array} Comes from gulp-config.json
 */
var spriteTasks = [],
	sprites = config.sprites;

for (i=0;i<sprites.length;i++) {
	var val;

	val = sprites[i];

	spriteTask(val,i);
	spriteTasks.push(val + 'Svg');
}

/**
 * sprite build task
 */
gulp.task('sprites',spriteTasks);

/**
 * create sass tasks
 * @param  {String} key name of sass file
 */
function sassTask(key) {

	var taskName = key + 'Sass',
		taskDir = config.path.scss + key + '.scss';

	gulp.task(taskName,function() {
		return gulp.src(taskDir)
			.pipe(sass({outputStyle: 'expanded'}))
			.on('error',handleError)
			.pipe(prefix('last 5 version', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
			.pipe(gulp.dest(config.path.css));
	});
};

/**
 * combine media queries
 * @param  {String} key name of css file
 */
function sassMqPackTask(key) {

	var taskName = key + 'MqPack',
		taskDir = config.path.css + key + '.css',
		results = '',
		pattern = /^\s*\.q\s*\{[^}]*\}/gm;

	gulp.task(taskName,[key+'Sass'],function () {
		var css = fs.readFileSync(taskDir,'utf8');
		var result = mqpacker.pack(css, {
			from : taskDir,
			map : {
				inline : false
			},
			to : taskDir
		});

		fs.writeFileSync(taskDir, result.css);

		return gulp.src(taskDir,{base: taskDir})
			.pipe(replace('"{{', '{{'))
		    .pipe(replace('}}"', '}}'))
			.pipe(replace(pattern,''))
			.pipe(gulp.dest(taskDir))
			.pipe(gulp.dest(config.path.assets + key + '.scss.liquid'));
	});
};

/**
 * register sass tasks
 * @type {Array} comes from gulp-config.json
 */
var sassTasks = [],
    mqPackTasks = [],
	stylesheets = config.stylesheets;

for (i=0;i<stylesheets.length;i++) {
	var val = stylesheets[i];

	sassTask(val);
	sassMqPackTask(val);
	sassTasks.push(val + 'Sass');
	mqPackTasks.push(val + 'MqPack');
}

/**
 * task to build css
 */
gulp.task('sassTask',mqPackTasks);

/**
 * js lint
 * @param  {String} key name of js file
 * @param  {String} val directory of file
 */
function jsLintTask(key,val) {

	var taskName = key + 'Lint',
		files = [];

	for (i=0;i<val.length;i++) {

		var dir = val[i].dir,
			file = val[i].file;

		var file = config.path.js +  val[i].dir + '/' + val[i].file + '.js';

		if (dir !== 'plugins') {
			files.push(file);
		}

	}

	gulp.task(taskName,function() {
		return gulp.src(files)
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'));
	});
};


/**
 * concat js files
 * @param  {String} key name of js file
 * @param  {String} val directory of file
 */
function jsConcatTask(key,val) {

	var taskName = key + 'Concat',
		lintTask = key + 'Lint',
		output = key + '.js',
		files = [];

	for (i=0;i<val.length;i++) {

		var file = config.path.js +  val[i].dir + '/' + val[i].file + '.js';

		files.push(file);
	}

	gulp.task(taskName,[lintTask],function() {
		return gulp.src(files)
			.pipe(concat(output))
			.on('error',handleError)
			.pipe(gulp.dest(config.path.assets));
	});
};

/**
 * minify js
 * @param  {String} key name of js file
 * @param  {String} val directory of file
 */
function jsMinifyTask(key) {

	var taskName = key + "Minify",
		concatTask = key + 'Concat',
		input = config.path.assets + key + '.js';

	gulp.task(taskName,[concatTask],function() {
		return gulp.src(input)
			.pipe(uglify({
				mangle: true,
				output: {
					comments: false
				},
				compress: {
					drop_console: true,
					warnings: false
				}
			}))
			.on('error',handleError)
			.pipe(rename({ suffix :'.min'}))
			.pipe(gulp.dest(config.path.assets));
	});
};

/**
 * register js tasks
 * @type {Array} comes from gulp-config.json
 */
var scripts = config.scripts,
	jsLintTasks = [],
    jsConcatTasks = [],
    jsMinifyTasks = [];

for (var key in scripts) {
	var val;

	if (scripts.hasOwnProperty(key)) {
		val = scripts[key];
	}

	jsLintTask(key,val);
	jsLintTasks.push(key + 'Lint');
	jsConcatTask(key,val);
	jsConcatTasks.push(key + 'Concat');
	jsMinifyTask(key,val);
	jsMinifyTasks.push(key + 'Minify');
}


/**
 * js build task
 */
gulp.task('jsTask',jsMinifyTasks);

/**
 * watch task
 */
gulp.task('watch', function() {
	var allMqPackTasks = [];

	/**
	 * sprites - register a watch task for each files in the sprites array
	 */
	for (i=0;i<sprites.length;i++) {
		var val = sprites[i],
		dir = config.sprite.dir + val + '/*';

		gulp.watch(dir,[val + 'Svg']).on('error',handleError);
	}

	/**
	 * styles - register a watch task for each files in the styles array
	 */
	for (i=0;i<stylesheets.length;i++) {
		var val = stylesheets[i],
			file = config.path.scss + val + '.scss',
			dir = config.path.scss + val + '/**/*';

		// push MqPack tasks to array
		allMqPackTasks.push(val + 'MqPack');

		gulp.watch([file,dir], [val + 'MqPack']).on('error',handleError);
	}

	/**
	 * core - watch core sass files and rebuild all css if there's a change.
	 */
	gulp.watch([config.path.scss + 'core/**/*.scss'], [allMqPackTasks]).on('error', handleError);

	/**
	 * scripts - register a watch task for each file in the scripts array
	 */
	for (var key in scripts) {
		var val,
			task = key + 'Minify',
			files = [];

		if (scripts.hasOwnProperty(key)) {
			val = scripts[key];
		}

		for (i=0;i<val.length;i++) {
			var file = config.path.js +  val[i].dir + '/' + val[i].file + '.js';
			files.push(file);
		}

		gulp.watch(files, [task]).on('error',handleError);
	}
});

/**
 * default gulp task - activates all watch tasks
 */
gulp.task('default', ['watch']);

/**
 * build task - builds all sprites, sass, and javascript
 */
gulp.task('build', ['sprites','sassTask','jsTask']);
