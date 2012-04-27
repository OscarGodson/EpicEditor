// foounit.require(':spec/spec-helper');

// Include your source file here
foounit.require('/epiceditor/js/epiceditor')

function _getIframeInnards(el) {
  return el.contentDocument || el.contentWindow.document;
}

function _createTestElement(){
  var testEl = document.createElement('div')
    , testId = 'epiceditor-'+(new Date().getTime())+'-'+(Math.round(Math.random()*1000))
  testEl.id = testId;
  document.body.appendChild(testEl);
  return testId;
}

function _randomNum() {
  return Math.round(Math.random()*10000);
}

// Clean start
localStorage.clear();

describe('EpicEditor.load', function () {

  var testEl = _createTestElement()
    , editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl })
    , editorIframe
    , editorInnards
    , wasLoaded = false;

  editor.on('load',function(){
    wasLoaded = this;
  });

  editor.load();

  it('check if EE returns an object reference',function(){
    expect(typeof editor).to(be,'object');
  });


  it('make sure the load event was fired',function(){
    expect(typeof wasLoaded).to(be,'object');
  });

  describe('check if the DOM is in place',function(){

    editorIframe = document.getElementById(testEl).getElementsByTagName('iframe');
    editorInnards = _getIframeInnards(editorIframe[0]);

    it('make sure there\'s one wrapping iframe',function(){ 
      expect(editorIframe.length).to(be,1);
    });
    
    it('make sure there\'s two inner iframes',function(){ 
      expect(editorInnards.getElementsByTagName('iframe').length).to(be,2);
    });

    it('check to make sure the editor frame exists', function(){
      expect(editorInnards.getElementById('epiceditor-editor-frame')).toNot(beNull);
    });

    it('check to make sure the previewer frame exists', function(){
      expect(editorInnards.getElementById('epiceditor-previewer-frame')).toNot(beNull);
    });

    it('check to make sure the utility bar exists', function(){
      // This really needs to be an ID, and when it changes, should check for null and not undefined
      expect(editorInnards.getElementsByClassName('epiceditor-utilbar')[0]).toNot(beUndefined);
    });
  });
});

describe('EpicEditor.load.options', function(){

});

describe('EpicEditor.getElement',function(){

  var testEl = _createTestElement()
    , editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load()
    , wrapperIframe
    , innerWrapper;

  before(function(){
    wrapperIframe = document.getElementById(testEl).getElementsByTagName('iframe')[0];
    innerWrapper = _getIframeInnards(wrapperIframe);
  });

  it('check that "container" is the element given at setup', function(){
    expect(editor.getElement('container')).to(be, document.getElementById(testEl));
  });

  it('check that the "wrapper" is the div inside the wrapping iframe containing the other two iframes', function(){
    innerWrapperDiv = innerWrapper.getElementById('epiceditor-wrapper');
    expect(editor.getElement('wrapper')).to(be, innerWrapperDiv);
  });

  it('check that the "wrapperIframe" is the iframe containing the other two iframes', function(){
    expect(editor.getElement('wrapperIframe')).to(be, wrapperIframe);
  });

  it('check that "editor" is #document of the editor iframe', function(){
    expect(editor.getElement('editor')).to(be, _getIframeInnards(innerWrapper.getElementById('epiceditor-editor-frame')));
  });

  it('check that "editorIframe" is <iframe> containing the editor', function(){
    expect(editor.getElement('editorIframe').id).to(be,'epiceditor-editor-frame');
  });

  it('check that "previewer" is #document of the previewer iframe', function(){
    expect(editor.getElement('previewer')).to(be, _getIframeInnards(innerWrapper.getElementById('epiceditor-previewer-frame')));
  });

  it('check that "previewerIframe" is <iframe> containing the previewer', function(){
    expect(editor.getElement('previewerIframe').id).to(be,'epiceditor-previewer-frame');
  });
});



