/*global createContainer:false, removeContainer:false, rnd:false */

describe('.reflow([type])', function () {
  var testEl
    , id
    , editor
    , existingWidth
    , existingHeight;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id)
    testEl.style.display = 'block'
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl }).load();
    existingWidth = editor.getElement('wrapperIframe').offsetWidth
    existingHeight = editor.getElement('wrapperIframe').offsetHeight
    done();
  });

  afterEach(function (done) {
    testEl.style.display = 'none'
    editor.unload();
    removeContainer(id);
    done();
  });

  it('checks that both the height and width were resized when no params are given', function () {
    testEl.style.width = '9999px';
    testEl.style.height = '9999px';
    editor.reflow();

    expect(editor.getElement('wrapperIframe').offsetWidth).to.be(9999);
    expect(editor.getElement('wrapperIframe').offsetHeight).to.be(9999);
  });

  it('checks that only the width is resized when "width" is given as the first param', function () {
    testEl.style.width = '9999px';
    testEl.style.height = '9999px';
    editor.reflow('width');

    expect(editor.getElement('wrapperIframe').offsetWidth).to.be(9999);
    expect(editor.getElement('wrapperIframe').offsetHeight).to.be(existingHeight);
  });

  it('checks that only the height is resized when "height" is given as the first param', function () {
    testEl.style.width = '9999px';
    testEl.style.height = '9999px';
    editor.reflow('height');

    expect(editor.getElement('wrapperIframe').offsetWidth).to.be(existingWidth);
    expect(editor.getElement('wrapperIframe').offsetHeight).to.be(9999);
  });
});
