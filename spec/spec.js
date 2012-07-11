// foounit.require(':spec/spec-helper');

// Include your source file here
foounit.require('/epiceditor/js/epiceditor')

function _getIframeInnards(el) {
  return el.contentDocument || el.contentWindow.document;
}

function _createTestElement() {
  var testEl = document.createElement('div')
    , testId = 'epiceditor-' + (new Date().getTime()) + '-' + (Math.round(Math.random() * 1000));
  
  testEl.id = testId;
  document.body.appendChild(testEl);
  return testId;
}

function _randomNum() {
  return Math.round(Math.random() * 10000);
}

// Clean start
localStorage.clear();

// BEGIN THY TESTS
describe('EpicEditor.load', function () {

  var testEl = _createTestElement()
    , editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl })
    , editorIframe
    , editorInnards
    , wasLoaded = false;

  editor.on('load', function () {
    wasLoaded = this;
  });

  editor.load();

  it('check if EE returns an object reference', function () {
    expect(typeof editor).to(be, 'object');
  });


  it('make sure the load event was fired', function () {
    expect(typeof wasLoaded).to(be, 'object');
  });

  describe('check if the DOM is in place', function () {

    editorIframe = document.getElementById(testEl).getElementsByTagName('iframe');
    editorInnards = _getIframeInnards(editorIframe[0]);

    it('make sure there\'s one wrapping iframe', function () {
      expect(editorIframe.length).to(be, 1);
    });
    
    it('make sure there\'s two inner iframes', function () {
      expect(editorInnards.getElementsByTagName('iframe').length).to(be, 2);
    });

    it('check to make sure the editor frame exists', function () {
      expect(editorInnards.getElementById('epiceditor-editor-frame')).toNot(beNull);
    });

    it('check to make sure the previewer frame exists', function () {
      expect(editorInnards.getElementById('epiceditor-previewer-frame')).toNot(beNull);
    });

    it('check to make sure the utility bar exists', function () {
      expect(editorInnards.getElementById('epiceditor-utilbar')).toNot(beNull);
    });
  });
});

describe('EpicEditor.load.options', function () {
  var testEl, editor;

  before(function () {
    testEl = _createTestElement();
  });

  after(function () {
    editor.unload();
  });

  describe('when setting the container element', function () {

    it('allows the value to be a string of an ID to an element', function () {
      editor = new EpicEditor(
        { basePath: '/epiceditor/'
        , container: testEl
        }
      ).load();
      
      expect(document.getElementById(testEl).getElementsByTagName('iframe').length).to(be, 1);
    });

    it('allows the value to be a DOM object of an element', function () {
      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: document.getElementById(testEl)
      }).load();

      expect(document.getElementById(testEl).getElementsByTagName('iframe').length).to(be, 1);
    });

    it('check that the localStorage key is correctly named for string values (IDs)', function () {
      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: testEl
      }).load();
      expect(JSON.parse(localStorage.epiceditor)[testEl]).to(beTruthy);
    });

    it('check that the localStorage key is correctly named for DOM elements by using the ID of the element', function () {
      
      // This is all for a one off test. Creates an element with a different class name and ID
      // and we need to be able to get the name of the ID and class later
      var tempEl = document.createElement('div')
        , tempId = 'foo' + _randomNum()
        , tempClassName = 'bar' + _randomNum();
      tempEl.id = tempId;
      tempEl.className = tempClassName;
      document.body.appendChild(tempEl);

      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: document.getElementsByClassName(tempClassName)[0]
      }).load();
      expect(JSON.parse(localStorage.epiceditor)[tempId]).to(beTruthy);
    });

    it('check that the localStorage key is correctly named for manually set file names', function () {
      var tempName = 'foo' + _randomNum();
      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: testEl
      , file: { name: tempName }
      }).load();
      expect(JSON.parse(localStorage.epiceditor)[testEl]).to(beFalsy);
    });

    it('check that the localStorage key is correctly named when there\'s no fallback name', function () {
      var tempEl = document.createElement('div')
        , tempClassName = 'foo' + _randomNum();
      tempEl.className = tempClassName;
      document.body.appendChild(tempEl);

      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: document.getElementsByClassName(tempClassName)[0]
      }).load();
      expect(JSON.parse(localStorage.epiceditor)['__epiceditor-untitled-1']).to(beTruthy);
    });
  });

  describe('when setting clientSideStorage', function () {
    it('check that when FALSE NO data is saved to localStorage', function () {
      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: testEl
      , clientSideStorage: false
      }).load();
      expect(JSON.parse(localStorage['epiceditor'])[testEl]).to(be, undefined);
    });

    it('check that when TRUE data IS saved to localStorage', function () {
      editor = new EpicEditor({
        basePath: '/epiceditor/'
      , container: testEl
      , clientSideStorage: true
      }).load();
      expect(JSON.parse(localStorage['epiceditor'])[testEl]).toNot(be, undefined);
    });
  });
});

