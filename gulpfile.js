const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// Compile Sass & Inject Into Browser
gulp.task('sass', function () {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/**/*.scss'])
  .pipe(sourcemaps.init())
    .pipe(plumber(function (err) {
      console.log('Styles Task Error');
      console.log(err);
      this.emit('end');
    }))
		.pipe(sass({
			outputStyle: 'compressed'
    }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});


gulp.task('images', function () {
	return gulp.src('img/**/*.{png,jpeg,jpg,svg,gif}')
		.pipe(imagemin(
			[
				imagemin.gifsicle(),
				imagemin.jpegtran(),
				imagemin.optipng(),
				imagemin.svgo(),
				imageminPngquant(),
				imageminJpegRecompress()
			]
		))
		.pipe(gulp.dest('src/img'));
});

// Watch Sass & Server
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: "./src"
  });
  gulp.watch(['src/scss/**/*.*'], ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

 //Move Fonts Folder to src/fonts
gulp.task('fonts', function () {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest("src/fonts"));
  });

 //Move Font Awesome CSS to src/css
gulp.task('fa', function () {
 return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest("src/css"));
  });

gulp.task('default', ['fa','images', 'fonts','serve','sass']);

