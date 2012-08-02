describe('#is(state)', function () {
  var testEl
    , id
    , editor
    ;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    // editor will be loaded on first test
    done();
  });

  after(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('should return loaded:FALSE when the editor has not been loaded', function () {
    expect(editor.is('loaded')).to.be(false);
  });

  it('should return loaded:TRUE when the editor is loaded', function () {
    editor.load();
    expect(editor.is('loaded')).to.be(true);
  });

  it('should return unloaded:TRUE when the editor IS unloaded', function () {
    editor.unload();
    expect(editor.is('unloaded')).to.be(true);
  });

  it('should return unloaded:FALSE when the editor is reloaded', function () {
    editor.load();
    expect(editor.is('unloaded')).to.be(false);
  });

  it('should return edit:TRUE when the editor is loaded by default', function () {
    expect(editor.is('edit')).to.be(true);
  });

  it('should return edit:TRUE when the editor is switched from preview to edit again', function () {
    editor.preview();
    editor.edit();
    expect(editor.is('edit')).to.be(true);
  });

  it('should return preview:TRUE when the editor is in preview mode', function () {
    editor.preview();
    expect(editor.is('preview')).to.be(true);
  });

  it('should return fullscreen:FALSE when the editor ISN\'T in fullscreen', function () {
    expect(editor.is('fullscreen')).to.be(false);
  });

  it('should return fullscreen:TRUE when the editor is in fullscreen', function () {
    editor.enterFullscreen();
    expect(editor.is('fullscreen')).to.be(true);
  });

  it('should return fullscreen:FALSE when the editor goes from fullscreen to exit fullscreen', function () {
    editor.enterFullscreen();
    editor.exitFullscreen();
    expect(editor.is('fullscreen')).to.be(false);
  });

  it('should return false for undefined states', function () {
    expect(editor.is('ballsdeep')).to.be(false);
  });
});