describe('EpicEditor.open', function(){

  var testEl, editor, openMeFile, openMeLaterFile;

  before(function(){  
    testEl = _createTestElement();
    openMeFile = 'openMe'+_randomNum();
    openMeLaterFile = 'openMeLater'+_randomNum();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    editor.importFile(openMeLaterFile,'open me later').importFile(openMeFile,'open this file');
  });

  it('check that the openMe file was created successfully', function(){
    expect(editor.exportFile(openMeFile)).to(be,'open this file');
  });

  it('check that the openMeLater file was created successfully', function(){
    expect(editor.exportFile(openMeLaterFile)).to(be,'open me later');
  });
  
  it('check that the file is open in the editor', function(){
    expect(editor.getElement('editor').body.innerHTML).to(be,'open this file');
  });

  it('check that openMeLater opens into the editor after calling .open', function(){
    editor.open(openMeLaterFile);
    expect(editor.getElement('editor').body.innerHTML).to(be,'open me later');
  });

});

describe('EpicEditor.importFile', function(){

  var testEl, editor;

  before(function(){    
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
  });

  it('check that the content is currently blank', function(){
    expect(editor.exportFile()).to(be,'');
  });

  it('check that importFile(\'foo\',\'#bar\') is imported and can be received', function(){
    var importFileTest = 'importFileTest'+_randomNum();
    editor.importFile(importFileTest,'#bar');
    expect(editor.exportFile(importFileTest)).to(be,'#bar');
  });

  it('check that setting the file name as null imports content into the currently open file', function(){
    editor.importFile(null,'foo');
    expect(editor.exportFile(testEl)).to(be,'foo');
  });
  
  // TODO: Tests for importFile's kind parameter when implemented
  // TODO: Tests for importFile's meta parameter when implemented

});

describe('EpicEditor.exportFile', function(){

  var testEl, contents, editor;

  before(function(){
    testEl = _createTestElement();
    
    editor = new EpicEditor({
      basePath: '/epiceditor/'
    , file:{
          defaultContent: '#foo\n\n##bar'
      }
    , container: testEl
    }).load();
  });


  it('check that exportFile will work without parameters by outputting the current file as raw text', function(){
    contents = editor.exportFile();
    expect(contents).to(be,'#foo\n\n##bar');
  });

  it('check that exportFile will export the current file as HTML with a null parameter as it\'s first', function(){
    contents = editor.exportFile(null, 'html');
    expect(contents).to(be,'<h1>foo</h1>\n<h2>bar</h2>\n');
  });

  it('check that exporting a file that doesn\'t exist returns as undefined', function(){
    contents = editor.exportFile('doesntExist'+_randomNum());
    expect(contents).to(beUndefined);
  });

  it('check that export file can open non-currently open files', function(){
    var exportFileTest = 'exportFileTest'+_randomNum();
    editor.importFile(exportFileTest, 'hello world'); // import and open a file
    editor.open(testEl); // open the original again
    expect(editor.exportFile(exportFileTest)).to(be,'hello world');
  });
});

describe('EpicEditor.rename', function(){

  var testEl, editor, oldName, newName;

  before(function(){
    testEl = _createTestElement()
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    oldName = 'foo'+_randomNum();
    newName = 'bar'+_randomNum();
    editor.importFile(oldName, 'testing...');
  });

  it('check to see if the foo file exists before trying to rename', function(){
    expect(editor.exportFile(oldName)).to(be,'testing...');
  });

  it('check that renaming a file actually renames the file by exporting by the new files name', function(){
    editor.rename(oldName,newName);
    expect(editor.exportFile(newName)).to(be,'testing...');
  });

  it('check that foo no longer exists', function(){
    editor.rename(oldName,newName);
    expect(editor.exportFile(oldName)).to(beUndefined);
  });
});


describe('EpicEditor.remove', function(){
  
  var testEl, editor, removeMeFile, dontRemoveMeFile;

  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    removeMeFile = 'removeMe'+_randomNum();
    dontRemoveMeFile = 'dontRemoveMe'+_randomNum();
    editor.importFile(removeMeFile,'hello world').importFile(dontRemoveMeFile,'foo bar');
  });
  
  it('check that the foo file was imported', function(){
    expect(editor.exportFile(removeMeFile)).to(be,'hello world');
  });

  it('check that after removing the file exportFile returns false', function(){
    editor.remove(removeMeFile);
    expect(editor.exportFile(removeMeFile)).to(beUndefined);
  });

  it('check that other files weren\'t removed', function(){
    expect(editor.exportFile(dontRemoveMeFile)).to(be,'foo bar');
  });
});

