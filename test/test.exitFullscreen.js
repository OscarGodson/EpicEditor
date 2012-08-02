describe('#exitFullscreen()', function () {
  var testEl
    , id
    , editor
    , exitEventFired = false
    , count
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({basePath: '/epiceditor/', container: testEl})
    count = 0;
    editor.on('fullscreenexit', function () {
      count++
      exitEventFired = true;
    });
    editor.load(function () {
      done();
    });
  });

  afterEach(function (done) {
    editor.removeListener('fullscreenexit');
    editor.unload(function () {
      done();
    });
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should exit fullscreen mode', function () {
    editor.enterFullscreen();
    editor.exitFullscreen();
    expect(editor._eeState.fullscreen).to.be(false);
  });

  it('should fire the fullscreenexit event', function () {
    editor.enterFullscreen();
    editor.exitFullscreen();
    expect(exitEventFired).to.be(true);
  });

  it('should emit the fullscreenexit event only once regardless of additional exitFullscreen calls', function () {
    editor.enterFullscreen();
    editor.exitFullscreen();
    editor.exitFullscreen();
    expect(count).to.be(1);
  });
});
