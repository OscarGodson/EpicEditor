/*global createContainer:false, removeContainer:false, rnd:false, xit:false */

describe('.is(state)', function () {
  var testEl
    , id
    , editor;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    // editor will be loaded on second test
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should return loaded:FALSE when the editor has not been loaded', function () {
    expect(editor.is('loaded')).to.be(false);
  });

  it('should return loaded:TRUE when the editor is loaded', function () {
    editor.load();
    expect(editor.is('loaded')).to.be(true);
  });

  it('should return unloaded:TRUE when the editor is unloaded', function () {
    editor.unload();
    expect(editor.is('unloaded')).to.be(true);
  });

  it('should return unloaded:FALSE when the editor is reloaded', function () {
    editor.load();
    expect(editor.is('unloaded')).to.be(false);
  });

  it('should return edit:TRUE when the editor is loaded in edit mode', function () {
    expect(editor.is('edit')).to.be(true);
  });

  it('should return edit:TRUE when the editor is switched from preview back to edit', function () {
    editor.preview();
    editor.edit();
    expect(editor.is('edit')).to.be(true);
  });

  it('should return preview:TRUE when the editor is in preview mode', function () {
    editor.preview();
    expect(editor.is('preview')).to.be(true);
  });

  it('should return fullscreen:FALSE when the editor is not in fullscreen', function () {
    expect(editor.is('fullscreen')).to.be(false);
  });

  it('should return fullscreen:TRUE when the editor is in fullscreen', function (done) {
    editor.enterFullscreen(function () {
      expect(editor.is('fullscreen')).to.be(true);
      done();
    });
  });

  it('should return fullscreen:FALSE when the editor goes from fullscreen to exit fullscreen', function () {
    editor.enterFullscreen();
    editor.exitFullscreen();
    expect(editor.is('fullscreen')).to.be(false);
  });

  xit('should return focus:TRUE when the editor is focused', function () {
    expect(editor.is('focused')).to.be(false);
    editor.focus();
    expect(editor.is('focused')).to.be(true);
  });

  xit('should return focus:FALSE when the editor is NOT focused', function () {
    // Make sure we focus on something else to be sure the editor isn't focused
    document.querySelector('a').focus();
    expect(editor.is('focused')).to.be(false);
  });

  it('should return undefined:FALSE for undefined states', function () {
    expect(editor.is('undefined')).to.be(false);
  });
});

