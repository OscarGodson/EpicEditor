var fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn

function concat(fileList, destPath) {
  var out = fileList.map(function (filePath) {
    return fs.readFileSync(filePath)
  })
  fs.writeFileSync(destPath, out.join('\n'))
}

function colorize(str, color) {
  var colors = 
    { 'blue': '34m'
    , 'cyan': '36m'
    , 'green': '01;32m'
    , 'magenta': '35m'
    , 'red': '31m'
    , 'yellow': '33m'
    }

  return colors[color] ? '\033[' + colors[color] + str + '\033[39m' : str
}

desc('Builds a temporary build of core code and runs against JSHint');
task('lint', [], function () {
  var srcDir = path.join(process.cwd() + '/src/')
    , srcPaths = 
      [ srcDir + 'intro.js'
      , srcDir + 'editor.js'
      ]
    , tempPath = srcDir + 'editor.tmp.js'
    , cmds = ['jshint ' + tempPath + ' --config .jshintrc']

  concat(srcPaths, tempPath)
  
  jake.exec(cmds, function () {
    // remove temporary core EE build
    fs.unlink(tempPath)
    console.log(colorize('√ Lint success! Giddyup.', 'green'))
  }, {stdout: true});
}, {async: false});


desc('Builds the index.html file from the README');
task('docs', [], function () {
  var destDir = path.join(process.cwd() + '/')
    , srcDir = path.join(process.cwd() + '/docs/')
    , readmePath = destDir + 'README.md'
    , tempPath = srcDir + 'README.html'
    , destPath = destDir + 'index.html'
    , srcPaths = 
      [ srcDir + 'header.html'
      , tempPath
      , srcDir + 'footer.html'
      ]
    , cmds = ['marked -o ' + tempPath + ' -i ' + readmePath + ' --gfm']

  jake.exec(cmds, function () {
    concat(srcPaths, destPath)
    // remove temporary README.html
    fs.unlink(tempPath)
    console.log(colorize('√ Docs build success!', 'green'))
  }, {stdout: true});
}, {async: false});


desc('Builds epiceditor.js and minified epiceditor.min.js');
task('build', [], function () {
  // First check for nolint flag for development builds
  // e.g. jake build[arg1,nolint,arg3]
  if (!!(Array.prototype.slice.call(arguments).indexOf('nolint'))) {
   jake.Task['lint'].invoke(); 
  }

  var destDir = path.join(process.cwd() + '/epiceditor/js/')
    , srcDir = path.join(process.cwd() + '/src/')
    , srcPaths = 
      [ srcDir + 'intro.js'
      , srcDir + 'marked/lib/marked.js'
      , srcDir + 'editor.js'
      ]
    , destPath = destDir + 'epiceditor.js'
    , destPathMin = destDir + 'epiceditor.min.js'
    , cmds = ['uglifyjs ' + destPath + ' > ' + destPathMin]

  // If the destination directory does not exist, create it
  jake.mkdirP('epiceditor/js');

  concat(srcPaths, destPath)

  jake.exec(cmds, function () {
    console.log(colorize('√ EpicEditor build success!', 'green'))
  }, {stdout: true});
}, {async: false});


desc('Tests code against specs');
task('test', [], function () {
  console.log(colorize('--> Test suite is now running (CTRL+C to quit) ','magenta'))
  console.log('--> http://localhost:5057/spec/runner.html');
  jake.exec(['foounit serve'], function () {}, {stdout: false});
});


desc('Kick out some ascii')
task('ascii', [], function () {
  var epicAscii = "" +
      "                                           \n" +
      "                               ',          \n" +
      "                    .eee.     .'           \n" +
      "                  .eeEEEEEe.               \n" +
      " EEEEEEEEEEEE'  .E'   `eEE'  .EEEEEEEEEEE  \n" +
      " EE           .E'    eEE`  .E          EE  \n" +
      " EE         .E'    eEE`    EE          EE  \n" +
      " EE       .E'    eEE`      EE              \n" +
      " EE     .E'    eEE`        EEEEEEEEEE      \n" +
      " EE          eEE`          EE              \n" +
      " EE   .    `eE`            EE              \n" +
      " EE   Ee'                  EE          EE  \n" +
      " EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE  \n"
  console.log(colorize(epicAscii, 'yellow'));
  console.log(colorize('EpicEditor - An Embeddable JavaScript Markdown Editor', 'yellow'))
})
