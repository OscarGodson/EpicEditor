/*global createContainer:false, removeContainer:false, rnd:false */

describe('.preview()', function () {
  var testEl
    , id
    , editor
    , previewEventWasCalled
    , editEventWasCalled;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });

    previewEventWasCalled = false;
    editEventWasCalled = false;

    editor.on('preview', function () {
      previewEventWasCalled = true;
    });

    editor.load();
    done();
  });

  after(function (done) {
    editor.removeListener('preview');
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should not initially be in previewer mode when loaded', function () {
    expect(editor.getElement('previewerIframe').style.display).to.be('none');
  });

  it('should display the previewer when the preview method is called', function () {
    editor.preview();
    expect(editor.getElement('previewerIframe').style.display).to.be('block');
  });

  it('should fire the preview event when the preview method is called', function () {
    editor.preview();
    expect(previewEventWasCalled).to.be(true);
  });

  it('should hide the previewer if switched from preview back to edit', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('previewerIframe').style.display).to.be('none');
  });
});
