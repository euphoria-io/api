import 'babel-polyfill'

import autoprefixer from 'gulp-autoprefixer'
import exec from 'gulp-exec'
import fileinclude from 'gulp-file-include'
import fork from 'child_process'
import gulp from 'gulp'
import gutil from 'gulp-util'
import less from 'gulp-less'
import marked from 'marked'
import rename from 'gulp-rename'
import serve from 'gulp-serve'
import tap from 'gulp-tap'

let watching = false

const apiStaticDest = './build'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: true,
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
  return gulp.src(['./*.less'])
    .pipe(less())
    .on('error', handleError('LESS error'))
    .pipe(autoprefixer({cascade: false}))
    .on('error', handleError('autoprefixer error'))
    .pipe(gulp.dest(apiStaticDest + '/css'))
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

gulp.task('statics', ['api-less', 'markdown'])

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

gulp.task('watch', () => {
  watching = true
  gulp.watch('./index.html', ['markdown'])
  gulp.watch('./heim/doc/api.md', ['markdown'])
  gulp.watch('./*.less', ['api-less'])
})

gulp.task('default', ['statics'])
gulp.task('develop', ['serve', 'watch'])

