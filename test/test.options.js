/*global createContainer:false, removeContainer:false, rnd:false, getIframeDoc: false */

describe('EpicEditor([options])', function () {
  var editor
    , id
    , el
    , opts;

  beforeEach(function (done) {
    id = rnd();
    el = createContainer(id);
    opts =
      { basePath: '/epiceditor'
      , container: el
      , file: { autoSave: false }
      }
    done();
  });

  afterEach(function (done) {
    if (editor.is('loaded')) {
      editor.unload();
    }
    if (!el.id) {
      (el.id = id); // to reset in the case where the id is removed
    }
    removeContainer(id);
    done();
  });

  it('should allow the container option to be passed as an element ID string', function () {
    opts.container = id;

    editor = new EpicEditor(opts).load();
    expect(editor.getElement('container').id).to.be(id);
  });

  it('should allow the container option to be passed as a DOM element', function () {
    editor = new EpicEditor(opts).load();
    expect(editor.getElement('container').id).to.be(id);
  });

  it('should use the container ID to set the localStorage key when passed as a string', function () {
    opts.container = id;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[id]).to.be.ok();
  });

  it('should use the container ID to set the localStorage key when passed as a DOM element', function () {
    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[id]).to.be.ok();
  });

  it('should accept the file.name option to set the localStorage key', function () {
    var fileName = 'user-file-name-' + id;
    opts.file.name = fileName;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[fileName]).to.be.ok();
  });

  it('should set the localStorage key when no other fallback is available', function () {
    el.id = '';

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)['__epiceditor-untitled-1']).to.be.ok();
  });

  it('should accept a clientSideStorage option that will not initialize localStorage when false', function () {
    opts.clientSideStorage = false;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.be(undefined);
  });

  it('should accept a clientSideStorage option that will initialize localStorage when true', function () {
    opts.clientSideStorage = true;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.be.ok();
  });

  it('should accept a defaultContent option that sets the initial editor content', function () {
    opts.file.defaultContent = 'foo';

    editor = new EpicEditor(opts).load();
    expect(editor.getElement('editor').body.innerHTML).to.be('foo');
  });

  describe('options.string', function () {
    it('should change the title attr of the preview button when the togglePreview string is changed', function () {
      opts.string = {
        togglePreview: 'Foo'
      }
      editor = new EpicEditor(opts).load();
      expect(editor.getElement('wrapper').getElementsByClassName('epiceditor-toggle-preview-btn')[0].title)
        .to.be('Foo');
    });
    it('should change the title attr of the edit button when the toggleEdit string is changed', function () {
      opts.string = {
        toggleEdit: 'Bar'
      }
      editor = new EpicEditor(opts).load();
      expect(editor.getElement('wrapper').getElementsByClassName('epiceditor-toggle-edit-btn')[0].title)
        .to.be('Bar');
    });
    it('should change the title attr of the fullscreen button when the toggleFullscreen string is changed', function () {
      opts.string = {
        toggleFullscreen: 'Qux'
      }
      editor = new EpicEditor(opts).load();
      expect(editor.getElement('wrapper').getElementsByClassName('epiceditor-fullscreen-btn')[0].title)
        .to.be('Qux');
    });
  });
  describe('options.theme', function () {
    var editorStylesheet;
    beforeEach(function () {
      opts.theme = {};
    });
    describe('.base', function () {
      it('should add the basePath path if the theme does not have an absolute link', function () {
        opts.theme.base = '/foo/';
        editor = new EpicEditor(opts).load();
        editorStylesheet = getIframeDoc(editor.getElement('wrapperIframe')).getElementById('theme');
        expect(editorStylesheet.href).to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute http link', function () {
        opts.theme.base = 'http://foo.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = getIframeDoc(editor.getElement('wrapperIframe')).getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute https link', function () {
        opts.theme.base = 'https://foo.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = getIframeDoc(editor.getElement('wrapperIframe')).getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
    });
    describe('.editor', function () {
      it('should add the basePath path if the theme does not have an absolute link', function () {
        opts.theme.editor = '/bar/';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('editor').getElementById('theme');
        expect(editorStylesheet.href).to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute http link', function () {
        opts.theme.editor = 'http://bar.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('editor').getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute https link', function () {
        opts.theme.editor = 'https://bar.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('editor').getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
    });
    describe('.preview', function () {
      it('should add the basePath path if the theme does not have an absolute link', function () {
        opts.theme.preview = '/baz/';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('previewer').getElementById('theme');
        expect(editorStylesheet.href).to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute http link', function () {
        opts.theme.preview = 'http://baz.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('previewer').getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
      it('should NOT add the basePath path if the theme DOES have an absolute https link', function () {
        opts.theme.preview = 'https://baz.com';
        editor = new EpicEditor(opts).load();
        editorStylesheet = editor.getElement('previewer').getElementById('theme');
        expect(editorStylesheet.href).not.to.contain('/epiceditor');
      });
    });
  });
  describe('options.textarea', function () {
    var textareaElement
    beforeEach(function () {
      textareaElement = document.createElement('textarea');
      textareaElement.id = 'temp-textarea';
      document.body.appendChild(textareaElement);

      opts.textarea = 'temp-textarea';

      // Add content before the editor loads
      var eeTestStorage = JSON.parse(localStorage['epiceditor']);
      eeTestStorage[id] = { content: id };
      localStorage['epiceditor'] = JSON.stringify(eeTestStorage);
    });
    afterEach(function () {
      document.body.removeChild(textareaElement);
    });
    it('puts the content of the editor inside of the textarea when first loaded', function () {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);
    });
    it('accepts a string of an ID to find the textarea to sync', function () {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);
    });
    it('accepts a DOM object to find the textarea to sync', function () {
      opts.textarea = document.getElementById('temp-textarea');
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);
    });
    it('should sync the content of the editor when the editor is updated', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);

      editor.getElement('editor').body.innerHTML = 'Manually added';
      setTimeout(function () {
        expect(document.getElementById('temp-textarea').value).to.be('Manually added');
        done();
      }, 100)
    });
    it('should sync the content of the editor when content is imported', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);

      editor.importFile(null, 'Imported');
      setTimeout(function () {
        expect(document.getElementById('temp-textarea').value).to.be('Imported');
        done();
      }, 100)
    });
    it('should sync the content of the editor when the editor is updated AND autoSave is OFF', function (done) {
      opts.file.autoSave = false;
      var editor = new EpicEditor(opts).load();
      editor.getElement('editor').body.innerHTML = 'Should update';
      setTimeout(function () {
        expect(document.getElementById('temp-textarea').value).to.be('Should update');
        done();
      }, 100);
    });
    it('should STOP syncing the content of the editor when the editor is unloaded', function () {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);

      editor.unload();
      expect(document.getElementById('temp-textarea').value).to.be('');
    });
    it('should start resyncing the content of the editor when the editor is reloaded', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(document.getElementById('temp-textarea').value).to.be(id);

      editor.unload();
      expect(document.getElementById('temp-textarea').value).to.be('');

      editor.load();
      expect(document.getElementById('temp-textarea').value).to.be(id);

      editor.getElement('editor').body.innerHTML = 'Should update';
      setTimeout(function () {
        expect(document.getElementById('temp-textarea').value).to.be('Should update');
        done();
      }, 100);
    });
  });
});
