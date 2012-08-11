/*global createContainer:false, removeContainer:false, rnd:false */

describe('.emit([event])', function () {
  var testEl
    , id
    , editor
    , eventFired = false;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.on('foo', function () {
      eventFired = true;
    });
    editor.load();
    done();
  });

  after(function (done) {
    editor.removeListener('foo');
    editor.unload();
    removeContainer(id);
    done();
  });

  // We don't use events in EpicEditor so only custom events need to be checked
  it('should trigger a callback for a custom event', function () {
    editor.emit('foo');
    expect(eventFired).to.be(true);
  });

});
