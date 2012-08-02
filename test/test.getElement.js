describe('#getElement(element)', function () {
  var testEl
    , id
    , editor
    , wrapperIframe
    , innerWrapper;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id)
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load()
    wrapperIframe = document.getElementById(id).getElementsByTagName('iframe')[0];
    innerWrapper = getIframeDoc(wrapperIframe);
    done();
  });

  after(function (done) {
    editor.unload(function() {
      done();
    });
  })

  it('should return the "container" given at setup', function () {
    var eId = editor.getElement('container').id;
    expect(eId).to.be(id);
  });

  it('should return the "wrapper" div inside the wrapping iframe containing the other two iframes', function () {
    var innerWrapperDiv = innerWrapper.getElementById('epiceditor-wrapper');
    expect(editor.getElement('wrapper').id).to.be(innerWrapperDiv.id);
  });

  it('should return the "wrapperIframe" containing the other two iframes', function () {
    expect(editor.getElement('wrapperIframe').id).to.be(wrapperIframe.id);
  });

  it('should return the "editor" #document', function () {
    // Is it good enough to check the nodeType here, the other lookup is costly
    expect(editor.getElement('editor').nodeType).to.be(9);
    //expect(editor.getElement('editor')).to.be(getIframeDoc(innerWrapper.getElementById('epiceditor-editor-frame')));
  });

  it('should return the "editorIframe" containing the editor', function () {
    expect(editor.getElement('editorIframe').id).to.be('epiceditor-editor-frame');
  });

  it('should return the "previewer" #document', function () {
    // Is it good enough to check the nodeType here, the other lookup is costly
    expect(editor.getElement('previewer').nodeType).to.be(9);
    //expect(editor.getElement('previewer')).to.be(getIframeDoc(innerWrapper.getElementById('epiceditor-previewer-frame')));
  });

  it('should return the "previewerIframe" containing the previewer', function () {
    expect(editor.getElement('previewerIframe').id).to.be('epiceditor-previewer-frame');
  });
});

