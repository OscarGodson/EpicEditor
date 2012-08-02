describe('#importFile([fileName],[content])', function () {
  var testEl
    , id
    , editor
    , fooFile
    , importEventFired
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      })
    fooFile = 'foo' + rnd();
    importEventFired = false;
    editor.load(function () {
      done();
    });
  });

  afterEach(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('should return an empty string before import', function () {
    expect(editor.exportFile()).to.be('');
  });

  it('should accept a filename and content', function () {
    var importFileTest = 'importFileTest' + rnd();
    editor.importFile(importFileTest, '#bar');
    expect(editor.exportFile(importFileTest)).to.be('#bar');
  });

  it('should import content to the current file if fileName is passed as null', function () {
    editor.importFile(null, 'foo');
    expect(editor.exportFile(id)).to.be('foo');
  });

  it('should fire the create event when importing a new file', function () {
    editor.on('create', function () {
      importEventFired = true;
    });
    editor.importFile(fooFile);
    expect(importEventFired).to.be(true);
  });

  it('should fire the update event when modifying an existing file', function () {
    editor.on('update', function () {
      importEventFired = true;
    });
    editor.importFile(null, 'new text');
    expect(importEventFired).to.be(true);
  });

  it('should NOT fire the update event when creating a file', function () {
    editor.on('update', function () {
      importEventFired = true;
    });
    editor.importFile(fooFile);
    expect(importEventFired).to.be(false);
  });

  // TODO: Tests for importFile's kind parameter when implemented
  // TODO: Tests for importFile's meta parameter when implemented
});
