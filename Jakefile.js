var fs = require('fs')
  , path = require('path')
  , VERSION = fs.readFileSync(path.join(process.cwd() + '/VERSION'), 'utf-8')

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
  jake.Task['lint:all'].invoke();
}, {async: true})

namespace('lint', function () {
  var cwd = process.cwd()
    , jakefile = path.join(cwd + '/Jakefile.js')
    , jshintrc = path.join(cwd + '/.jshintrc')
    , editor = path.join(cwd + '/src/editor.js')
    , spec = path.join(cwd + '/spec/spec.js')
    , docs = path.join(cwd + '/docs/js/main.js')

  desc('Lints all js files')
  task('all', ['lint:editor', 'lint:docs', 'lint:spec', 'lint:util'], function () {
    complete()
  }, {async: true})
  task('editor', [], function () {
    console.log(colorize('--> Linting editor', 'yellow'))
    var cwd = process.cwd()
      , files = [ editor ]
      , cmds = ['jshint ' + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})
  task('docs', [], function () {
    console.log(colorize('--> Linting docs', 'yellow'))
    var cwd = process.cwd()
      , files = [ docs ]
      , cmds = ['jshint ' + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})
  task('spec', [], function () {
    console.log(colorize('--> Linting specs', 'yellow'))
    var cwd = process.cwd()
      , files = [ spec ]
      , cmds = ['jshint ' + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})
  task('util', [], function () {
    console.log(colorize('--> Linting utils', 'yellow'))
    var cwd = process.cwd()
      , files = [ jshintrc, jakefile ]
      , cmds = ['jshint ' + files.join(' ') + ' --config .jshintrc --extra-ext .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})
})

desc('Builds epiceditor.js and minified epiceditor.min.js')
task('build', ['lint:editor'], function () {
  console.log(colorize('--> Building', 'yellow'))
  var destDir = path.join(process.cwd() + '/epiceditor/js/')
    , srcDir = path.join(process.cwd() + '/src/')
    , parser = process.env.parser ? process.env.parser : srcDir + 'marked/lib/marked.js'
    , srcPaths =
      [ srcDir + 'editor.js'
      , parser
      ]
    , destPath = destDir + 'epiceditor.js'
    , destPathMin = destDir + 'epiceditor.min.js'
    , cmds = ['git submodule update --init', 'uglifyjs ' + destPath + ' > ' + destPathMin]

  // If the destination directory does not exist, create it
  jake.mkdirP('epiceditor/js')
  
  if (!path.existsSync(parser)) {
    fail("Parser path not found.")
  }
  
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
    console.log(colorize('--> Warning: Force build skips build pre-reqs. This build should not be commited.', 'magenta'))
    jake.Task['build'].execute()
  })
})

desc('Builds the index.html file from the README')
task('docs', ['lint:docs'], function () {
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
task('test', ['lint:spec'], function () {
  console.log(colorize('--> Test suite is now running (CTRL+C to quit)', 'magenta'))
  console.log(colorize('--> http://localhost:5057/spec/runner.html', 'yellow'))
  jake.exec(['foounit serve'], function () {
    complete()
  }, {stdout: false})
}, {async: true})

var pkg = new jake.PackageTask('EpicEditor', 'v' + VERSION, function () {
  var fileList = [ 'epiceditor']
  this.packageDir = "docs/downloads"
  this.packageFiles.include(fileList);
  this.needZip = true;
})

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