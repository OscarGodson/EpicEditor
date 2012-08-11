/*global createContainer:false, removeContainer:false, rnd:false */

describe('EpicEditor([options])', function () {
  var editor
    , id
    , el
    , opts;

  beforeEach(function (done) {
    id = rnd();
    el = createContainer(id);
    opts =
      { basePath: '/epiceditor'
      , container: el
      , file: { autoSave: false }
      }
    done();
  });

  afterEach(function (done) {
    editor.unload();
    if (!el.id) {
      (el.id = id); // to reset in the case where the id is removed
    }
    removeContainer(id);
    done();
  })

  it('should allow the container option to be passed as an element ID string', function () {
    opts.container = id;

    editor = new EpicEditor(opts).load();
    expect(editor.getElement('container').id).to.be(id);
  });

  it('should allow the container option to be passed as a DOM element', function () {
    editor = new EpicEditor(opts).load();
    expect(editor.getElement('container').id).to.be(id);
  });

  it('should use the container ID to set the localStorage key when passed as a string', function () {
    opts.container = id;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[id]).to.be.ok();
  });

  it('should use the container ID to set the localStorage key when passed as a DOM element', function () {
    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[id]).to.be.ok();
  });

  it('should accept the file.name option to set the localStorage key', function () {
    var fileName = 'user-file-name-' + id;
    opts.file.name = fileName;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)[fileName]).to.be.ok();
  });

  it('should set the localStorage key when no other fallback is available', function () {
    el.id = '';

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage.epiceditor)['__epiceditor-untitled-1']).to.be.ok();
  });

  it('should accept a clientSideStorage option that will not initialize localStorage when false', function () {
    opts.clientSideStorage = false;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.be(undefined);
  });

  it('should accept a clientSideStorage option that will initialize localStorage when true', function () {
    opts.clientSideStorage = true;

    editor = new EpicEditor(opts).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.be.ok();
  });

  it('should accept a defaultContent option that sets the initial editor content', function () {
    opts.file.defaultContent = 'foo';

    editor = new EpicEditor(opts).load();
    expect(editor.getElement('editor').body.innerHTML).to.be('foo');
  });
});
