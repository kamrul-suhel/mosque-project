var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var zip = require('gulp-zip');

// Less plugins
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new LessAutoprefix({
	browsers: ['last 2 versions']
});

// Handlebars plugins
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');
var filesExist = require('files-exist');


// // Styles
// gulp.task('styles', function () {
// 	console.log('starting styles task');
// 	return gulp.src(['public/css/reset.css', CSS_PATH])
// 		.pipe(plumber(function (err) {
// 			console.log('Styles Task Error');
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(autoprefixer())
// 		.pipe(concat('styles.css'))
// 		.pipe(minifyCss())
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(DIST_PATH))
// 		.pipe(livereload());
// });



// Styles For SCSS bootstrap & fontawesome
gulp.task('bootfont', function () {
    console.log('starting styles task');
    return gulp.src('./public/scss/plugin/bootstrap-fontawesome.scss')
        .pipe(plumber(function (err) {
            console.log('Styles Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
		.pipe(concat('boot-font.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/dist/css/plugin/'))

		//copy font file to directory
		.pipe(gulp.src('node_modules/font-awesome/fonts/**/*'))
		.pipe(gulp.dest('./public/dist/css/plugin/fonts/'))
});


// Styles For SCSS
gulp.task('styles', function () {
	console.log('starting styles task');
	return gulp.src('./public/scss/styles.scss')
		.pipe(plumber(function (err) {
			console.log('Styles Task Error');
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/dist/css/'))
		.pipe(livereload());
});

// Styles For LESS
// gulp.task('styles', function () {
// 	console.log('starting styles task');
// 	return gulp.src('public/less/styles.less')
// 		.pipe(plumber(function (err) {
// 			console.log('Styles Task Error');
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(less({
// 			plugins: [lessAutoprefix]
// 		}))
// 		.pipe(minifyCss())
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(DIST_PATH))
// 		.pipe(livereload());
// });

// Bootstrap & other Scripts
gulp.task('bootstrap-other-js', function () {
    console.log('starting scripts task');

    return gulp.src(filesExist([
    	'node_modules/jquery/dist/jquery.js',
        'node_modules/tether/dist/js/tether.js',
		'node_modules/bootstrap/dist/js/bootstrap.js'
    ],{ exceptionMessage: 'Please run `bower install` to install missing library' }))
        .pipe(plumber(function (err) {
            console.log('Scripts Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('bootstrap-other.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/js/plugin/'))
});



// Scripts
gulp.task('scripts', function () {
	console.log('starting scripts task');

	return gulp.src('./public/scripts/**/*.js')
		.pipe(plumber(function (err) {
			console.log('Scripts Task Error');
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/dist/js/'))
		.pipe(livereload());
});

// Images
gulp.task('images', function () {
	console.log('starting images task');
});


gulp.task('default', ['images', 'styles', 'scripts'], function () {
	console.log('Starting default task');
});

gulp.task('export', function () {
	return gulp.src('./public/**/*')
		.pipe(zip('website.zip'))
		.pipe(gulp.dest('./'))
});

//html File reload
gulp.task('html_file',function(){
	return gulp.src('./public/**/*.html')
		.pipe(livereload())
});

gulp.task('watch', ['default'], function () {
	console.log('Starting watch task');
	require('./server.js');
	livereload.listen();
	gulp.watch('./public/scripts/**/*.js', ['scripts']);
	// gulp.watch(CSS_PATH, ['styles']);
	gulp.watch('./public/scss/**/*.scss', ['styles']);

	//html file watch
	gulp.watch('./public/**/*.html',['html_file']);
});