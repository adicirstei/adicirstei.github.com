var gulp = require('gulp'),
    jade = require('gulp-jade');

var buildBranch = require('./buildbranch');



gulp.task('default', ['templates', 'buildbranch']);


gulp.task('build', function() {
  // place code for your default task here
});


gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  gulp.src('src/**/*.jade')
  .pipe(jade({
      locals: YOUR_LOCALS
  }))
  .pipe(gulp.dest('./www'));
});

gulp.task('buildbranch', function() {
  
  buildBranch({
    branch: 'master',
    ignore: ['.git', 'www', 'node_modules'],
    folder: 'www',
    cwd: '.'
  }, function(err) {
    if(err) {
      throw err;
    }
    console.log('Published!');
  });

});