const gulp = require('gulp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const livereload = require('gulp-livereload')
const sourcemaps = require('gulp-sourcemaps')
const minimist = require('minimist')
const gulpif = require('gulp-if')
const del = require('del')

const environment = {
  string: 'env',
  default: {env: process.env.NODE_ENV || 'production'}
}

const options = minimist(process.argv.slice(2), environment)

gulp.task('js', function () {
  const isDev = options.env == 'dev'
  return browserify({entries: './src/js/index.js', debug: isDev})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(isDev, uglify()))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest('./dist'))
    .pipe(gulpif(isDev, livereload()))
})

gulp.task('watch', ['js'], function () {
  livereload.listen()
  gulp.watch('./src/js/*.js', ['js'])
})

gulp.task('del', function () {
  del('dist')
})

gulp.task('setDev', function () {
  options.env = 'dev'
})

gulp.task('dev', ['setDev', 'del', 'watch'])

gulp.task('default', ['del', 'js'])


