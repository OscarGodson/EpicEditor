describe('#removeListener(event, [handler])', function () {
  var testEl
    , id
    , editor
    , hasBeenFired
    , baz
    , qux
    , callCount
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
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
    done();
  });

  afterEach(function (done) {
    editor.unload();
    done();
  });

  it('check that the foo event can be fired', function () {
    editor.emit('foo');
    expect(hasBeenFired).to.be(true);
  });

  it('check that removing the event WITHOUT a handler param, than emitting it doesn\'t trigger the event', function () {
    editor.removeListener('foo');
    editor.emit('foo');
    expect(hasBeenFired).to.be(false);
  });

  it('check that removing the event WITH a handler param, than emitting it only triggers one of the two handlers', function () {
    editor.removeListener('bar', baz);
    editor.emit('bar');
    expect(callCount).to.be(1);
  });

  it('check that removing an event WITHOUT the param removes ALL handlers of that event', function () {
    editor.removeListener('bar');
    editor.emit('bar');
    expect(callCount).to.be(0);
  });

});
