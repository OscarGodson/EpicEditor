/*global createContainer:false, removeContainer:false, rnd:false */

describe('.reflow([type], [callback])', function () {
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

  describe('callback', function () {
    var wasCalled, data;

    beforeEach(function () {
      wasCalled = false;
      data = {};
    });
    afterEach(function () {
      editor.removeListener('reflow');
    });
    it('fires an event when reflow is called without parameters with two properties in the data', function () {
      editor.reflow(function (callbackData) {
        wasCalled = true;
        data = callbackData;
      });
      expect(wasCalled).to.be(true);
      expect(data.width).to.not.be(undefined);
      expect(data.height).to.not.be(undefined);
    });
    it('fires an event when reflow width is called with only the width property in the data', function () {
      editor.reflow('width', function (callbackData) {
        wasCalled = true;
        data = callbackData;
      });
      expect(wasCalled).to.be(true);
      expect(data.width).to.not.be(undefined);
      expect(data.height).to.be(undefined);
    });
    it('fires an event when reflow height is called with only the height property in the data', function () {
      editor.reflow('height', function (callbackData) {
        wasCalled = true;
        data = callbackData;
      });
      editor.reflow('height');
      expect(wasCalled).to.be(true);
      expect(data.width).to.be(undefined);
      expect(data.height).to.not.be(undefined);
    });
  });

  describe('Events', function () {
    var wasCalled, data;

    beforeEach(function () {
      wasCalled = false;
      data = {};
      editor.on('reflow', function (callbackData) {
        wasCalled = true;
        data = callbackData;
      });
    });
    afterEach(function () {
      editor.removeListener('reflow');
    });
    it('fires an event when reflow is called without parameters with two properties in the data', function () {
      editor.reflow();
      expect(wasCalled).to.be(true);
      expect(data.width).to.not.be(undefined);
      expect(data.height).to.not.be(undefined);
    });
    it('fires an event when reflow width is called with only the width property in the data', function () {
      editor.reflow('width');
      expect(wasCalled).to.be(true);
      expect(data.width).to.not.be(undefined);
      expect(data.height).to.be(undefined);
    });
    it('fires an event when reflow height is called with only the height property in the data', function () {
      editor.reflow('height');
      expect(wasCalled).to.be(true);
      expect(data.width).to.be(undefined);
      expect(data.height).to.not.be(undefined);
    });
  });
});
