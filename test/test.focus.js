/*global createContainer:false, removeContainer:false, rnd:false */

describe('.focus()', function () {
  var testEl
    , id
    , editor;

  beforeEach(function () {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor({
      basePath: '/epiceditor/',
      container: testEl,
      focusOnLoad: false
    });
    editor.load();
  });

  afterEach(function () {
    editor.removeListener('focus');
    editor.removeListener('blur');
    editor.unload();
    removeContainer(id);
  });

  it('should focus the editor', function () {
    document.querySelector('a').focus();
    expect(document.activeElement.nodeName).to.be('A');
    editor.focus();
    // Use .id to compare. A direct obj to obj comparison takes Mocha a long time
    expect(document.activeElement.id).to.be(editor.getElement('wrapperIframe').id);
  });
});
