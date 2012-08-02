describe('#exportFile([fileName], [type])', function () {
  var testEl
    , id
    , contents
    , editor
    ;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , file: { defaultContent: '#foo\n\n##bar' }
      , container: testEl
      })

    editor.load(function () {
      done();
    })
  });

  after(function (done) {
    editor.unload(function () {
      done();
    });
  });

  it('should work without parameters by outputting the current file as raw text', function () {
    contents = editor.exportFile();
    expect(contents).to.match(/#foo\r?\n\r?\n##bar/);
  });

  it('should export the current file as HTML with a null parameter as it\'s first', function () {
    contents = editor.exportFile(null, 'html');
    expect(contents).to.be('<h1>foo</h1>\n<h2>bar</h2>\n');
  });

  it('should return undefined when a file doesn\'t exist', function () {
    contents = editor.exportFile('doesntExist' + rnd());
    expect(contents).to.be(undefined);
  });

  it('should be able to open non-currently open files', function () {
    var exportFileTest = 'exportFileTest' + rnd();
    editor.importFile(exportFileTest, 'hello world'); // import and open a file
    editor.open(id); // open the original again
    expect(editor.exportFile(exportFileTest)).to.be('hello world');
  });
});

