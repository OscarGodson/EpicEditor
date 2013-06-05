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
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  // blow away the stack trace. Hack for Mocha:
  // https://github.com/visionmedia/mocha/issues/502
  beforeEach(function (done) {
    setTimeout(done, 0);
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
    expect(editor.getElement('previewerIframe').style.left).to.be('-999999px');
    expect(editor.getElement('editorIframe').style.left).to.be('');
  });

  it('should open preview mode if preview mode was the last mode it was on before unloading', function () {
    editor.preview();
    expect(editor.getElement('editorIframe').style.left).to.be('-999999px');
    expect(editor.getElement('previewerIframe').style.left).to.be('');
    editor.unload();
    editor.load();
    expect(editor.getElement('editorIframe').style.left).to.be('-999999px');
    expect(editor.getElement('previewerIframe').style.left).to.be('');
  });

  describe('anchors', function () {
    var previewer, anchor, oldScrollPos, originalHostname;
    before(function () {
      previewer = editor.getElement('previewer');
      editor.importFile(id, '<a href="#test">foo</a>\n\nfoo\n\nbar\n\n<h1 id="test">Test</h1>\n\nhello\n\nworld\n\nblah\n\nblah');
      editor.element.style.height = '10px';
      editor.reflow().preview();
      anchor = previewer.body.querySelector('a');
      // Fucking IE bug.
      // If you change the href of an <a> it'll set the hostname to be blank.
      // Stash the original one here and reset in the beforeEach()
      originalHostname = anchor.hostname
    });
    beforeEach(function () {
      anchor.href = "#test";
      // Make sure this comes after changing the href
      anchor.hostname = originalHostname
      anchor.target = '';
      previewer.body.scrollTop = 0;
    });
    it('scrolls the previewer body if the anchor is a local hash link', function () {
      oldScrollPos = previewer.body.scrollTop;
      expect(oldScrollPos).to.be(0);
      anchor.click();
      expect(previewer.body.scrollTop).to.be.greaterThan(0);
      previewer.body.scrollTop = 0;

      anchor.href = window.location.hostname + '#test';
      // Again, this is for IE
      anchor.hostname = originalHostname
      anchor.click();
      expect(previewer.body.scrollTop).to.be.greaterThan(0);

    });
    it('does NOT scroll the previewer if the anchor is on an enternal link', function () {
      oldScrollPos = previewer.body.scrollTop;
      expect(oldScrollPos).to.be(0);

      anchor.href = 'http://google.com';
      // Again, this is for IE
      anchor.hostname = originalHostname
      anchor.click();
      expect(previewer.body.scrollTop).to.be(0);
      previewer.body.scrollTop = 0;

      anchor.href = 'http://google.com#foo';
      // Again, this is for IE
      anchor.hostname = originalHostname
      anchor.click();
      expect(previewer.body.scrollTop).to.be(0);
    });
    it('does NOT scroll if there is no matching ID', function () {
      oldScrollPos = previewer.body.scrollTop;
      expect(oldScrollPos).to.be(0);
      anchor.href = '#poop';
      // Again, this is for IE
      anchor.hostname = originalHostname
      anchor.click();
      expect(previewer.body.scrollTop).to.be(0);
    });
    it('sets the target of the link to _self if its a local hash link', function () {
      anchor.click();
      expect(anchor.target).to.be('_self');
    });
    it('does NOT set the target of the link to _self if its a local hash link', function () {
      anchor.href = 'http://google.com';
      // Again, this is for IE
      anchor.hostname = originalHostname
      anchor.click();
      expect(anchor.target).to.be('');
    });
  });
});