describe('EpicEditor.getElement', function () {
  var testEl = _createTestElement()
    , editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load()
    , wrapperIframe
    , innerWrapper;

  before(function () {
    wrapperIframe = document.getElementById(testEl).getElementsByTagName('iframe')[0];
    innerWrapper = _getIframeInnards(wrapperIframe);
  });

  it('check that "container" is the element given at setup', function () {
    expect(editor.getElement('container')).to(be, document.getElementById(testEl));
  });

  it('check that the "wrapper" is the div inside the wrapping iframe containing the other two iframes', function () {
    var innerWrapperDiv = innerWrapper.getElementById('epiceditor-wrapper');
    expect(editor.getElement('wrapper')).to(be, innerWrapperDiv);
  });

  it('check that the "wrapperIframe" is the iframe containing the other two iframes', function () {
    expect(editor.getElement('wrapperIframe')).to(be, wrapperIframe);
  });

  it('check that "editor" is #document of the editor iframe', function () {
    expect(editor.getElement('editor')).to(be, _getIframeInnards(innerWrapper.getElementById('epiceditor-editor-frame')));
  });

  it('check that "editorIframe" is <iframe> containing the editor', function () {
    expect(editor.getElement('editorIframe').id).to(be, 'epiceditor-editor-frame');
  });

  it('check that "previewer" is #document of the previewer iframe', function () {
    expect(editor.getElement('previewer')).to(be, _getIframeInnards(innerWrapper.getElementById('epiceditor-previewer-frame')));
  });

  it('check that "previewerIframe" is <iframe> containing the previewer', function () {
    expect(editor.getElement('previewerIframe').id).to(be, 'epiceditor-previewer-frame');
  });
});


describe('EpicEditor.getFiles', function () {
  var testEl, editor, fooFile, barFile;

  before(function () {
    localStorage.clear();
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    fooFile = 'foo' + _randomNum();
    barFile = 'bar' + _randomNum();
    editor.importFile(fooFile, 'foo');
    editor.importFile(barFile, 'bar');
  });

  after(function () {
    editor.unload();
  });

  it('check to see if the correct number of files is returned when asking for all files', function () {
    var fileCount = 0;
    for (var x in editor.getFiles()) {
      fileCount++;
    }
    expect(fileCount).to(be, 3);
  });

  it('check to see if a single (and correct) file is returned when the name param is specified', function () {
    expect(editor.getFiles(fooFile).content).to(be, 'foo');
  });
});


