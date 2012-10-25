var fs = require('fs')
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

desc('Lint all js files')
task('lint', [], function () {
  jake.Task['lint:all'].invoke()
}, {async: true})

namespace('lint', function () {
  var jakefile = 'Jakefile.js'
    , hint = 'node node_modules/jshint/bin/hint '
    , jshintrc = '.jshintrc'
    , editor = 'src/editor.js'
    , tests = 'test'
    , docs = 'docs/js/main.js'
    , codeprettify = 'src/codeprettify.js'

  task('all', ['lint:editor', 'lint:docs', 'lint:tests', 'lint:util', 'lint:addons'], function () {
    complete()
  }, {async: true})

  desc('Lint core EpicEditor: src/editor.js')
  task('editor', [], function () {
    console.log(colorize('--> Linting editor', 'yellow'))
    var files = [ editor ]
      , cmds = [hint + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})

  desc('Lint doc related js: docs/js/main.js')
  task('docs', [], function () {
    console.log(colorize('--> Linting docs', 'yellow'))
    var files = [ docs ]
      , cmds = [hint + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})

  desc('Lint test related js: test/*')
  task('tests', [], function () {
    console.log(colorize('--> Linting tests', 'yellow'))
    var files = [ tests ]
      , cmds = [hint + files.join(' ') + ' --config .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})

  desc('Lint utility and config js files')
  task('util', [], function () {
    console.log(colorize('--> Linting utils', 'yellow'))
    var files = [jshintrc, jakefile]
      , cmds = [hint + files.join(' ') + ' --config .jshintrc --extra-ext .jshintrc']

    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})
  
  desc('Lint addons of epiceditor')
  task('addons', [], function () {
    console.log(colorize('--> Linting addons', 'yellow'))
    jake.Task['lint:addons:codeprettify'].invoke()
  }, {async: true})

  namespace('addons', function () {
    desc('Lint core EpicEditor: src/codeprettify.js')
    task('codeprettify', [], function () {
      console.log(colorize('---> Linting addon:codeprettify', 'yellow'))
      console.log(colorize('----> Pass', 'yellow'))
      //var files = [ codeprettify ]
      //  , cmds = [hint + files.join(' ') + ' --config .jshintrc']
      //jake.exec(cmds, function () {
      //  console.log(colorize('  √ ok', 'green'))
      //complete()
      //}, {stdout: true})
    }, {async: true})
  })
})

desc('Build epiceditor and minify')
task('build', [], function () {
  jake.Task['build:all'].invoke()
}, {async: true})

namespace('build', function () {
  task('all', ['build:editor', 'build:addons'], function () {
    complete()
  }, {async: true})
  
  desc('Build epiceditor.js and minify to epiceditor.min.js')
  task('editor', ['lint:editor'], function () {
    console.log(colorize('--> Building editor', 'yellow'))
    var destDir = 'epiceditor/js/'
      , srcDir = 'src/'
      , parser = process.env.parser ? process.env.parser : 'node_modules/marked/lib/marked.js'
      , srcPaths =
        [ srcDir + 'editor.js'
        , parser
        ]
      , destPath = destDir + 'epiceditor.js'
      , destPathMin = destDir + 'epiceditor.min.js'
      , cmds = ['node node_modules/uglify-js/bin/uglifyjs ' + destPath + ' > ' + destPathMin]

    // If the destination directory does not exist, create it
    jake.mkdirP('epiceditor/js')

    if (!fs.existsSync(parser)) {
      fail("Parser path not found.")
    }

    concat(srcPaths, destPath)
    
    // Minify
    jake.exec(cmds, function () {
      console.log(colorize('  √ ok', 'green'))
      complete()
    }, {stdout: true})
  }, {async: true})

  desc('Build addons and minify')
  task('addons', [], function () {
    console.log(colorize('--> Building addons', 'yellow'))
    jake.Task['build:addons:all'].invoke()
  }, {async: true})

  desc('Build addons and minify')
  namespace('addons', function () {
    task('all', ['build:addons:codeprettify'], function () {
      complete()
    }, {async: true})
    
    desc('Build epiceditor.codeprettify.js and minify to epiceditor.codeprettify.min.js')
    task('codeprettify', [], function () {
      console.log(colorize('--> Building addons::codeprettify', 'yellow'))
      // code prettify plugin
      var destDir = 'epiceditor/addons/'
        , srcDir = 'src/'
        , srcPath = [srcDir + 'codeprettify.js']
        , destPath = destDir + 'epiceditor.codeprettify.js'
        , destPathMin = destDir + 'epiceditor.codeprettify.min.js'
        , cmds = ['node node_modules/uglify-js/bin/uglifyjs ' + srcPath + ' > ' + destPathMin]
        
      // If the destination directory does not exist, create it
      jake.mkdirP('epiceditor/addons')
      concat(srcPath, destPath)
      
      // Minify
      jake.exec(cmds, function () {
        console.log(colorize('  √ ok', 'green'))
        complete()
      }, {stdout: true})
    }, {async: true})
  })
})

namespace('build', function () {
  desc('Force build epiceditor.js and epiceditor.min.js skipping pre-reqs')
  task('force', [], function () {
    console.log(colorize('--> Warning: Force build skips build pre-reqs. This build should not be commited.', 'magenta'))
    jake.Task['build'].execute()
  })
})

desc('Build index.html from the README')
task('docs', ['lint:docs'], function () {
  console.log(colorize('--> Building docs', 'yellow'))
  var destDir = ''
    , srcDir = 'docs/'
    , readmePath = destDir + 'README.md'
    , tempPath = srcDir + 'README.html'
    , destPath = destDir + 'index.html'
    , srcPaths =
      [ srcDir + 'header.html'
      , tempPath
      , srcDir + 'footer.html'
      ]
    , cmds = ['node node_modules/marked/bin/marked -o ' + tempPath + ' -i ' + readmePath + ' --gfm']

  jake.exec(cmds, function () {
    concat(srcPaths, destPath)
    // remove temporary README.html
    fs.unlink(tempPath)
    console.log(colorize('  √ ok', 'green'))
    complete()
  }, {stdout: true})
}, {async: true})

desc('Test code against tests')
task('test', ['lint:tests'], function () {
  console.log(colorize('--> Test suite is now running (CTRL+C to quit)', 'magenta'))
  console.log(colorize('--> http://localhost:8888/test/tests.html', 'yellow'))
  jake.exec(['node test/server.js'], function () {
    complete()
  }, {stdout: false})
}, {async: true})

var pkg = new jake.PackageTask('EpicEditor', 'v' + VERSION, function () {
  var fileList = ['epiceditor/**']
  this.packageDir = "docs/downloads"
  this.packageFiles.include(fileList)
  this.needZip = true
})

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
  console.log(colorize(epicAscii, 'yellow'))
  console.log(colorize('EpicEditor - An Embeddable JavaScript Markdown Editor', 'yellow'))
})
