/*global createContainer:false, removeContainer:false, rnd:false */

describe('.exitFullscreen()', function () {
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
    editor.on('fullscreenexit', function () {
      count++
      eventFired = true;
    });
    editor.load();
    editor.enterFullscreen();
    editor.exitFullscreen();
    done();
  });

  after(function (done) {
    editor.removeListener('fullscreenexit');
    editor.unload();
    removeContainer(id);
    done();
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should exit fullscreen mode', function () {
    expect(editor.is('fullscreen')).to.be(false);
  });

  it('should fire the fullscreenexit event', function () {
    expect(eventFired).to.be(true);
  });

  // NOTE: This test depends on the counter and for speed we are not using a before/afterEach
  it('should fire the fullscreenexit event only once regardless of additional exitFullscreen calls', function () {
    editor.exitFullscreen();
    editor.exitFullscreen();
    expect(count).to.be(1);
  });
});
