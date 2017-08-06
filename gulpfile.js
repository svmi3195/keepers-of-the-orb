var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var exec = require('child_process').exec;

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

gulp.task('run', function(cb){
  exec('node server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});