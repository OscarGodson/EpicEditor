describe('#rename(oldName, newName)', function () {
  var testEl
    , id
    , editor
    , oldName
    , newName
    ;

  before(function () {
    id = rnd();
    testEl = createContainer(id)
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    oldName = 'foo' + rnd();
    newName = 'bar' + rnd();
    editor.importFile(oldName, 'testing...');
  });

  after(function () {
    editor.unload();
  });

  it('check to see if the foo file exists before trying to rename', function () {
    expect(editor.exportFile(oldName)).to.be('testing...');
  });

  it('check that renaming a file actually renames the file by exporting by the new files name', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(newName)).to.be('testing...');
  });

  it('check that foo no longer exists', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(oldName)).to.be(undefined);
  });
});
