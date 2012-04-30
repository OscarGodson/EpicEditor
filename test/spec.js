foounit.require(':spec/spec-helper');

// Include your source file here
foounit.require(':src/epiceditor')

describe('epic editor load', function () {
  // Lets you set options for the editor. The example below has all the options available currently.
  // basePath: The base path of the directory containing the /themes, /images, etc. It's epiceditor by default. Don't add a trailing slash!
  // file.name: If no file exists with this name a new one will be made, otherwise the existing will be opened.
  // file.defaultContent: The content to show if no content exists for that file.
  // themes.editor: The theme for the editor which is a textarea inside of an iframe.
  // themes.preview: The theme for the previewer which is a div of content inside of an iframe.
  // focusOnLoad: Will focus on the editor on load. It's false by default.
  // shortcuts.modifier: The modifying key for shortcuts. It's 18 (the alt key) by default, to reduce default browser shortcut conflicts.
  // shortcuts.fullscreen: The fullscreen shortcut key. It's 70 (f key) by default.
  // shortcuts.preview: The preview shortcut key. It's 80 (p key) by default.
  // shortcuts.edit: The edit mode shortcut key. It's 79 (o key) by default.

  var editor
    , element
    , fileName = 'test-file'
    , localStorageName = 'epiceditor-test'
    , defaultContent = 'Write your epic markdown here!'
    
    , options = {
      // @TODO: add reference to basepath and localStorageName in doc example
      basePath: '../epiceditor/'
      , localStorageName: 'epiceditor-test'
      , file:{
        name: fileName
        , defaultContent: defaultContent
      },
      themes:{
        editor: 'themes/editor/epic-dark.css'
        , preview: 'themes/preview/github.css'
      },
      focusOnLoad:true,
      shortcuts: {
        preview: 77 //M
      }
    }
  
  before(function () {
    editor && editor.unload(function() {
      return true;
    });

    // Reset local storage on epiceditor-test
    localStorage && localStorage[localStorageName] && localStorage.removeItem(localStorageName);
  })
  
  it('initializes a new epic editor', function () {
    editor = new EpicEditor(options).load();
    expect(typeof editor).to(be, 'object');
  });
  
  it('uses the optional storage location name to save content', function () {
    editor = new EpicEditor(options).load().save();
    expect(JSON.parse(localStorage[localStorageName]).files[fileName]).to(be, editor.get('editor').value)
  });
  
  it('uses the provided default content', function () {
    editor = new EpicEditor(options).load();
    expect(editor.get('editor').value).to(be, defaultContent);
  });
  
  it('uses the provided element option', function () {
    // self.iframe points the contentWindow and not the iframe element itself
    // the iframe HTML element is stored in self.iframeElement
    optionalEl = document.getElementById('option-test');
    options.element = optionalEl;
    editor = new EpicEditor(options).load();
    expect(optionalEl.childNodes[0]).to(be, editor.iframeElement);
  });
  
});