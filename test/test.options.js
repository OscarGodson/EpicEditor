describe('EpicEditor([options])', function () {

  var editor
    , id
    , el

  beforeEach(function (done) {
    id = 'epic-' + rnd()
    el = createContainer(id)
    done()
  })

  afterEach(function (done) {
    editor.unload(function () {
      editor = null
      done()
    })
  })

  it('should accept a string with an element ID', function () {
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: id
      , file: { autoSave: false }
      }
    ).load()

    // Is this how we check for the editor
    expect(document.getElementById(id).getElementsByTagName('iframe').length).to.be(1)
  });

  it('should set the localStorage key when passed as a string', function () {
    editor = new EpicEditor({
      basePath: '/epiceditor/'
      , container: el
      , file: { autoSave: false }
    }).load()
    // TODO: is relying on JSON.parse going to be an issue
    expect(JSON.parse(localStorage.epiceditor)[id]).to.be.ok()
  });

  it('should accept a DOM element', function () {
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: el // create container returns the container
      , file: { autoSave: false }
    }).load();

    expect(document.getElementById(id).getElementsByTagName('iframe').length).to.be(1);
  });


  it('should set the localStorage key when passed as a DOM element', function () {
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: el
      , file: { autoSave: false }
      }
    ).load();
    expect(JSON.parse(localStorage.epiceditor)[el.id]).to.be.ok();
  });

 it('should set the localStorage key is correctly using the file name option', function () {
    var fileName = 'user-file-name-' + rnd();
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: el
      , file:
        { name: fileName
        , autoSave: false
        }
      }
    ).load();
    expect(JSON.parse(localStorage.epiceditor)[fileName]).to.be.ok();
  });

  it('should set the localStorage key when no fallback is available', function () {
    el.id = ''
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: el
      , file: { autoSave: false }
      }
    ).load();
    expect(JSON.parse(localStorage.epiceditor)['__epiceditor-untitled-1']).to.be.ok();
  });

  it('should not initialize localStorage when passed false', function () {
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: createContainer(id)
      , clientSideStorage: false
      , file: { autoSave: false }
      }
    ).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.be(undefined);
  });

  it('should initialize localStorage if passed true', function () {
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , container: createContainer(id)
      , clientSideStorage: true
      , file: { autoSave: false }
      }
    ).load();
    expect(JSON.parse(localStorage['epiceditor'])[id]).to.not.be(undefined);
  });

});

