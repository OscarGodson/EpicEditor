/*global createContainer:false, removeContainer:false, rnd:false */

describe('.getFiles([name])', function () {
  var testEl
    , id
    , editor
    , fooFile
    , barFile;

  before(function (done) {
    localStorage.clear();
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      , localStorageName: 'epiceditor-getFiles'
      });

    fooFile = 'foo' + id;
    barFile = 'bar' + id;
    editor.load();
    editor.importFile(fooFile, 'foo');
    editor.importFile(barFile, 'bar');
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should return all files when a file name is not specified', function () {
    var fileCount = 0
      , files = editor.getFiles()
      , f;

    for (f in files) {
      if (files.hasOwnProperty(f)) {
        fileCount++;
      }
    }
    expect(fileCount).to.be(3);
  });

  it('should return the correct file when the name is specified', function () {
    expect(editor.getFiles(fooFile).content).to.be('foo');
  });
});
