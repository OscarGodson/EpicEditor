describe('#remove(name)', function () {
  var testEl
    , id
    , editor
    , removeMeFile
    , dontRemoveMeFile
    , eventWasFired
    ;

  before(function (done) {
    id = rnd()
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    removeMeFile = 'removeMe' + rnd();
    dontRemoveMeFile = 'dontRemoveMe' + rnd();
    editor.importFile(removeMeFile, 'hello world').importFile(dontRemoveMeFile, 'foo bar');
    done();
  });

  after(function (done) {
    editor.unload();
    done();
  });

  it('check that the foo file was imported', function () {
    expect(editor.exportFile(removeMeFile)).to.be('hello world');
  });

  it('check that after removing the file exportFile returns false', function () {
    editor.remove(removeMeFile);
    expect(editor.exportFile(removeMeFile)).to.be(undefined);
  });

  it('check that other files weren\'t removed', function () {
    expect(editor.exportFile(dontRemoveMeFile)).to.be('foo bar');
  });


  it('check that the remove event fires when a file is deleted', function () {
    editor.on('remove', function () {
      eventWasFired = true;
    });

    editor.open(removeMeFile);
    editor.remove(removeMeFile);
    expect(eventWasFired).to.be(true);
  });
});
