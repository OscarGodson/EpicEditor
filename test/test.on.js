/*global createContainer:false, removeContainer:false, rnd:false */

describe('.on(event, handler)', function () {
  var testEl
    , id
    , editor
    , eventFired;

  function flagEvent() {
    eventFired = true;
  }

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.load();
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  afterEach(function (done) {
    eventFired = false;
    done();
  })

  it('should fire an event on preview()', function () {
    editor.on('preview', flagEvent);
    editor.preview();
    editor.removeListener('preview')
    expect(eventFired).to.be(true);
  });

  it('should fire for custom event listeners', function () {
    editor.on('foo', flagEvent);
    editor.emit('foo');
    editor.removeListener('foo')
    expect(eventFired).to.be(true);
  });
});
