/*global createContainer:false, removeContainer:false, rnd:false, getIframeDoc:false */

describe('.getElement(element)', function () {
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
    if (editor.is('loaded')) {
      editor.unload();
    }
    removeContainer(id);
    done();
  })

  it('should accept "container" and return container el', function () {
    var eId = editor.getElement('container').id;
    expect(eId).to.be(id);
  });

  it('should accept "wrapper" and return the div inside the wrapping iframe', function () {
    var innerWrapperDiv = innerWrapper.getElementById('epiceditor-wrapper');
    expect(editor.getElement('wrapper').id).to.be(innerWrapperDiv.id);
  });

  it('should accept "wrapperIframe" and return containing the other two iframes', function () {
    expect(editor.getElement('wrapperIframe').id).to.be(wrapperIframe.id);
  });

  it('should accept "editor" and return the editor frame #document', function () {
    // TODO: Is this good enough the original lookup is costly - it might be helpful to put id's on the body for this
    //expect(editor.getElement('editor')).to.be(getIframeDoc(innerWrapper.getElementById('epiceditor-editor-frame')));
    //expect(editor.getElement('editor').body.id).to.be('epiceditor-editor');
    expect(editor.getElement('editor').body.contentEditable).to.be('true');
  });

  it('should accept "editorIframe" and return the iframe containing the editor', function () {
    expect(editor.getElement('editorIframe').id).to.be('epiceditor-editor-frame');
  });

  it('should accept "previewer" and return the previewer #document', function () {
    // TODO: Is this good enough the original lookup is costly - it might be helpful to put id's on the body for this
    //expect(editor.getElement('previewer')).to.be(getIframeDoc(innerWrapper.getElementById('epiceditor-previewer-frame')));
    //expect(editor.getElement('previewer').body.id).to.be('epiceditor-preview');
    expect(editor.getElement('previewer').body.firstChild.id).to.be('epiceditor-preview');
  });

  it('should accept "previewerIframe" and return the iframe containing the previewer', function () {
    expect(editor.getElement('previewerIframe').id).to.be('epiceditor-previewer-frame');
  });

  it('should return null if the editor has been unloaded', function () {
    editor.load();
    editor.unload();
    expect(editor.getElement('editor')).to.not.be.ok();
  });
});
