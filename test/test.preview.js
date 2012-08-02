describe('#preview()', function () {

  var testEl
    , id
    , editor
    , previewEventWasCalled
    , editEventWasCalled
    ;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();

    previewEventWasCalled = false;
    editEventWasCalled = false;

    editor.on('preview', function () {
      previewEventWasCalled = true;
    });

    editor.on('edit', function () {
      editEventWasCalled = true;
    });
    done();
  });

  after(function (done) {
    editor.removeListener('preview');
    editor.removeListener('edit');
    editor.unload();
    editor = null;
    done();
  });

  it('check that the editor is currently displayed and not the previewer', function () {
    expect(editor.getElement('editorIframe').style.display).to.be('block');
  });

  it('check that the previewer can be tested to be hidden', function () {
    expect(editor.getElement('previewerIframe').style.display).to.be('none');
  });

  it('check that calling .preview() displays the previewer', function () {
    editor.preview();
    expect(editor.getElement('previewerIframe').style.display).to.be('block');
  });

  it('check that the preview event fires when the preview method is called', function () {
    editor.preview();
    expect(previewEventWasCalled).to.be(true);
  });

  it('check that the edit event fires when the edit method is called', function () {
    editor.edit();
    expect(editEventWasCalled).to.be(true);
  });

  it('check that switching from preview back to edit makes the editor visible', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('editorIframe').style.display).to.be('block');
  });

  it('check that switching from preview back to edit doesn\'t keep the previewer displayed', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('previewerIframe').style.display).to.be('none');
  });
});

