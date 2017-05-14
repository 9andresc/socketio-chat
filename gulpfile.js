const autoprefixer = require('gulp-autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const cleanCSS = require('gulp-clean-css')
const connect = require('gulp-connect')
const del = require('del')
const es = require('event-stream')
const globby = require('globby')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const nodemon = require('gulp-nodemon')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const standard = require('gulp-standard')
const uglify = require('gulp-uglify')

const paths = {
  cssPublicDir: 'public/css',
  jsPublicDir: 'public/js',
  jsServerFile: 'src/app.js',
  jsSourceFiles: 'src/**/*.js',
  jsViewsFiles: 'src/views/**/*.js',
  partialJsSourceFiles: 'src/**/_*.js',
  partialSassFiles: 'src/views/**/_*.sass',
  pugFiles: 'src/views/**/*.pug',
  sassFiles: 'src/views/**/*.sass'
}

gulp.task('clean:cssPublicDir', () =>
  del.sync([paths.cssPublicDir])
)

gulp.task('build:cssPublicFiles', () =>
  gulp.src([paths.sassFiles, `!${paths.partialSassFiles}`])
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer({
      browsers: [
        'Android >= 2.3',
        'BlackBerry >= 7',
        'Chrome >= 9',
        'Firefox >= 4',
        'Explorer >= 9',
        'iOS >= 5',
        'Opera >= 11',
        'Safari >= 5',
        'OperaMobile >= 11',
        'OperaMini >= 6',
        'ChromeAndroid >= 9',
        'FirefoxAndroid >= 4',
        'ExplorerMobile >= 9'
      ],
      cascade: false
    }))
    .pipe(gulpIf(
      process.env.NODE_ENV === 'development',
      rename({ dirname: '' }),
      rename({
        dirname: '',
        extname: '.min.css'
      })
    ))
    .pipe(gulpIf(process.env.NODE_ENV === 'production', cleanCSS()))
    .pipe(gulp.dest(paths.cssPublicDir))
    .pipe(connect.reload())
)

gulp.task('lint:jsSourceFiles', () =>
  gulp.src(paths.jsSourceFiles)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true,
      showFilePath: true,
      showRuleNames: true
    }))
)

gulp.task('clean:jsPublicDir', () =>
  del.sync([paths.jsPublicDir])
)

gulp.task('build:jsPublicFiles', (cb) => {
  globby([paths.jsViewsFiles, `!${paths.partialJsSourceFiles}`]).then((files) => {
    const tasks = files.map(entry =>
      browserify({ entries: [entry] })
        .transform(babelify, {
          presets: [
            ['env', {
              'targets': ['> 1%', 'last 2 versions', 'ie 9']
            }]
          ]
        })
        .bundle()
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(gulpIf(
          process.env.NODE_ENV === 'development',
          rename({ dirname: '' }),
          rename({
            dirname: '',
            extname: '.min.js'
          })
        ))
        .pipe(gulpIf(process.env.NODE_ENV === 'production', uglify()))
        .pipe(gulp.dest(paths.jsPublicDir))
        .pipe(connect.reload())
    )

    es.merge(tasks).on('end', cb)
  }).catch(err => cb(err))
})

gulp.task('build:publicSources', ['lint:jsSourceFiles', 'clean:jsPublicDir', 'build:jsPublicFiles', 'clean:cssPublicDir', 'build:cssPublicFiles'])

gulp.task('serve:jsSourceFiles', () =>
  nodemon({
    exec: 'node --inspect',
    ext: 'js pug',
    ignore: [paths.jsViewsFiles],
    script: paths.jsServerFile,
    watch: [paths.jsSourceFiles, paths.pugFiles]
  })
)

gulp.task('connect', () =>
  connect.server({
    livereload: true
  })
)

gulp.task('watch:sourceFiles', () => {
  gulp.watch(paths.sassFiles, ['clean:cssPublicDir', 'build:cssPublicFiles'])
  gulp.watch(paths.jsSourceFiles, ['lint:jsSourceFiles', 'clean:jsPublicDir', 'build:jsPublicFiles'])
  gulp.watch(paths.pugFiles, ['lint:jsSourceFiles', 'clean:jsPublicDir', 'build:jsPublicFiles'])
})

gulp.task('default', ['build:publicSources', 'serve:jsSourceFiles', 'watch:sourceFiles', 'connect'])
