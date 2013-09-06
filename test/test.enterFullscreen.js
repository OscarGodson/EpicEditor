/*global createContainer:false, removeContainer:false, rnd:false */

describe('.enterFullscreen()', function () {
  var testEl
    , id
    , editor
    , eventFired
    , count;

  beforeEach(function () {
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
  });

  afterEach(function (done) {
    editor.removeListener('fullscreenenter');
    editor.unload();
    removeContainer(id);
    done();
  });

  // TODO: Figure out some way to actually test if fullscreen opened
  it('should enter fullscreen mode', function (done) {
    editor.enterFullscreen(function () {
      expect(editor.is('fullscreen')).to.be(true);
      done();
    });
  });

  it('should fire the fullscreenenter event', function (done) {
    editor.enterFullscreen(function () {
      expect(eventFired).to.be(true);
      done();
    });
  });

  // NOTE: This test depends on the counter and for speed we are not using a before/afterEach
  it('should fire the fullscreenenter event only once regardless of additional enterFullscreen calls', function (done) {
    editor.enterFullscreen(function () {
      editor.enterFullscreen(function () {
        expect(count).to.be(1);
        done();
      });
    });
  });
});
