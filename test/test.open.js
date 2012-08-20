/*global createContainer:false, removeContainer:false, rnd:false */

describe('.open(fileName)', function () {
  var testEl
    , id
    , editor
    , openMeFile
    , openMeLaterFile
    , eventFired
    , newFile;

  function flagEvent() {
    eventFired = true;
  }

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    openMeFile = 'openMe' + id;
    openMeLaterFile = 'openMeLater' + id;
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });

    newFile = 'foo' + id;
    editor.load();
    editor.importFile(openMeLaterFile, 'open me later').importFile(openMeFile, 'open this file');
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer();
    done();
  });

  afterEach(function (done) {
    // reset states
    editor.open(id);
    eventFired = false;
    done();
  });

  it('should create an exportable openMe file', function () {
    expect(editor.exportFile(openMeFile)).to.be('open this file');
  });

  it('should create an exportable openMeLater file', function () {
    expect(editor.exportFile(openMeLaterFile)).to.be('open me later');
  });

  it('should open the openMe file in the editor', function () {
    editor.open(openMeFile);
    expect(editor.getElement('editor').body.innerHTML).to.match(/open(&nbsp;| )?this(&nbsp;| )?file/g);
  });

  it('should open the openMeLater file in the editor after calling .open', function () {
    editor.open(openMeLaterFile);
    expect(editor.getElement('editor').body.innerHTML).to.match(/open(&nbsp;| )?me(&nbsp;| )?later/g);
  });

  it('should fire the open event when the open method is called', function () {
    editor.on('open', flagEvent);
    editor.open();
    editor.removeListener('open');
    expect(eventFired).to.be(true);
  });

  it('should fire the create event when a new file is created with open()', function () {
    editor.on('create', flagEvent);
    editor.open(newFile);
    editor.removeListener('create');
    expect(eventFired).to.be(true);
  });

  it('should not fire the create event when an existing file is opened', function () {
    editor.on('create', flagEvent);
    editor.open(id);
    editor.removeListener('create');
    expect(eventFired).to.be(false);
  });

  it('should fire the read event when a file is read with open()', function () {
    editor.on('read', flagEvent);
    editor.open(newFile);
    editor.removeListener('read');
    expect(eventFired).to.be(true);
  });
});
