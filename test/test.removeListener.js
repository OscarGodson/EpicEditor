/*global createContainer:false, removeContainer:false, rnd:false */

describe('.removeListener(event, [handler])', function () {
  var testEl
    , id
    , editor
    , eventFired
    , baz
    , qux
    , count;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    eventFired = false;
    count = 0;
    editor.on('foo', function () {
      eventFired = true;
    });

    baz = function () {
      count++;
    };

    qux = function () {
      count++;
    };

    editor.on('bar', baz);
    editor.on('bar', qux);
    done();
  });

  afterEach(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should initially fire the foo event', function () {
    editor.emit('foo');
    expect(eventFired).to.be(true);
  });

  it('should not call the handler if it has been removed without a handler param', function () {
    editor.removeListener('foo');
    editor.emit('foo');
    expect(eventFired).to.be(false);
  });

  it('should only remove the passed named handler for a given event', function () {
    editor.removeListener('bar', baz);
    editor.emit('bar');
    expect(count).to.be(1);
  });

  it('should remove all named handlers for a given event when that parameter is NOT passed', function () {
    editor.removeListener('bar');
    editor.emit('bar');
    expect(count).to.be(0);
  });
});
