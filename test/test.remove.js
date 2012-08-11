/*global createContainer:false, removeContainer:false, rnd:false */

describe('.remove(name)', function () {
  var testEl
    , id
    , editor
    , removeMeFile
    , dontRemoveMeFile
    , eventFired;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    removeMeFile = 'removeMe' + id;
    dontRemoveMeFile = 'dontRemoveMe' + id;
    editor.load();
    editor.importFile(removeMeFile, 'hello world').importFile(dontRemoveMeFile, 'foo bar');
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should begin with the foo file imported correctly', function () {
    expect(editor.exportFile(removeMeFile)).to.be('hello world');
  });

  it('should cause exportFile to return false after removing the foo file', function () {
    editor.remove(removeMeFile);
    expect(editor.exportFile(removeMeFile)).to.be(undefined);
  });

  it('should not remove any file other than the fileName passed', function () {
    expect(editor.exportFile(dontRemoveMeFile)).to.be('foo bar');
  });

  it('should fire the remove event', function () {
    editor.on('remove', function () {
      eventFired = true;
    });

    editor.open(removeMeFile);
    editor.remove(removeMeFile);
    expect(eventFired).to.be(true);
  });
});
