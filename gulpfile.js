/*jslint node:true, sloppy: true */

var gulp = require('gulp'),
  jade = require('gulp-jade'),
  tap = require('gulp-tap'),
  path = require('path'),
  posts = [],
  marked = require('marked');


marked.setOptions({
  highlight: function (code, lang) {
    var hl = require('highlight.js');
    if (hl.getLanguage(lang)) {
      return hl.highlight(lang, code).value;
    } else {
      return hl.highlightAuto(code).value;
    }
  }
});

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
  var YOUR_LOCALS = {
    md: marked
  };
    
  gulp.src('src/index.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www'));
  return gulp.src('src/posts/*.md')
    .pipe(tap(function (file, t) {
      var filename = path.basename(file.path, '.md'),
        contents = file.contents,
        title = contents.toString().split('\n')[0] || filename, 
        newfile = filename;
      title = title.replace(/^#*\s*/g, '').trim().replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
      file.contents = new Buffer('extends layout\nblock content\n  article\n    include:md ' + path.basename(file.path));
      newfile = title.replace(/(\s|-|_)+/g, '-').toLowerCase();
      file.path = file.path.replace(filename, newfile);
      posts.push({ file: newfile + '.html', title: title, md: filename + '.md', date: filename.slice(0, 4) + '-' + filename.slice(4, 6) + '-' + filename.slice(6, 8)});

    }))
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./www/posts'));
  
});

gulp.task('posts', ['templates'], function () {

  posts.reverse();
  gulp.src('src/posts/index.jade')
    .pipe(jade({
      locals: {
        posts: posts
      },
      md: marked
    }))
    .pipe(gulp.dest('./www/posts'))
    .pipe(tap(function (file) {
      file.contents = new Buffer(JSON.stringify({posts: posts}));
      file.path = './www/data/posts.json';
    }))
//    .pipe(rename("posts.json"))
    .pipe(gulp.dest('./www/data'));
});

gulp.task('build', ['posts', 'copy']);


gulp.task('buildbranch', function (cb) {
  
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
    if (cb) {
      cb();
    }
  });

});