var gulp = require('gulp');

var buildBranch = require('./buildbranch');



gulp.task('default', function() {
  // place code for your default task here
});


gulp.task('build', function() {
  // place code for your default task here
});

gulp.task('buildbranch', function() {
  
  buildBranch({
    branch: 'master',
    ignore: ['.git', 'www', 'node_modules'],
    folder: 'www'
  }, function(err) {
    if(err) {
      throw err;
    }
    console.log('Published!');
  });

});