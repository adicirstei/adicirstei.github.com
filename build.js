var buildBranch = require('./buildbranch');

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

