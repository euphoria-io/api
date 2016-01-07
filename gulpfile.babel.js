import 'babel-polyfill'

import autoprefixer from 'gulp-autoprefixer'
import babelify from 'babelify'
import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import exec from 'gulp-exec'
import fileinclude from 'gulp-file-include'
import fork from 'child_process'
import gulp from 'gulp'
import gutil from 'gulp-util'
import less from 'gulp-less'
import marked from 'marked'
import rename from 'gulp-rename'
import serve from 'gulp-serve'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import tap from 'gulp-tap'
import watchify from 'watchify'

let watching = false

const apiStaticDest = './build'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  smartypants: true,
  tables: true,
})

function handleError(title) {
  return err => {
    gutil.log(gutil.colors.red(title + ':'), err.message)
    if (watching) {
      this.emit('end')
    } else {
      process.exit(1)
    }
  }
}

gulp.task('api-less', () => {
  gulp.src(['./css/*.less'])
    .pipe(less())
    .on('error', handleError('LESS error'))
    .pipe(autoprefixer({cascade: false}))
    .on('error', handleError('autoprefixer error'))
    .pipe(gulp.dest(apiStaticDest + '/css'))
})

gulp.task('js', ['api-less', 'markdown'], () => {
  browserify('./js/api.js', {debug: true})
    .transform(babelify, {presets: ['es2015', 'react', 'stage-2']})
    .require('immutable', {expose: 'immutable'})
    .require('lodash', {expose: 'lodash'})
    .require('react', {expose: 'react'})
    .require('reflux', {expose: 'reflux'})
    .bundle()
    .on('error', handleError('bundle error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./js', {includeContent: true}))
    .on('error', handleError('browserify error'))
    .pipe(gulp.dest(apiStaticDest + '/js'))
})

gulp.task('markdown', () => {
  gulp.src(['./heim/doc/api.md'])
    .pipe(tap((file, t) => {
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('markdown', 'stream not supported'))
        return
      }
      let content = marked(file.contents.toString())
      return gulp.src(['./index.html'])
        .pipe(fileinclude({context: {api: content}}))
        .pipe(gulp.dest(apiStaticDest))
    }))
})

gulp.task('statics', ['js'])

gulp.task('serve', ['statics'], serve({
  port: 4000,
  root: [apiStaticDest],
  middleware: (req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.end()
      return
    }
    next()
  },
}))

gulp.task('watchify', ['statics'], () => {
  const bundler = args => browserify('./js/api.js', args)
    .transform(babelify, {presets: ['es2015', 'react', 'stage-2']})
  const watchBundler = watchify(bundler({debug: true, ...watchify.args}))

  function rebundle() {
    return watchBundler.bundle()
      .on('error', handleError('JS error'))
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./js', {includeContent: true}))
      .on('error', handleError('browserify error'))
      .pipe(gulp.dest(apiStaticDest + '/js'))
  }

  watchBundler.on('log', gutil.log.bind(gutil, gutil.colors.green('JS')))
  watchBundler.on('update', rebundle)
  return rebundle()
})

gulp.task('watch', ['watchify'], () => {
  watching = true
  gulp.watch('./index.html', ['markdown'])
  gulp.watch('./heim/doc/api.md', ['markdown'])
  gulp.watch('./css/*.less', ['api-less'])

})

gulp.task('default', ['statics'])
gulp.task('develop', ['serve', 'watch'])