describe('EpicEditor.open', function () {

  var testEl, editor, openMeFile, openMeLaterFile, eventWasFired, createEventWasFired, fooFile;

  before(function () {
    testEl = _createTestElement();
    openMeFile = 'openMe' + _randomNum();
    openMeLaterFile = 'openMeLater' + _randomNum();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    editor.importFile(openMeLaterFile, 'open me later').importFile(openMeFile, 'open this file');
   
    createEventWasFired = false;
    fooFile = 'foo' + _randomNum();

    eventWasFired = false;
    editor.on('open', function () {
      eventWasFired = true;
    });
  });

  after(function () {
    editor.unload();
  });

  it('check that the openMe file was created successfully', function () {
    expect(editor.exportFile(openMeFile)).to(be, 'open this file');
  });

  it('check that the openMeLater file was created successfully', function () {
    expect(editor.exportFile(openMeLaterFile)).to(be, 'open me later');
  });
  
  it('check that the file is open in the editor', function () {
    expect(editor.getElement('editor').body.innerHTML).to(be, 'open this file');
  });

  it('check that openMeLater opens into the editor after calling .open', function () {
    editor.open(openMeLaterFile);
    expect(editor.getElement('editor').body.innerHTML).to(be, 'open me later');
  });

  it('check that the open event is called when the open method is run', function () {
    editor.open();
    expect(eventWasFired).to(be, true);
  });

  it('check that the create event fires for a new file created with open()', function () {
    editor.on('create', function () {
      createEventWasFired = true;
    });
    editor.open(fooFile);
    expect(createEventWasFired).to(beTrue);
  });

  it('check that the create event DOES NOT fire for an existing file with open', function () {
    editor.open(fooFile); // change the file from "testEl"

    editor.on('create', function () {
      createEventWasFired = true;
    });

    editor.open(testEl);

    expect(createEventWasFired).to(beFalse);
  });

  it('check that the read event fires when a file is read with open()', function () {
    editor.on('read', function () {
      eventWasFired = true;
    });

    editor.open(fooFile); // change the file (should fired create)
    
    editor.open(testEl); // this one should fire read

    expect(eventWasFired).to(be, true);
  });
});

describe('EpicEditor.importFile', function () {

  var testEl, editor, fooFile, eventWasFired;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      }).load();
    fooFile = 'foo' + _randomNum();
    eventWasFired = false;
  });

  after(function () {
    editor.unload();
  });

  it('check that the content is currently blank', function () {
    expect(editor.exportFile()).to(be, '');
  });

  it('check that importFile(\'foo\',\'#bar\') is imported and can be received', function () {
    var importFileTest = 'importFileTest' + _randomNum();
    editor.importFile(importFileTest, '#bar');
    expect(editor.exportFile(importFileTest)).to(be, '#bar');
  });

  it('check that setting the file name as null imports content into the currently open file', function () {
    editor.importFile(null, 'foo');
    expect(editor.exportFile(testEl)).to(be, 'foo');
  });
  
  it('check that importFile fires a create an event when importing a new file', function () {
    editor.on('create', function () {
      eventWasFired = true;
    });
    editor.importFile(fooFile);
    expect(eventWasFired).to(beTrue);
  });

  it('check that importFile fires an update event when modifying an existing file', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });

    editor.importFile(null, 'new text');

    expect(eventWasFired).to(beTrue);
  });

  it('check that importFile DOES NOT fire an update event when creating a file', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });

    editor.importFile(fooFile);

    expect(eventWasFired).to(beFalse);
  });
  // TODO: Tests for importFile's kind parameter when implemented
  // TODO: Tests for importFile's meta parameter when implemented

});

describe('EpicEditor.exportFile', function () {

  var testEl, contents, editor;

  before(function () {
    testEl = _createTestElement();
    
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , file: { defaultContent: '#foo\n\n##bar' }
      , container: testEl
      }).load();
  });

  after(function () {
    editor.unload();
  });

  it('check that exportFile will work without parameters by outputting the current file as raw text', function () {
    contents = editor.exportFile();
    expect(contents).to(match, /#foo\r?\n\r?\n##bar/);
  });

  it('check that exportFile will export the current file as HTML with a null parameter as it\'s first', function () {
    contents = editor.exportFile(null, 'html');
    expect(contents).to(be, '<h1>foo</h1>\n<h2>bar</h2>\n');
  });

  it('check that exporting a file that doesn\'t exist returns as undefined', function () {
    contents = editor.exportFile('doesntExist' + _randomNum());
    expect(contents).to(beUndefined);
  });

  it('check that export file can open non-currently open files', function () {
    var exportFileTest = 'exportFileTest' + _randomNum();
    editor.importFile(exportFileTest, 'hello world'); // import and open a file
    editor.open(testEl); // open the original again
    expect(editor.exportFile(exportFileTest)).to(be, 'hello world');
  });
});

