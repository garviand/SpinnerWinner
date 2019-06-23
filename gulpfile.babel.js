import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import log from 'gulplog';

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(plumber())
    .pipe(source('./spinner.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./example'))
    .pipe(rename('spinner.min.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dev', function () {
  gulp.watch('src/js/*.js', gulp.series('javascript'));
});