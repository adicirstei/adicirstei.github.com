/*jslint node:true, sloppy: true */
// Publish task
var exec = require('child_process').exec
  , path = require('path')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , Q = require('q')
;

function buildBranch(options, callback) {

  var curBranch = 'source'
    , execOptions = {}
    , command = ''
  ;

  // Checking options
  options.folder = options.folder || 'www';
  options.branch = options.branch || 'gh-pages';
  options.ignore = options.ignore || [];
  options.ignore.push('.git', 'node_modules', options.folder);
  options.cname = options.cname || 'CNAME';
  options.commit = options.commit || 'Build '+(new Date());
  options.cwd = options.cwd || process.cwd();
  execOptions.cwd = options.cwd;

  // Remember the current branch
  command = 'git rev-parse --abbrev-ref HEAD'


  Q.nfcall(exec, command, execOptions)
  .then(function (stdout, stderr) {
    curBranch = stdout.trim();
    return Q.nfcall(exec, 'git branch -D ' + options.branch, execOptions);
  }, callback)
  .then(function () { return Q.nfcall(exec, 'git checkout --orphan ' + options.branch, execOptions); }, callback)
  .then(function () { return Q.nfcall(exec, 'git rm -r --cached .', execOptions); }, callback)
  .then(function () {
    var ignore;
        // delete all files except the untracked ones
    ignore = options.ignore.slice(0);
    fs.readdirSync(options.cwd).forEach(function(file) {
      if(-1 === ignore.indexOf(file)) {
        rimraf.sync(path.join(options.cwd, file));
      }
    });
    fs.readdirSync(path.join(options.cwd, options.folder))
      .forEach(function(file) {
        fs.renameSync(path.join(options.cwd, options.folder, file),
          path.join(options.cwd, file));
    });
    fs.rmdirSync(path.join(options.cwd, options.folder));

    // Add the domain cname field
    if(options.domain) {
      fs.writeFileSync(path.join(options.cwd, options.cname), options.domain);
    }

    // Add a new ignore file
    ignore.push('.gitignore');
    fs.writeFileSync(path.join(options.cwd, '.gitignore'), ignore.join('\n'));    
    // Commit files
    return Q.nfcall(exec, 'git add .', execOptions);
    
  })
  .then(function () { return Q.nfcall(exec, 'git commit -m "' + options.commit.replace('"', '\\"') + '"', execOptions); }, callback)
  .then(function () { return Q.nfcall(exec, 'git push -f origin ' + options.branch, execOptions); }, callback)
  .then(function () { return Q.nfcall(exec, 'git checkout ' + curBranch, execOptions); }, callback)
  .then(function () { return Q.nfcall(exec, 'git checkout .', execOptions); }, callback)
  .then(callback);

}

module.exports = buildBranch;