describe('#edit()', function () {
  var testEl
    , id
    , editor
    , editEventFired
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });

    editEventFired = false;

    editor.on('edit', function () {
      editEventFired = true;
    });

    editor.load(function () {
      done();
    });
  });

  afterEach(function (done) {
    editor.removeListener('edit');
    editor.unload(function () {
      done();
    });
  });

  it('should display the editor', function () {
    expect(editor.getElement('editorIframe').style.display).to.be('block');
  });

  it('should fire the edit event', function () {
    editor.edit();
    expect(editEventFired).to.be(true);
  });

  it('should make the editor visible if switched from preview back to edit', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('editorIframe').style.display).to.be('block');
  });
});

