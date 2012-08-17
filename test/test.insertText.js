/*global createContainer:false, removeContainer:false, rnd:false */

describe('.insertText(content)', function () {
  var testEl
    , id
    , contents
    , editor
    , type
    , getText
    , setSelectionRange
    , content = '# foo\n\n';

  before(function (done) {
    id = rnd();
    testEl = createContainer(id);
    editor = new EpicEditor(
      { basePath: '/epiceditor/'
      , file: { defaultContent: '' }
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

  // Grabs the text from an element and preserves whitespace
  getText = function (el) {
    var node
      , nodeType = el.nodeType
      , i = 0
      , text = '';

    // ELEMENT_NODE || DOCUMENT_NODE || DOCUMENT_FRAGMENT_NODE
    if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      if (typeof el.textContent === 'string') {
        return el.textContent;
      }
      else {
        // textContent can be null, in which case we walk the element tree
        for (el = el.firstChild; el; el = el.nextSibling) {
          text += getText(el);
        }
      }
    }
    else if (nodeType === 3 || nodeType === 4) {
      return el.nodeValue;
    }
    else {
      for (; (node = el[i]); i++) {
        text += getText(node);
      }
    }

    return text;
  };

  setSelectionRange = function (editor, ss, se) {
    var iframeDocument = editor.editorIframeDocument
        , body = iframeDocument.body
        , range = iframeDocument.createRange()
        , textNode = body.firstChild
        , text = getText(body)
        , textLength = text.length
        , selection;

    // Protected against IndexSizeError, which happens when ss or se is bigger
    // than the length of the text content
    ss = ss > textLength ? textLength : ss;
    se = se > textLength ? textLength : se;

    range.setStart(textNode, ss);
    range.setEnd(textNode, se);

    selection = editor.getSelection();

    // Our API strictly states that _getSelection can return null
    if (selection != null) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  it('should return the instance of EpicEditor', function () {
    expect(editor.insertText('')).to.be(editor);
  });

  it('should work insert correct content', function () {
    editor.insertText(content).save();
    contents = editor.exportFile();
    expect(contents).to.be(content);
  });

  it('should insert text at current caret position', function () {
    // Set the cursor to position 5
    setSelectionRange(editor, 5, 5);
    editor.insertText(content).save();

    contents = editor.exportFile();
    expect(contents).to.be('# foo' + content + '\n\n');
    //                      012345 <-- caret is here
  });

  it('should replace text if selection has range', function () {
    // Set the selection range to 0->5
    setSelectionRange(editor, 0, 5);
    editor.insertText('# bar').save();

    contents = editor.exportFile();
    expect(contents).to.be('# bar' + content + '\n\n');
  });

});

