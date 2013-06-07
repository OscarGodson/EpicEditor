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
    editor.importFile(fooFile, 'foo     bar');
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

  it('should return the right file when the name is specified', function () {
    var file = editor.getFiles(fooFile);
    expect(file).not.to.be(undefined);
    expect(file).to.have.property('modified');
    expect(file).to.have.property('created');
    expect(file.content).to.be('foo     bar');
  });

  it('should exclude content when excludeContent is set', function () {
    var file = editor.getFiles(fooFile, true);
    expect(file).not.to.have.property('content');
  });
});
