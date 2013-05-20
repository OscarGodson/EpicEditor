/*global createContainer:false, removeContainer:false, rnd:false */

describe('.edit()', function () {
  var testEl
    , id
    , editor
    , editEventFired;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });

    editEventFired = false;

    editor.on('edit', function () {
      editEventFired = true;
    });

    editor.load();
    done();
  });

  after(function (done) {
    editor.removeListener('edit');
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should fire the edit event', function () {
    editor.edit();
    expect(editEventFired).to.be(true);
  });

  it('should make the editor visible when switching from preview back to edit', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('previewerIframe').style.left).to.be('-999999px');
    expect(editor.getElement('editorIframe').style.left).to.be('');
  });
});

