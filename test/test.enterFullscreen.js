describe('#enterFullscreen()', function () {
  var testEl
    , id
    , editor
    , eventWasCalled
    , count
    ;

  before(function (done) {
    count = 0;
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({basePath: '/epiceditor/', container: testEl})
    editor.on('fullscreenenter', function () {
      eventWasCalled = true;
      count++;
    });
    editor.load(function () {
      editor.enterFullscreen();
      done();
    })
  });

  after(function (done) {
    editor.removeListener('fullscreenenter');
    editor.unload(function () {
      done();
    });
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should enter fullscreen mode', function () {
    expect(editor._eeState.fullscreen).to.be(true);
  });

  it('should fire the fullscreenenter event', function () {
    expect(eventWasCalled).to.be(true);
  });

  it('should emit the fullscreenenter event only once regardless of additional enterFullscreen calls', function () {
    editor.enterFullscreen();
    editor.enterFullscreen();
    expect(count).to.be(1);
  });
});
