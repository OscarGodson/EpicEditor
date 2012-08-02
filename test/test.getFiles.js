describe('#getFiles([name])', function () {
  var testEl
    , id
    , editor
    , fooFile
    , barFile
    ;

  before(function (done) {
    localStorage.clear();
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({
      basePath: '/epiceditor/'
    , container: testEl
    , localStorageName: 'epiceditor-getFiles'
    })
    fooFile = 'foo' + rnd();
    barFile = 'bar' + rnd();
    editor.load(function () {
      editor.importFile(fooFile, 'foo');
      editor.importFile(barFile, 'bar');
      done();
    });
  });

  after(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('should return the correct number of files when asking for all files', function () {
    var fileCount = 0;
    for (var x in editor.getFiles()) {
      if (editor.getFiles().hasOwnProperty(x)) {
        fileCount++;
      }
    }
    expect(fileCount).to.be(3);
  });

  it('should return a single (and correct) file when the name param is specified', function () {
    expect(editor.getFiles(fooFile).content).to.be('foo');
  });
});

