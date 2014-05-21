/*jslint node:true, sloppy: true */

var gulp = require('gulp'),
  jade = require('gulp-jade'),
  tap = require('gulp-tap'),
  path = require('path'),
  posts = [];

var buildBranch = require('./buildbranch');



gulp.task('default', ['posts', 'copy', 'buildbranch']);


gulp.task('copy', function () {
  gulp.src('src/fonts/*')
    .pipe(gulp.dest('./www/fonts'));
  gulp.src('src/styles/*.css')
    .pipe(gulp.dest('./www/styles'));
  gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('./www/scripts'));
  gulp.src('src/images/*')
    .pipe(gulp.dest('./www/images'));
});


gulp.task('templates', function () {
  var YOUR_LOCALS = {};
    
  gulp.src('src/index.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www'));
  gulp.src('src/posts/*.md')
    .pipe(tap(function (file, t) {
      file.contents = new Buffer('extends ../layout\nblock content\n  include:md ' + path.basename(file.path));
    }))
    .pipe(tap(function (file, t) {
      posts.push(path.basename(file.path, '.md') + '.html');
    }))
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www/posts'));
  
});

gulp.task('posts', ['templates'], function () {
  var YOUR_LOCALS = {};
    
  YOUR_LOCALS.posts = posts.reverse();
  gulp.src('src/posts/index.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www/posts'));
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