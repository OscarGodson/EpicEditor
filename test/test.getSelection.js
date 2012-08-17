/*global createContainer:false, removeContainer:false, rnd:false */

describe('.getSelection()', function () {
  var testEl
    , id
    , selection
    , type
    , editor;

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , file: { defaultContent: '#foo\n\n##bar' }
      , container: testEl
      })

    editor.load();
    done();
  });

  after(function (done) {
    editor.unload();
    removeContainer(id);
    done();
  });

  it('should return same type as the host object Selection', function () {
    selection = editor.getSelection();
    type = Object.prototype.toString.call(selection);
    expect(type).to.match(/selection/i);
  });

});

