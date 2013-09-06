/*global createContainer:false, removeContainer:false, rnd:false */

describe('.save()', function () {
  var testEl
    , id
    , editor
    , eventFired
    , badEventFired;

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
      });

    eventFired = false;
    badEventFired = false;
    editor.load();
    done();
  });

  afterEach(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should save new content', function () {
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(JSON.parse(localStorage['epiceditor'])[id].content).to.be('bar');
  });

  it('should fire the create event when saving a new file', function () {
    editor.on('create', function (file) {
      eventFired = true;
      expect(file.content).to.be('foo');
      expect(file.created).to.be.ok();
      expect(file.modified).to.be.ok();
    });
    editor.settings.file.name = id + 'LOL';
    editor.save();
    expect(eventFired).to.be(true);
  });

  it('should fire the save event but not the autosave event', function () {
    editor.on('save', function () {
      eventFired = true;
    });
    editor.on('autosave', function () {
      badEventFired = true;
    });
    editor.save();
    expect(eventFired).to.be(true);
    expect(badEventFired).to.be(false);
  });

  it('should fire the autosave event but not the save event', function () {
    editor.on('save', function () {
      badEventFired = true;
    });
    editor.on('autosave', function () {
      eventFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save(false, true);
    expect(eventFired).to.be(true);
    expect(badEventFired).to.be(false);
  });

  it('should not fire an event', function () {
    editor.on('save', function () {
      badEventFired = true;
    });
    editor.on('autosave', function () {
      badEventFired = true;
    });
    editor.save(true);
    expect(badEventFired).to.be(false);
  });

  it('should fire the autosave event only once', function () {
    editor.on('autosave', function () {
      eventFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save(false, true);
    expect(eventFired).to.be(true);
    eventFired = false;
    editor.save(false, true);
    expect(eventFired).to.be(false);
  });

  it('should fire the update event on save when the content has changed', function () {
    editor.on('update', function () {
      eventFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(eventFired).to.be(true);
  });

  it('should not fire the update event on save when the content has not changed', function () {
    editor.on('update', function () {
      eventFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'foo';
    editor.save();
    expect(eventFired).to.be(false);
  });

  it('should update the timestamp on save when the content has been updated', function () {
    var currentModifiedDate = JSON.parse(localStorage['epiceditor'])[id].modified;
    editor.on('update', function () {
      eventFired = true;
    });
    editor.getElement('editor').body.innerHTML = 'bar';
    editor.save();
    expect(currentModifiedDate).to.not.be(JSON.parse(localStorage['epiceditor'])[id].modified);
  });

});
