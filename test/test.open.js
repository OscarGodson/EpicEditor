describe('#open(fileName)', function () {
  var testEl
    , id
    , editor
    , openMeFile
    , openMeLaterFile
    , eventFired
    , fooFile
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id);
    openMeFile = 'openMe' + rnd();
    openMeLaterFile = 'openMeLater' + rnd();
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });

    fooFile = 'foo' + rnd();
    eventFired = false;
    editor.load(function () {
      editor.importFile(openMeLaterFile, 'open me later').importFile(openMeFile, 'open this file');
      done();
    });
  });

  afterEach(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('check that the openMe file was created successfully', function () {
    expect(editor.exportFile(openMeFile)).to.be('open this file');
  });

  it('check that the openMeLater file was created successfully', function () {
    expect(editor.exportFile(openMeLaterFile)).to.be('open me later');
  });

  it('check that the file is open in the editor', function () {
    expect(editor.getElement('editor').body.innerHTML).to.be('open this file');
  });

  it('check that openMeLater opens into the editor after calling .open', function () {
    editor.open(openMeLaterFile);
    expect(editor.getElement('editor').body.innerHTML).to.be('open me later');
  });

  it('check that the open event is called when the open method is run', function () {
    editor.on('open', function () {
      eventFired = true;
    });
    editor.open();
    expect(eventFired).to.be(true);
  });

  it('check that the create event fires for a new file created with open()', function () {
    editor.on('create', function () {
      eventFired = true;
    });
    editor.open(fooFile);
    expect(eventFired).to.be(true);
  });

  it('check that the create event DOES NOT fire for an existing file with open', function () {
    editor.open(fooFile); // change the file from "testEl"

    editor.on('create', function () {
      eventFired = true;
    });

    editor.open(id);

    expect(eventFired).to.be(false);
  });

  it('check that the read event fires when a file is read with open()', function () {
    editor.on('read', function () {
      eventFired = true;
    });

    editor.open(fooFile); // change the file (should fired create)
    editor.open(id); // this one should fire read

    expect(eventFired).to.be(true);
  });
});