describe('EpicEditor.preview and EpicEditor.edit', function(){
  
  var testEl, editor;

  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
  });

  it('check that the editor is currently displayed and not the previewer', function(){
    expect(editor.getElement('editorIframe').style.display).to(be, '');
  });

  it('check that the previewer can be tested to be hidden', function(){
    expect(editor.getElement('previewerIframe').style.display).to(be, 'none');
  });

  it('check that calling .preview() displays the previewer', function(){
    editor.preview();
    expect(editor.getElement('previewerIframe').style.display).to(be, 'block');
  });

  it('check that switching from preview back to edit makes the editor visible', function(){
    editor.preview();
    editor.edit();
    expect(editor.getElement('editorIframe').style.display).to(be, 'block');
  });

  it('check that switching from preview back to edit doesn\'t keep the previewer displayed', function(){
    editor.preview();
    editor.edit();
    expect(editor.getElement('previewerIframe').style.display).to(be, 'none');
  });
});

describe('EpicEditor.unload', function(){

  var testEl, editor;

  before(function(){
    testEl = _createTestElement()
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.load();
  });

  it('check the editor was actually loaded first of all', function(){
    expect(document.getElementById(testEl).innerHTML).to(beTruthy);
  });

  it('check the editor was unloaded properly by checking', function(){
    editor.unload();
    expect(document.getElementById(testEl).innerHTML).to(beFalsy);
  });

  it('check the editor\'s getElement method returns null for selected elements because they no longer exist', function(){
    editor.unload();
    expect(editor.getElement('editor')).to(beFalsy);
  });

  it('check that unload can\'t be run twice', function(){
    editor.unload();
    expect(function(){ editor.unload(); }).to(throwError,'Editor isn\'t loaded');
  });

  it('check that unload and reloading and then requesting getElement doesn\'t return null as if it were unloaded', function(){
    editor.unload();
    editor.load();
    expect(editor.getElement('editor')).to(beTruthy);
  });

});

describe('EpicEditor.save', function(){
  
  var testEl, editor;
  
  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({
      basePath: '/epiceditor/'
    , container: testEl 
    , file: {
        defaultContent: 'foo'
      }
    }).load();
  });

  it('check that foo is the default content in the editor', function(){
    expect(editor.getElement('editor').body.innerHTML).to(be, 'foo');
  });

  it('check to make sure new file contents are saved after value is changed in the editor and save is called', function(){
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(JSON.parse(localStorage['epiceditor']).files[testEl]).to(be, 'bar');
  });

});

describe('EpicEditor.on', function(){
  
  var testEl, editor, hasBeenFired;

  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
  });

  after(function(){
    editor.removeListener('foo');
  });

  it('check that on fires on an EE event, preview', function(){
    editor.on('preview', function(){
      hasBeenFired = true;
    });
    editor.preview();
    expect(hasBeenFired).to(beTrue);
  });

  it('check that on fires for custom events', function(){
    editor.on('foo', function(){
      hasBeenFired = true;
    });
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

});

describe('EpicEditor.emit', function(){
   
  var testEl, editor, hasBeenFired;

  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
  });

  after(function(){
    editor.removeListener('foo');
  });

  // We don't use events in EpicEditor so only custom events need to be checked
  it('check that emit triggers a callback for a custom event', function(){
    editor.on('foo', function(){
      hasBeenFired = true;
    });
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

});

describe('EpicEditor.removeListener', function(){

  var testEl, editor, hasBeenFired, baz, qux, callCount;

  before(function(){
    testEl = _createTestElement();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    hasBeenFired = false;
    callCount = 0;
    editor.on('foo', function(){
      hasBeenFired = true;
    });

    baz = function(){
      callCount++;
    };

    qux = function(){
      callCount++;
    };

    editor.on('bar', baz);
    editor.on('bar', qux);
  });

  it('check that the foo event can be fired', function(){
    editor.emit('foo');
    expect(hasBeenFired).to(beTrue);
  });

  it('check that removing the event WITHOUT a handler param, than emitting it doesn\'t trigger the event', function(){
    editor.removeListener('foo');
    editor.emit('foo');
    expect(hasBeenFired).to(beFalse);
  });

  it('check that removing the event WITH a handler param, than emitting it only triggers one of the two handlers', function(){
    editor.removeListener('bar', baz);
    editor.emit('bar');
    expect(callCount).to(be, 1);
  });

  it('check that removing an event WITHOUT the param removes ALL handlers of that event', function(){
    editor.removeListener('bar');
    editor.emit('bar');
    expect(callCount).to(be, 0);
  });

});
