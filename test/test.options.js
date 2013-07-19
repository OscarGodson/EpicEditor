/*global createContainer:false, removeContainer:false, rnd:false, getIframeDoc: false, $:false */

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
    // blow away the stack trace. Hack for Mocha:
    // https://github.com/visionmedia/mocha/issues/502
    setTimeout(done, 0);
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

  describe('options.button', function () {
    it('should have all buttons enabled by default', function () {
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect(wrapper.getElementsByClassName('epiceditor-fullscreen-btn').length)
        .to.equal(1);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-preview-btn').length)
        .to.equal(1);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-edit-btn').length)
        .to.equal(1);
    });
    it('should disable all buttons if the buttons config is set to false', function () {
      opts['button'] = false;
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect(wrapper.getElementsByClassName('epiceditor-fullscreen-btn').length)
        .to.equal(0);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-preview-btn').length)
        .to.equal(0);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-edit-btn').length)
        .to.equal(0);
    });
    it('should enable all buttons if the buttons config is set to true', function () {
      opts.button = true;
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect(wrapper.getElementsByClassName('epiceditor-fullscreen-btn').length)
        .to.equal(1);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-preview-btn').length)
        .to.equal(1);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-edit-btn').length)
        .to.equal(1);
    });
    it('should properly merge configs if none are specified', function () {
      // if no specific value for a button is specified, assume that it is true.
      opts.button = { fullscreen: false };
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect(wrapper.getElementsByClassName('epiceditor-fullscreen-btn').length)
        .to.equal(0);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-preview-btn').length)
        .to.equal(1);
      expect(wrapper.getElementsByClassName('epiceditor-toggle-edit-btn').length)
        .to.equal(1);
    });
    it('should always hide buttons if bar is hide', function () {
      opts.button = {bar: 'hide'};
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect($(wrapper).find('#epiceditor-utilbar').is(":visible")).to.be(false);
    });
    it('should always show buttons if bar is show', function () {
      opts.button = {bar: 'show'};
      editor = new EpicEditor(opts).load();
      var wrapper = editor.getElement('wrapper');
      expect($(wrapper).find('#epiceditor-utilbar').is(":hidden")).to.be(false);
    });
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
    var textareaElement, eeTestStorage;
    beforeEach(function () {
      textareaElement = document.createElement('textarea');
      textareaElement.id = 'temp-textarea';
      document.body.appendChild(textareaElement);

      opts.textarea = 'temp-textarea';

      // Add content before the editor loads
      eeTestStorage = JSON.parse(localStorage['epiceditor'] || "{}");
      eeTestStorage[id] = { content: id };
      localStorage['epiceditor'] = JSON.stringify(eeTestStorage);
    });
    afterEach(function () {
      document.body.removeChild(textareaElement);
    });
    it('puts the content of the editor inside of the textarea when first loaded', function () {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);
    });
    it('accepts a string of an ID to find the textarea to sync', function () {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);
    });
    it('accepts a DOM object to find the textarea to sync', function () {
      opts.textarea = textareaElement;
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);
    });
    it('should sync the content of the editor when the editor is updated', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);

      editor.getElement('editor').body.innerHTML = 'Manually added';
      setTimeout(function () {
        expect(textareaElement.value).to.be('Manually added');
        done();
      }, 100)
    });
    it('should sync the content of the editor when content is imported', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);

      editor.importFile(null, 'Imported');
      setTimeout(function () {
        expect(textareaElement.value).to.be('Imported');
        done();
      }, 100)
    });
    it('should sync the content of the editor when the editor is updated AND autoSave is OFF', function (done) {
      opts.file.autoSave = false;
      var editor = new EpicEditor(opts).load();
      editor.getElement('editor').body.innerHTML = 'Should update';
      setTimeout(function () {
        expect(textareaElement.value).to.be('Should update');
        done();
      }, 100);
    });
    it('should STOP syncing the content of the editor when the editor is unloaded', function () {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);

      editor.unload();
      expect(textareaElement.value).to.be('');
    });
    it('should start resyncing the content of the editor when the editor is reloaded', function (done) {
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be(id);

      editor.unload();
      expect(textareaElement.value).to.be('');

      editor.load();
      expect(textareaElement.value).to.be(id);

      editor.getElement('editor').body.innerHTML = 'Should update';
      setTimeout(function () {
        expect(textareaElement.value).to.be('Should update');
        done();
      }, 100);
    });
    it('should put the content of the textarea as the content of the editor', function () {
      textareaElement.value = 'Use this';
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be('Use this');
      expect(editor.exportFile()).to.be('Use this');
    });
    it('should replace the defaultContent option if there is content in the textarea', function () {
      textareaElement.value = 'Me me';
      opts.file.defaultContent = 'Not me';
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be('Me me');
      expect(editor.exportFile()).to.be('Me me');
    });
    it('should NOT replace the defaultContent option if there is NO content in the textarea', function () {
      // Make it look like a fresh run with no content beforehand
      localStorage.clear();
      textareaElement.value = '';
      opts.file.defaultContent = 'Default content';
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be('Default content');
      expect(editor.exportFile()).to.be('Default content');
    });
    it('should NOT sync the textarea\'s changes AFTER the editor has been loaded', function (done) {
      function checkEditorContent() {
        expect(editor.exportFile()).to.be('Use this');
      }
      textareaElement.value = 'Use this';
      var editor = new EpicEditor(opts).load();
      expect(textareaElement.value).to.be('Use this');
      expect(editor.exportFile()).to.be('Use this');
      textareaElement.value = 'NEW';
      // Try to trigger events that could trigger an editor update
      $(textareaElement).trigger('change', checkEditorContent)
                        .trigger('keypress', checkEditorContent);
      // Final attempt to trigger an update by simply waiting
      setTimeout(function () {
        checkEditorContent();
        done();
      }, 150);
    });
  });
  describe('options.autogrow', function () {
    var loggedSize
      , editor
      , smallText = "hey"
      , mediumText = "hey\n\n\n\n\n\n\n\n\n\n\n\n\nthere\n\n\n\n\n\n\n\n\n\n\n\n\n\nman"
      , longText = "\n\n\n\n\n\n\n\n\nhello\n\n\n\n\n\n\n\n\n\n\n\n\nhey\n\n\n\n\n\n\n\n\n\nwhat\n\n\n\n\n\n\n\n\n\n\n\n\nwoah";

    function getSize() {
      return editor.getElement('wrapperIframe').offsetHeight;
    }

    function logSize() {
      loggedSize = getSize();
    }

    it('should not autogrow', function (done) {
      opts.autogrow = false;
      opts.file.defaultContent = mediumText;
      editor = new EpicEditor(opts).load();
      setTimeout(function () {
        logSize();

        editor.importFile("temp", smallText);
        setTimeout(function () {
          expect(getSize()).to.be(loggedSize);

          editor.importFile("temp", longText);
          setTimeout(function () {
            expect(getSize()).to.be(loggedSize);
            done();
          }, 75);
        }, 75);
      }, 75);
    });

    it('should autogrow', function (done) {
      opts.autogrow = true;
      opts.file.defaultContent = mediumText;

      editor = new EpicEditor(opts).load();
      setTimeout(function () {
        logSize();

        editor.importFile("temp", smallText);
        setTimeout(function () {
          expect(getSize()).to.be.lessThan(loggedSize);

          editor.importFile("temp", longText);
          setTimeout(function () {
            expect(getSize()).to.be.greaterThan(loggedSize);
            done();
          }, 75);
        }, 75);
      }, 75);
    });

    it('should not exceed limits', function (done) {
      opts.autogrow = {
        minHeight: 100
      , maxHeight: 150
      }
      opts.file.defaultContent = mediumText;

      editor = new EpicEditor(opts).load();

      editor.importFile("temp", smallText);
      setTimeout(function () {
        expect(getSize()).to.be(opts.autogrow.minHeight);

        editor.importFile("temp", longText);
        setTimeout(function () {
          expect(getSize()).to.be(opts.autogrow.maxHeight);
          done();
        }, 125);
      }, 125);
    });
  });
});
