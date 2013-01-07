/*global createContainer:false, removeContainer:false, rnd:false, getIframeDoc:false, getContainer:false */

describe(".load([callback])", function () {
  var editor
    , isLoaded
    , id
    , editorIframe
    , editorInnards;

  before(function (done) {
    id = rnd();

    editor = new EpicEditor(
      { basePath: "/epiceditor"
      , file: { autoSave: false }
      , container: createContainer(id)
      }
    );

    editor.on('load', function () {
      isLoaded = true;
    });

    editor.load();

    // TODO: Optimize this
    editorIframe = getContainer(id).getElementsByTagName('iframe');
    editorInnards = getIframeDoc(editorIframe[0]);
    done();
  })

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should create an EpicEditor instance', function () {
    expect(typeof editor).to.be('object');
  });

  it('should fire the load event', function () {
    expect(isLoaded).to.be(true);
  });

  it('should create a single wrapping iframe', function () {
    expect(editorIframe.length).to.be(1);
  });

  it('should create 2 inner iframes inside the wrapping iframe', function () {
    expect(editorInnards.getElementsByTagName('iframe').length).to.be(2);
  });

  // Using typeof is much faster that not null here

  it('should create the editor frame', function () {
    expect(typeof editorInnards.getElementById('epiceditor-editor-frame')).to.be('object');
  });

  it('should create the previewer frame', function () {
    expect(typeof editorInnards.getElementById('epiceditor-previewer-frame')).to.be('object');
  });

  it('should create the utility bar', function () {
    expect(typeof editorInnards.getElementById('epiceditor-utilbar')).to.be('object');
  });

  it('should initially load in editor mode', function () {
    expect(editor.getElement('editorIframe').style.display).to.be('block');
  });

  it('should open preview mode if preview mode was the last mode it was on before unloading', function () {
    editor.preview();
    expect(editor.getElement('editorIframe').style.display).to.be('none');
    expect(editor.getElement('previewerIframe').style.display).to.be('block');
    editor.unload();
    editor.load();
    expect(editor.getElement('editorIframe').style.display).to.be('none');
    expect(editor.getElement('previewerIframe').style.display).to.be('block');
  });
});
