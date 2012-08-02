describe('#unload([callback])', function () {
  var testEl
    , id
    , editor
    , eventWasCalled
    ;

  beforeEach(function (done) {
    id = rnd();
    testEl = createContainer(id)
    editor = new EpicEditor({ basePath: '/epiceditor/', container: testEl });
    editor.load();

    eventWasCalled = false;

    editor.on('unload', function () {
      eventWasCalled = true;
    });

    done();
  });

  afterEach(function (done) {
    editor.removeListener('unload');
    done();
  });

  it('check the editor was actually loaded first of all', function () {
    expect(document.getElementById(id).innerHTML).to.be.ok();
  });

  it('check that the unload event fires when the editor is unloaded', function () {
    editor.unload();
    expect(eventWasCalled).to.be(true);
  });

  it('check the editor was unloaded properly by checking if the editor HTML is gone from the original element', function () {
    editor.unload();
    expect(document.getElementById(id).innerHTML).to.not.be.ok();
  });

  it('check the editor\'s getElement method returns null for selected elements because they no longer exist', function () {
    editor.unload();
    expect(editor.getElement('editor')).to.not.be.ok();
  });

  it('check that unload can\'t be run twice', function () {
    editor.unload();
    expect(function () { editor.unload(); }).to.throwError('Editor isn\'t loaded');
  });

  it('check that unload and reloading and then requesting getElement doesn\'t return null as if it were unloaded', function () {
    editor.unload();
    editor.load();
    expect(editor.getElement('editor')).to.be.ok();
  });

});
