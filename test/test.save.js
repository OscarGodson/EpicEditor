/*global createContainer:false, removeContainer:false, rnd:false */

describe('.save()', function () {
  var testEl
    , id
    , editor
    , eventFired;

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

  it('should fire the save event', function () {
    editor.on('save', function () {
      eventFired = true;
    });
    editor.save();
    expect(eventFired).to.be(true);
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
