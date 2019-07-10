/**
 * Plugins
 */
var clean = require('gulp-clean'),
	concat = require('gulp-concat'),
 	fs	= require('fs'),
 	gulp = require('gulp'),
 	jshint = require('gulp-jshint'),
 	mqpacker = require('css-mqpacker'),
	path = require('path'),
 	prefix = require('gulp-autoprefixer'),
 	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
 	sass = require('gulp-sass'),
	sequence = require('gulp-sequence'),
	spawn = require('cross-spawn'),
 	svgSprite = require('gulp-svg-sprite'),
 	uglify = require('gulp-uglify'),
 	util = require('gulp-util')

const c4ScriptsTask = require('./scripts/build')(gulp);

/**
 * Load Config Files
 */
var config = require('./gulp-config.json');

const patternDir = 'patterns';
const patternCwd = path.join(__dirname, patternDir);

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

gulp.task('cleanPatternAssets', function() {
	// TODO: Decisions need to be made about how to handle images that are
	//       removed or renamed. This task just deletes all pattern images
	//       before copying the new images from the patterns submodule.
	return gulp.src('assets/patterns-*.*')
		.pipe(clean());
});

gulp.task('cleanPatternSnippets', function() {
	// TODO: Decisions need to be made about how to handle patterns that are
	//       removed or renamed. This task just deletes all patterns before
	//       replacing with the new contents of the patterns submodule.
	return gulp.src('snippets/patterns-*.liquid')
		.pipe(clean());
});

gulp.task('cleanPatterns', sequence('cleanPatternAssets', 'cleanPatternSnippets'));

gulp.task('updatePatternsSubmodule', function(callback) {
	const child = spawn('git', ['submodule', 'update', '--remote', patternDir], {
		stdio: 'inherit'
	});
	child.on('close', callback);
});

gulp.task('patterns:install', function (callback) {
	const child = spawn('npm', ['ci'], {
		cwd: patternCwd,
		stdio: 'inherit'
	});
	child.on('close', function (code) {
		if (code !== 0) throw new Error('npm install in patterns directory failed');
		callback();
	});
});

/* TODO: Debug: for some reason this task appears to complete without
         completing the /dist directory, which causes the subsequent
		 copy tasks to be no-ops. */
gulp.task('patterns:build', function (callback) {
	var shellOpts = {
		cwd: patternCwd,
		env: {
			...process.env, // Extends existing enviroment variables
			NODE_ENV: 'production' // For optimized files
		},
		stdio: 'inherit'
	};
	spawn('npm', ['run', 'build'], shellOpts).on('close', callback);
});

gulp.task('patterns:copy:css', function () {
  return gulp.src('patterns/dist/styles/toolkit.css')
  	.pipe(rename(function(path){
		path.basename = "patterns-" + path.basename;
		path.dirname = "";
	}))
    .pipe(gulp.dest(config.path.assets));
});

gulp.task('patterns:copy:images', function () {
  return gulp.src([
	  'patterns/dist/images/**/*',
	  '!patterns/dist/images/{demos,demos/**}',
	  '!patterns/dist/images/{fpo,fpo/**}'
  	])
  	.pipe(rename(function(path){
		path.basename = "patterns-" + path.basename;
		path.dirname = "";
  	}))
    .pipe(gulp.dest(config.path.assets));
});

gulp.task('patterns:copy:js', function () {
  return gulp.src('patterns/dist/scripts/toolkit.js')
  	.pipe(rename(function(path){
		path.basename = "patterns-" + path.basename;
		path.dirname = "";
  	}))
    .pipe(gulp.dest(config.path.assets));
});

gulp.task('patterns:copy', sequence('patterns:copy:css', 'patterns:copy:images', 'patterns:copy:js'));

gulp.task('transformPatterns', function() {
	return gulp.src(config.path.patterns + 'src/content/_includes/patterns/**/*.liquid')
		.pipe(rename(function(path) {
			path.basename = "patterns-" + path.dirname.replace(/\//g, "-") + "-" + path.basename;
			path.dirname = "";
		}))
		.pipe(replace(/include ('?patterns[0-9A-Za-z\/\.\-\_]+)/g, function(match) {
			match = match.replace(/\'/g, "");
			match = match.replace(/\//g, "-");
			match = match.replace(".liquid", "");
			match = match.replace(/include\s+/, "include '");
			match += "'";
			return match;
		}))
		.pipe(gulp.dest(config.path.snippets));
});

gulp.task('updatePatterns',
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
gulp.task('jsTask', [...jsMinifyTasks, c4ScriptsTask]);

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

	gulp.watch(config.path.c4Scripts + '**/*.js', [c4ScriptsTask])

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
