/*global createContainer:false, removeContainer:false, rnd:false */

describe('.rename(oldName, newName)', function () {
  var testEl
    , id
    , editor
    , oldName
    , newName;

  before(function (done) {
    id = rnd();
    oldName = 'foo' + id;
    newName = 'bar' + id;
    testEl = createContainer(id)
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.load();
    editor.importFile(oldName, 'testing...');
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should rename a file', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(newName)).to.be('testing...');
  });

  it('should replace an old file name', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(oldName)).to.be(undefined);
  });
});
