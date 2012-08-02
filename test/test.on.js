describe('#on(event, handler)', function () {
  var testEl
    , id
    , editor
    , eventFired
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    eventFired = false;
    editor.load(function () {
      done();
    });
  });

  afterEach(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('should fire an event on preview()', function () {
    editor.on('preview', function () {
      eventFired = true;
    });
    editor.preview();
    expect(eventFired).to.be(true);
  });

  it('should fire for custom event listeners', function () {
    editor.on('foo', function () {
      eventFired = true;
    });
    editor.emit('foo');
    expect(eventFired).to.be(true);
  });
});
