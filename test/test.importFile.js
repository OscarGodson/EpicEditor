/*global createContainer:false, removeContainer:false, rnd:false */

describe('.importFile([fileName],[content])', function () {
  var testEl
    , id
    , editor
    , fooFile
    , eventFired;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      });
    fooFile = 'foo' + id;
    eventFired = false;
    editor.load();
    done();
  });

  afterEach(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should accept a filename and content', function () {
    var importFileTest = 'importFileTest' + id;
    editor.importFile(importFileTest, '#bar');
    expect(editor.exportFile(importFileTest)).to.be('#bar');
  });

  it('should import content to the current file if the fileName is passed as null', function () {
    editor.importFile(null, 'foo');
    expect(editor.exportFile(id)).to.be('foo');
  });

  it('should fire the create event when importing a new file', function () {
    editor.on('create', function () {
      eventFired = true;
    });
    editor.importFile(fooFile);
    expect(eventFired).to.be(true);
  });

  it('should fire the update event when modifying an existing file', function () {
    editor.on('update', function () {
      eventFired = true;
    });
    editor.importFile(null, 'new text');
    expect(eventFired).to.be(true);
  });

  it('should not fire the update event when creating a file', function () {
    editor.on('update', function () {
      eventFired = true;
    });
    editor.importFile(fooFile);
    expect(eventFired).to.be(false);
  });

  // TODO: Tests for importFile's kind parameter when implemented
  // TODO: Tests for importFile's meta parameter when implemented
});
