var fs = require('fs')
  , path = require('path')
  , VERSION = fs.readFileSync('VERSION', 'utf-8')

function concat(fileList, destPath) {
  var out = fileList.map(function (filePath) {
    var file = fs.readFileSync(filePath, 'utf-8')
    file = file.replace(/@VERSION/g, VERSION)
    return file
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

desc('Builds a temporary build of core code and runs against JSHint')
task('lint', [], function () {
  console.log(colorize('--> Linting core', 'yellow'))
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
    console.log(colorize('  √ ok', 'green'))
    complete()
  }, {stdout: true})
}, {async: true})

desc('Builds epiceditor.js and minified epiceditor.min.js')
task('build', ['lint'], function () {
  console.log(colorize('--> Building', 'yellow'))
  var destDir = path.join(process.cwd() + '/epiceditor/js/')
    , srcDir = path.join(process.cwd() + '/src/')
    , srcPaths = 
      [ srcDir + 'intro.js'
      , srcDir + 'marked/lib/marked.js'
      , srcDir + 'editor.js'
      ]
    , destPath = destDir + 'epiceditor.js'
    , destPathMin = destDir + 'epiceditor.min.js'
    , cmds = ['git submodule update --init', 'uglifyjs ' + destPath + ' > ' + destPathMin]

  // If the destination directory does not exist, create it
  jake.mkdirP('epiceditor/js')
  
  
  
  concat(srcPaths, destPath)
  
  // Minify
  jake.exec(cmds, function () {
    console.log(colorize('  √ ok', 'green'))
    complete()
  }, {stdout: true})
}, {async: true})

namespace('build', function () {
  desc('Forces epiceditor.js and epiceditor.min.js build skipping pre-reqs')
  task('force', [], function () {
    console.log(colorize('--> Warning: Force build skips build pre-reqs. This build should not be commited.','magenta'))
    jake.Task['build'].execute()
  })
})

desc('Builds the index.html file from the README')
task('docs', [], function () {
  console.log(colorize('--> Building docs', 'yellow'))
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
    console.log(colorize('  √ ok', 'green'))
    complete()
  }, {stdout: true})
}, {async: true})

desc('Tests code against specs')
task('test', [], function () {
  console.log(colorize('--> Test suite is now running (CTRL+C to quit) ','magenta'))
  console.log('--> http://localhost:5057/spec/runner.html')
  jake.exec(['foounit serve'], function () {
    complete()
  }, {stdout: false})
}, {async: true})

desc('Kicks out some ascii')
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
  console.log(colorize(epicAscii, 'yellow'))
  console.log(colorize('EpicEditor - An Embeddable JavaScript Markdown Editor', 'yellow'))
})