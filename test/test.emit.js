describe('#emit([event])', function () {
  var testEl
    , id
    , editor
    , hasBeenFired = false
    ;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.on('foo', function () {
      hasBeenFired = true;
    });
    editor.load(function () {
      done();
    })
  });

  after(function (done) {
    editor.removeListener('foo');
    editor.unload(function () {
      done();
    });
  });

  // We don't use events in EpicEditor so only custom events need to be checked
  it('should trigger a callback for a custom event', function () {
    editor.emit('foo');
    expect(hasBeenFired).to.be(true);
  });

});
