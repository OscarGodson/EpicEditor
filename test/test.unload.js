/*global createContainer:false, removeContainer:false, rnd:false */

describe('.unload([callback])', function () {
  var testEl
    , id
    , editor
    , eventFired;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id)
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    eventFired = false;
    editor.on('unload', function () {
      eventFired = true;
    });
    done();
  });

  after(function (done) {
    editor.removeListener('unload');
    if (editor.is('loaded')) {
      editor.unload();
    }
    removeContainer(id);
    done();
  });

  afterEach(function (done) {
    editor.load();
    done();
  });

  it('should fire the unload event', function () {
    editor.load();
    editor.unload();
    expect(eventFired).to.be(true);
  });

  it('should remove editor HTML from the container element', function () {
    editor.unload();
    expect(document.getElementById(id).innerHTML).to.not.be.ok();
  });

  it('should throw an error if run multiple times', function () {
    editor.unload();
    expect(function () { editor.unload(); }).to.throwError('Editor isn\'t loaded');
  });
});
