/*jslint node:true, sloppy: true */

var gulp = require('gulp'),
  jade = require('gulp-jade'),
  tap = require('gulp-tap');

var buildBranch = require('./buildbranch');



gulp.task('default', ['templates', 'buildbranch']);


gulp.task('build', function () {
  
});


gulp.task('templates', function () {
  var YOUR_LOCALS = {};
  gulp.src('src/**/index.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('buildbranch', function () {
  
  buildBranch({
    branch: 'master',
    ignore: ['.git', 'www', 'node_modules'],
    folder: 'www',
    cwd: '.'
  }, function (err) {
    if (err) {
      throw err;
    }
    console.log('Published!');
  });

});