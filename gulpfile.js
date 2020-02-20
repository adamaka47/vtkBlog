const gulp = require('gulp');
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const watch = require('gulp-watch')
const babel = require('gulp-babel')
const del = require('del')
const bs = require('browser-sync')
const gulpinclude = require('gulp-file-include')
const imagemin = require('gulp-imagemin')
const cheerio = require('gulp-cheerio')
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const replace = require('gulp-replace')



gulp.task('sass', function(cb) {

	return gulp.src('./src/sass/main.sass')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Sass styles',
					sound: false,
					message: err.message
				}
				})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/css/'))
		.pipe(bs.stream())
})


gulp.task('server', function() {

	bs.init({

		server: {
			baseDir: './src/'
		}

	})

})

gulp.task('svg', function() {

	return gulp.src('./src/img/**/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill')
				$('[stroke]').removeAttr('stroke')
				$('[style]').removeAttr('style')
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg",
				}
			}
		}))
		.pipe(gulp.dest('src/img'))

})

gulp.task('html', function() {

	return gulp.src('src/html/*.html')
		.pipe(gulpinclude({
			prefix: '@@'
		}))

		.pipe(gulp.dest('src/'))
		.pipe(bs.stream())


})


gulp.task('js', function() {

	return gulp.src('src/js/script.js')
		.pipe(rename('scriptvar.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('src/js/'))
		.pipe(bs.stream())


})

gulp.task('imagemin', function() {

	return gulp.src('src/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('src/img'))
		.pipe(bs.stream())

})


gulp.task('watch', function() {

	watch('src/html/**/*.html', gulp.parallel('html'))

	watch('src/sass/**', gulp.parallel('sass'))

	watch('src/js/script.js', gulp.parallel('js'))



})

gulp.task('del', function() {

	del.sync('build');

})


gulp.task('default', gulp.parallel('svg', 'html', 'sass', 'imagemin', 'js', 'del', 'server', 'watch'))


