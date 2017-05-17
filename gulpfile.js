var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('default', function() {
  console.log('gulp working...');
});

gulp.task('uglify', function (cb) {
  pump([
        gulp.src('development/*.js'),
        uglify(),
        gulp.dest('production')
    ],
    cb
  );
});