describe('EpicEditor.rename', function () {

  var testEl, editor, oldName, newName;

  before(function () {
    testEl = _createTestElement()
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    oldName = 'foo' + _randomNum();
    newName = 'bar' + _randomNum();
    editor.importFile(oldName, 'testing...');
  });

  after(function () {
    editor.unload();
  });

  it('check to see if the foo file exists before trying to rename', function () {
    expect(editor.exportFile(oldName)).to(be, 'testing...');
  });

  it('check that renaming a file actually renames the file by exporting by the new files name', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(newName)).to(be, 'testing...');
  });

  it('check that foo no longer exists', function () {
    editor.rename(oldName, newName);
    expect(editor.exportFile(oldName)).to(beUndefined);
  });
});


describe('EpicEditor.remove', function () {
  
  var testEl, editor, removeMeFile, dontRemoveMeFile, eventWasFired;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    removeMeFile = 'removeMe' + _randomNum();
    dontRemoveMeFile = 'dontRemoveMe' + _randomNum();
    editor.importFile(removeMeFile, 'hello world').importFile(dontRemoveMeFile, 'foo bar');
  });
 
  after(function () {
    editor.unload();
  });

  it('check that the foo file was imported', function () {
    expect(editor.exportFile(removeMeFile)).to(be, 'hello world');
  });

  it('check that after removing the file exportFile returns false', function () {
    editor.remove(removeMeFile);
    expect(editor.exportFile(removeMeFile)).to(beUndefined);
  });

  it('check that other files weren\'t removed', function () {
    expect(editor.exportFile(dontRemoveMeFile)).to(be, 'foo bar');
  });


  it('check that the remove event fires when a file is deleted', function () {
    editor.on('remove', function () {
      eventWasFired = true;
    });

    editor.open(removeMeFile);
    editor.remove(removeMeFile);
    expect(eventWasFired).to(beTrue);
  });
});

describe('EpicEditor.preview and EpicEditor.edit', function () {
  
  var testEl, editor, previewEventWasCalled, editEventWasCalled;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    
    previewEventWasCalled = false;
    editEventWasCalled = false;
    
    editor.on('preview', function () {
      previewEventWasCalled = true;
    });
    
    editor.on('edit', function () {
      editEventWasCalled = true;
    });
  });

  after(function () {
    editor.removeListener('preview');
    editor.removeListener('edit');
    editor.unload();
  });

  it('check that the editor is currently displayed and not the previewer', function () {
    expect(editor.getElement('editorIframe').style.display).to(be, '');
  });

  it('check that the previewer can be tested to be hidden', function () {
    expect(editor.getElement('previewerIframe').style.display).to(be, 'none');
  });

  it('check that calling .preview() displays the previewer', function () {
    editor.preview();
    expect(editor.getElement('previewerIframe').style.display).to(be, 'block');
  });

  it('check that the preview event fires when the preview method is called', function () {
    editor.preview();
    expect(previewEventWasCalled).to(be, true);
  });

  it('check that the edit event fires when the edit method is called', function () {
    editor.edit();
    expect(editEventWasCalled).to(be, true);
  });
  
  it('check that switching from preview back to edit makes the editor visible', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('editorIframe').style.display).to(be, 'block');
  });

  it('check that switching from preview back to edit doesn\'t keep the previewer displayed', function () {
    editor.preview();
    editor.edit();
    expect(editor.getElement('previewerIframe').style.display).to(be, 'none');
  });
});

