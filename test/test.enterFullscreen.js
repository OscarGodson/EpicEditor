/*global createContainer:false, removeContainer:false, rnd:false */

describe('.enterFullscreen()', function () {
  var testEl
    , id
    , editor
    , eventFired
    , count;

  before(function (done) {
    id = rnd();
    count = 0;
    eventFired = false;
    testEl = createContainer(id);
    editor = new EpicEditor({basePath: '/epiceditor/', container: testEl})
    editor.on('fullscreenenter', function () {
      eventFired = true;
      count++;
    });
    editor.load();
    editor.enterFullscreen();
    done();
  });

  after(function (done) {
    editor.removeListener('fullscreenenter');
    editor.unload();
    removeContainer(id);
    done();
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should enter fullscreen mode', function () {
    expect(editor.is('fullscreen')).to.be(true);
  });

  it('should fire the fullscreenenter event', function () {
    expect(eventFired).to.be(true);
  });

  // NOTE: This test depends on the counter and for speed we are not using a before/afterEach
  it('should fire the fullscreenenter event only once regardless of additional enterFullscreen calls', function () {
    editor.enterFullscreen();
    editor.enterFullscreen();
    expect(count).to.be(1);
  });
});
