/*jslint node:true, sloppy: true */

var gulp = require('gulp'),
  jade = require('gulp-jade'),
  tap = require('gulp-tap'),
  path = require('path');

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
  gulp.src('src/posts/*.md')
    .pipe(tap(function (file, t) {
      file.contents = new Buffer('extends ../layout\nblock content\n  include:md ' + path.basename(file.path));
    }))
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