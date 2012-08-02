describe('#save()', function () {
  var testEl
    , id
    , editor
    , eventWasFired
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: testEl
      , file:
        { defaultContent: 'foo'
        , autoSave: false
        }
      }).load();

    eventWasFired = false;
    done();
  });

  afterEach(function (done) {
    editor.unload();
    done();
  });

  it('check that foo is the default content in the editor', function () {
    expect(editor.getElement('editor').body.innerHTML).to.be('foo');
  });

  it('check to make sure new file contents are saved after value is changed in the editor and save is called', function () {
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(JSON.parse(localStorage['epiceditor'])[id].content).to.be('bar');
  });

  it('check that the save event is called when the save method is run', function () {
    editor.on('save', function () {
      eventWasFired = true;
    });
    editor.save();
    expect(eventWasFired).to.be(true);
  });

  it('check that the update event fires when the content changes', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(eventWasFired).to.be(true);
  });

  it('check that the update event DOES NOT fire when the content is the same', function () {
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'foo';
    editor.save();
    expect(eventWasFired).to.be(false);
  });

  it('check that the timestamp is updated when the content is modified', function () {
    var currentModifiedDate = JSON.parse(localStorage['epiceditor'])[id].modified;
    editor.on('update', function () {
      eventWasFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(currentModifiedDate).to.not.be(JSON.parse(localStorage['epiceditor'])[id].modified);
  });

});
