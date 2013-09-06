/*global createContainer:false, removeContainer:false, rnd:false */

describe('.exitFullscreen()', function () {
  var testEl
    , id
    , editor
    , eventFired
    , count;

  beforeEach(function (done) {
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
    editor.enterFullscreen(function () {
      done();
    });
  });

  afterEach(function (done) {
    editor.removeListener('fullscreenexit');
    editor.unload();
    removeContainer(id);
    done();
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should exit fullscreen mode', function (done) {
    editor.exitFullscreen(function () {
      expect(editor.is('fullscreen')).to.be(false);
      done();
    });
  });

  it('should fire the fullscreenexit event', function (done) {
    editor.exitFullscreen(function () {
      expect(eventFired).to.be(true);
      done();
    });
  });

  // NOTE: This test depends on the counter and for speed we are not using a before/afterEach
  it('should fire the fullscreenexit event only once regardless of additional exitFullscreen calls', function (done) {
    editor.exitFullscreen(function () {
      editor.exitFullscreen(function () {
        expect(count).to.be(1);
        done();
      });
    });
  });
});
