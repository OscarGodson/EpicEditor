var fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn

function colorize(str, color) {
  var colors = {
      'blue': '34m'
    , 'cyan': '36m'
    , 'green': '32m'
    , 'magenta': '35m'
    , 'red': '31m'
    , 'yellow': '33m'
    }

  return colors[color] ? '\033[' + colors[color] + str + '\033[39m' : str;
}

console.log(colorize('\nEpicEditor - An Embeddable JavaScript Markdown Editor', 'yellow'))

desc('Build tmp from core code and run through JSHint');
task('lint', [], function () {
  var srcPaths = ['src/intro.js', 'src/editor.js']
    , destPath = 'src/editor.tmp.js'
    , tmpStr = ''
    , cat
    , jshint
    , jshintErrors = ''
    , buff = ''

    console.log(colorize('--> Running JSHint', 'magenta'));
    // This is hacky as hell, needs to be optimized:
    // Create the tmp source from core code
    cat = spawn('cat', srcPaths)
    cat.stdout.on("data", function (data) {
      buff += data;
    });
    cat.stdout.on("end", function () {
      fs.writeFile(destPath, buff, function (err) {
        jshint = spawn('jshint', [destPath, '--config', '.jshintrc']);
        jshint.stdout.on('data', function (data) {
          jshintErrors += new Buffer(data).toString("utf-8")
        });
        jshint.stdout.on('end', function () {
          if (jshintErrors) {
            console.log(jshintErrors)
            console.log(colorize('Lint failed.', 'red') + '\n')
            fail();
          } else {
            console.log(colorize('√ Lint success! Giddyup.', 'green'))
          }
          fs.unlink(destPath);
        });
        jshint.stderr.on('data', function (data) {
          console.log('ERROR:', new Buffer(data).toString("utf-8"));
          fail();
          fs.unlink(destPath);
        });
      });
    });
    
});

desc('Build the index.html file from the README.');
task('docs', function () {
  var destDir = path.join(process.cwd() + '/')
    , srcDir = path.join(process.cwd() + '/docs/')
    , srcPaths =
      [ srcDir + 'header.html'
      , srcDir + 'README.html'
      , srcDir + 'footer.html'
      ]
    , cmds =
      [ 'cat ' + destDir + 'README.md | marked -o ' + srcDir + 'README.html --gfm'
      , 'cat ' + srcPaths.join(' ') + ' > ' + destDir + 'index.html'
      ]
  
  console.log(cmds)
  
  jake.exec(cmds, function () {
    fs.unlink(srcPaths[1]); // remove tmp README.html
    console.log(colorize('√ Build success!', 'green'))
  }, {stdout: true});
}, {async: false});

desc('Build epiceditor.js and epiceditor.min.js');
task('build', ['lint'], function () {
  var destDir = path.join(process.cwd() + '/epiceditor/js/')
    , srcDir = path.join(process.cwd() + '/src/')
    , srcPaths = [
      , srcDir + 'intro.js'
      , srcDir + 'marked/lib/marked.js'
      , srcDir + 'editor.js'
      ]
    , destPath = destDir + 'epiceditor.js'
    , destPathMin = destDir + 'epiceditor.min.js'
    , cat
    , buff = ''

  // If the destination directory ./epiceditor/js/ does not exist, create it
  if (!path.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
  
  // Create the unminified source file first
  cat = spawn('cat', srcPaths)
  cat.stdout.on("data", function (data) {
    buff += data;
  });
  cat.stdout.on("end", function () {
    console.log(colorize('--> Building source', 'magenta'));
    fs.writeFile(destPath, buff, function (err) {
      if (err) {
        console.log('ERROR:', err);
        fail();
      } else {
        // Minify the source
        var uglify = spawn('uglifyjs', [destPath])
          , buffMin = ''
          
        uglify.stdout.on("data", function(data) {
          buffMin += data;
        });
        uglify.stdout.on("end", function () {
          console.log(colorize('--> Minifying', 'magenta'));
          fs.writeFile(destPathMin, buffMin, function (err) {
            if (err) {
              console.log(colorize('Build failed.', 'red'), err);
              fail();
            } else {
              console.log(colorize('√ Build success!', 'green'));
            }
          });
        });
      }
    });
  });

}, {async: false});

desc('Tests code against specs');
task('test', [], function(){
  console.log(colorize('--> Test suite server is booting up','magenta'));
  
  var testTask = spawn('foounit',['serve']);

  testTask.stdout.on('data', function(data){
    console.log(colorize(data.toString('utf8'),'yellow'));
  });
  //Doesnt run?
  testTask.stdout.on('end', function(data){
    console.log(colorize("Test suite server connection has closed\n"+data,'magenta'));
  });
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
})
