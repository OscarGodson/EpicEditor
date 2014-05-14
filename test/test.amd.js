describe('define()', function () {
  var loadEpicEditor = function () {
    var script = document.createElement("script");
    script.src = "/epiceditor/js/epiceditor.js";
    document.body.appendChild(script);
    return script;
  }

  beforeEach(function () {
    window.defineIsCalled = false;
    window.define = function () { window.defineIsCalled = true };
    window.define.amd = true;
  });

  afterEach(function () {
    delete window.defineIsCalled;
    delete window.define;
  });

  it('is not called when not provided', function (done) {
    delete window.define;
    loadEpicEditor().onload = function () {
      expect(window.defineIsCalled).to.be(false);
      done();
    };
  });

  it('is called when provided', function (done) {
    loadEpicEditor().onload = function () {
      expect(window.defineIsCalled).to.be(true);
      done();
    };
  });

  it('is not called when `define.amd` evaluates to `false`', function (done) {
    delete window.define.amd;
    loadEpicEditor().onload = function () {
      expect(window.defineIsCalled).to.be(false);
      done();
    };
  });
});