describe('EpicEditor.unload', function () {

  var testEl, editor, eventWasCalled;

  before(function () {
    testEl = _createTestElement()
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.load();

    eventWasCalled = false;

    editor.on('unload', function () {
      eventWasCalled = true;
    });
  });

  after(function () {
    editor.removeListener('unload');
  });

  it('check the editor was actually loaded first of all', function () {
    expect(document.getElementById(testEl).innerHTML).to(beTruthy);
  });

  it('check that the unload event fires when the editor is unloaded', function () {
    editor.unload();
    expect(eventWasCalled).to(be, true);
  });

  it('check the editor was unloaded properly by checking if the editor HTML is gone from the original element', function () {
    editor.unload();
    expect(document.getElementById(testEl).innerHTML).to(beFalsy);
  });

  it('check the editor\'s getElement method returns null for selected elements because they no longer exist', function () {
    editor.unload();
    expect(editor.getElement('editor')).to(beFalsy);
  });

  it('check that unload can\'t be run twice', function () {
    editor.unload();
    expect(function () { editor.unload(); }).to(throwError, 'Editor isn\'t loaded');
  });

  it('check that unload and reloading and then requesting getElement doesn\'t return null as if it were unloaded', function () {
    editor.unload();
    editor.load();
    expect(editor.getElement('editor')).to(beTruthy);
  });

});

describe('EpicEditor.save', function () {
  
  var testEl, editor, eventWasFired;
  
  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      , file:
        { defaultContent: 'foo'
        , autoSave: false
        }
      }).load();

    eventWasFired = false;
  });

  after(function () {
    editor.unload();
  });

  it('check that foo is the default content in the editor', function () {
    expect(editor.getElement('editor').body.innerHTML).to(be, 'foo');
  });

  it('check to make sure new file contents are saved after value is changed in the editor and save is called', function () {
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(JSON.parse(localStorage['epiceditor'])[testEl].content).to(be, 'bar');
  });

  it('check that the save event is called when the save method is run', function () {
    editor.on('save', function () {
      eventWasFired = true;
    });
    editor.save();
    expect(eventWasFired).to(be, true);
  });

  it('check that the update event fires when the content changes', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(eventWasFired).to(beTrue);
  });

  it('check that the update event DOES NOT fire when the content is the same', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'foo';
    editor.save();
    expect(eventWasFired).to(beFalse);
  });

  it('check that the timestamp is updated when the content is modified', function () {
    var currentModifiedDate = JSON.parse(localStorage['epiceditor'])[testEl].modified;
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(currentModifiedDate).toNot(be, JSON.parse(localStorage['epiceditor'])[testEl].modified);
  });

});

describe('EpicEditor.on', function () {
  
  var testEl, editor, hasBeenFired;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
  });

  after(function () {
    editor.removeListener('foo');
    editor.unload();
  });

  it('check that on fires on an EE event, preview', function () {
    editor.on('preview', function () {
      hasBeenFired = true;
    });
    editor.preview();
    expect(hasBeenFired).to(beTrue);
  });

  it('check that on fires for custom events', function () {
    editor.on('foo', function () {
      hasBeenFired = true;
    });
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

});

describe('EpicEditor.emit', function () {
   
  var testEl, editor, hasBeenFired;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
  });

  after(function () {
    editor.removeListener('foo');
    editor.unload();
  });

  // We don't use events in EpicEditor so only custom events need to be checked
  it('check that emit triggers a callback for a custom event', function () {
    editor.on('foo', function () {
      hasBeenFired = true;
    });
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

});

describe('EpicEditor.removeListener', function () {

  var testEl, editor, hasBeenFired, baz, qux, callCount;

  before(function () {
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
    callCount = 0;
    editor.on('foo', function () {
      hasBeenFired = true;
    });

    baz = function () {
      callCount++;
    };

    qux = function () {
      callCount++;
    };

    editor.on('bar', baz);
    editor.on('bar', qux);
  });

  after(function () {
    editor.unload();
  });

  it('check that the foo event can be fired', function () {
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

  it('check that removing the event WITHOUT a handler param, than emitting it doesn\'t trigger the event', function () {
    editor.removeListener('foo');
    editor.emit('foo');
    expect(hasBeenFired).to(beFalse);
  });

  it('check that removing the event WITH a handler param, than emitting it only triggers one of the two handlers', function () {
    editor.removeListener('bar', baz);
    editor.emit('bar');
    expect(callCount).to(be, 1);
  });

  it('check that removing an event WITHOUT the param removes ALL handlers of that event', function () {
    editor.removeListener('bar');
    editor.emit('bar');
    expect(callCount).to(be, 0);
  });

});
