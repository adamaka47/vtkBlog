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

	return gulp.src('./docs/sass/main.sass')
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
		.pipe(gulp.dest('./docs/css/'))
		.pipe(bs.stream())
})


gulp.task('server', function() {

	bs.init({

		server: {
			baseDir: './docs/'
		}

	})

})

gulp.task('svg', function() {

	return gulp.src('./docs/img/**/*.svg')
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
		.pipe(gulp.dest('docs/img'))

})

gulp.task('html', function() {

	return gulp.src('docs/html/*.html')
		.pipe(gulpinclude({
			prefix: '@@'
		}))

		.pipe(gulp.dest('docs/'))
		.pipe(bs.stream())


})


gulp.task('js', function() {

	return gulp.src('docs/js/script.js')
		.pipe(rename('scriptvar.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('docs/js/'))
		.pipe(bs.stream())


})

gulp.task('imagemin', function() {

	return gulp.src('docs/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('docs/img'))
		.pipe(bs.stream())

})


gulp.task('watch', function() {

	watch('docs/html/**/*.html', gulp.parallel('html'))

	watch('docs/sass/**', gulp.parallel('sass'))

	watch('docs/js/script.js', gulp.parallel('js'))



})

gulp.task('del', function() {

	del.sync('build');

})


gulp.task('default', gulp.parallel('svg', 'html', 'sass', 'imagemin', 'js', 'del', 'server', 'watch'))


