# ![EpicEditor](http://epiceditor.com/docs/images/epiceditor-logo.png)

## An Embeddable JavaScript Markdown Editor

EpicEditor is an embeddable JavaScript [Markdown](http://daringfireball.net/projects/markdown/) editor with split fullscreen editing, live previewing, automatic draft saving, offline support, and more. For developers, it offers a robust API, can be easily themed, and allows you to swap out the bundled Markdown parser with anything you throw at it.

## Why

Because, WYSIWYGs suck. Markdown is quickly becoming the replacement. [GitHub](http://github.com), [Stackoverflow](http://stackoverflow.com), and even blogging apps like [Posterous](http://posterous.com) are now supporting Markdown. EpicEditor allows you to create a Markdown editor with a single line of JavaScript:

```javascript
var editor = new EpicEditor().load();
```

## Quick Start

EpicEditor is easy to implement. Add the script and assets to your page, provide a target container and call `load()`.

### Step 1: Download

[Download the latest release](http://epiceditor.com) or clone the repo:

```bash
$ git clone git@github.com:OscarGodson/EpicEditor
```

### Step 2: Create your container element

```html
<div id="epiceditor"></div>
```

Alternately, wrap an existing textarea to load the contents into th EpicEditor instance.

```html
<div id="epiceditor"><textarea id="my-edit-area"></textarea></div>
```

### Step 3: Add the `epiceditor.js` file

```html
<script src="epiceditor.min.js"></script>
```

### Step 4: Init EpicEditor

```javascript
var editor = new EpicEditor().load();
```

## API

### EpicEditor([_options_])

The `EpicEditor` constructor creates a new editor instance. Customize the instance by passing the `options` parameter. The example below uses all options and their defaults:

```javascript
var opts = {
  container: 'epiceditor',
  textarea: null,
  basePath: 'epiceditor',
  clientSideStorage: true,
  localStorageName: 'epiceditor',
  useNativeFullscreen: true,
  parser: marked,
  file: {
    name: 'epiceditor',
    defaultContent: '',
    autoSave: 100
  },
  theme: {
    base: '/themes/base/epiceditor.css',
    preview: '/themes/preview/preview-dark.css',
    editor: '/themes/editor/epic-dark.css'
  },
  button: {
    preview: true,
    fullscreen: true,
    bar: "auto"
  },
  focusOnLoad: false,
  shortcut: {
    modifier: 18,
    fullscreen: 70,
    preview: 80
  },
  string: {
    togglePreview: 'Toggle Preview Mode',
    toggleEdit: 'Toggle Edit Mode',
    toggleFullscreen: 'Enter Fullscreen'
  },
  autogrow: false
}
var editor = new EpicEditor(opts);
```

### Options
<table cellspacing="0">
  <tr>
    <th>Option</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td><code>container</code></td>
    <td>The ID (string) or element (object) of the target container in which you want the editor to appear.</td>
    <td><code>epiceditor</code></td>
  </tr>
  <tr>
    <td><code>textarea</code></td>
    <td>The ID (string) or element (object) of a textarea you would like to sync the editor's content with. On page load if there is content in the textarea, the editor will use that as its content.</td>
    <td></td>
  </tr>
  <tr>
    <td><code>basePath</code></td>
    <td>The base path of the directory containing the <code>/themes</code>.</td>
    <td><code>epiceditor</code></td>
  </tr>
  <tr>
    <td><code>clientSideStorage</code></td>
    <td>Setting this to false will disable localStorage.</td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td><code>localStorageName</code></td>
    <td>The name to use for the localStorage object.</td>
    <td><code>epiceditor</code></td>
  </tr>
  <tr>
    <td><code>useNativeFullscreen</code></td>
    <td>Set to false to always use faux fullscreen (the same as what is used for unsupported browsers).</td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td><code>parser</code></td>
    <td>[Marked](https://github.com/chjj/marked) is the only parser built into EpicEditor, but you can customize or toggle this by passing a parsing function to this option. For example:<br><code>parser: MyCustomParser.parse</code></td>
    <td><code>marked</code></td>
  </tr>
  <tr>
    <td><code>focusOnLoad</code></td>
    <td>If <code>true</code>, editor will focus on load.</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td><code>file.name</code></td>
    <td>If no file exists with this name a new one will be made, otherwise the existing will be opened.</td>
    <td>container ID</td>
  </tr>
  <tr>
    <td><code>file.defaultContent</code></td>
    <td>The content to show if no content exists for a file. NOTE: if the <code>textarea</code> option is used, the textarea's value will take precedence over <code>defaultContent</code>.</td>
    <td></td>
  </tr>
  <tr>
    <td><code>file.autoSave</code></td>
    <td>How often to auto save the file in milliseconds. Set to <code>false</code> to turn it off.</td>
    <td><code>100</code></td>
  </tr>
  <tr>
    <td><code>theme.base</code></td>
    <td>The base styles such as the utility bar with the buttons.</td>
    <td><code>themes/base/epiceditor.css</code></td>
  </tr>
  <tr>
    <td><code>theme.editor</code></td>
    <td>The theme for the editor which is the area you type into.</td>
    <td><code>themes/editor/epic-dark.css</code></td>
  </tr>
  <tr>
    <td><code>theme.preview</code></td>
    <td>The theme for the previewer.</td>
    <td><code>themes/preview/github.css</code></td>
  </tr>
  <tr>
    <td><code>button</code></td>
    <td>If set to <code>false</code> will remove all buttons.</td>
    <td>All buttons set to <code>true</code>.</td>
  </tr>
  <tr>
    <td><code>button.preview</code></td>
    <td>If set to <code>false</code> will remove the preview button.</td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td><code>button.fullscreen</code></td>
    <td>If set to <code>false</code> will remove the fullscreen button.</td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td><code>button.bar</code></td>
    <td>If <code>true</code> or <code>"show"</code>, any defined buttons will always be visible. If <code>false</code> or <code>"hide"</code>, any defined buttons will never be visible. If <code>"auto"</code>, buttons will usually be hidden, but shown if whenever the mouse is moved.</td>
    <td><code>"auto"</code></td>
  </tr>
  <tr>
    <td><code>shortcut.modifier</code></td>
    <td>The key to hold while holding the other shortcut keys to trigger a key combo.</td>
    <td><code>18</code> (<code>alt</code> key)</td>
  </tr>
  <tr>
    <td><code>shortcut.fullscreen</code></td>
    <td>The shortcut to open fullscreen.</td>
    <td><code>70</code> (<code>f</code> key)</td>
  </tr>
  <tr>
    <td><code>shortcut.preview</code></td>
    <td>The shortcut to toggle the previewer.</td>
    <td><code>80</code> (<code>p</code> key)</td>
  </tr>
  <tr>
    <td><code>string.togglePreview</code></td>
    <td>The tooltip text that appears when hovering the preview icon.</td>
    <td><code>Toggle Preview Mode</code></td>
  </tr>
  <tr>
    <td><code>string.toggleEdit</code></td>
    <td>The tooltip text that appears when hovering the edit icon.</td>
    <td><code>Toggle Edit Mode</code></td>
  </tr>
  <tr>
    <td><code>string.toggleFullscreen</code></td>
    <td>The tooltip text that appears when hovering the fullscreen icon.</td>
    <td><code>Enter Fullscreen</code></td>
  </tr>
  <tr>
    <td><code>autogrow</code></td>
    <td>Whether to autogrow EpicEditor to fit its contents. If autogrow is desired one can either specify <code>true</code>, meaning to use default autogrow settings, or an object to define custom settings</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td><code>autogrow.minHeight</code></td>
    <td>The minimum height (in pixels) that the editor should ever shrink to. This may also take a function that returns the desired minHeight if this is not a constant, or a falsey value if no minimum is desired</td>
    <td><code>80</code></td>
  </tr>
  <tr>
    <td><code>autogrow.maxHeight</code></td>
    <td>The maximum height (in pixels) that the editor should ever grow to. This may also take a function that returns the desired maxHeight if this is not a constant, or a falsey value if no maximum is desired</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td><code>autogrow.scroll</code></td>
    <td>Whether the page should scroll to keep the caret in the same vertical place while autogrowing (recommended for mobile in particular)</td>
    <td><code>true</code></td>
  </tr>
</table>

### load([_callback_])

Loads the editor by inserting it into the DOM by creating an `iframe`. Will trigger the `load` event, or you can provide a callback.

```javascript
editor.load(function () {
  console.log("Editor loaded.")
});
```

### unload([_callback_])

Unloads the editor by removing the `iframe`. Keeps any options and file contents so you can easily call `.load()` again. Will trigger the `unload` event, or you can provide a callback.

```javascript
editor.unload(function () {
  console.log("Editor unloaded.")
});
```

### getElement(_element_)

Grabs an editor element for easy DOM manipulation. See the Themes section below for more on the layout of EpicEditor elements.

* `container`: The element given at setup in the options.
* `wrapper`: The wrapping `<div>` containing the 2 editor and previewer iframes.
* `wrapperIframe`: The iframe containing the `wrapper` element.
* `editor`: The #document of the editor iframe (i.e. you could do `editor.getElement('editor').body`).
* `editorIframe`: The iframe containing the `editor` element.
* `previewer`: The #document of the previewer iframe (i.e. you could do `editor.getElement('previewer').body`).
* `previewerIframe`: The iframe containing the `previewer` element.

```javascript
someBtn.onclick = function () {
  console.log(editor.getElement('editor').body.innerHTML); // Returns the editor's content
}
```

### is(_state_)

Returns a boolean for the requested state. Useful when you need to know if the editor is loaded yet for example. Below is a list of supported states:

* `loaded`
* `unloaded`
* `edit`
* `preview`
* `fullscreen`

```javascript
fullscreenBtn.onclick = function () {
  if (!editor.is('loaded')) { return; }
  editor.enterFullscreen();
}
```

### open(_filename_)

Opens a client side storage file into the editor.

**Note:** This does _not_ open files on your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
openFileBtn.onclick = function () {
  editor.open('some-file'); // Opens a file when the user clicks this button
}
```

### importFile([_filename_],[_content_])

Imports a string of content into a client side storage file. If the file already exists, it will be overwritten. Useful if you want to inject a bunch of content via AJAX. Will also run `.open()` after import automatically.

**Note:** This does _not_ import files on your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
importFileBtn.onclick = function () {
  editor.importFile('some-file',"#Imported markdown\nFancy, huh?"); //Imports a file when the user clicks this button
}
```

### exportFile([_filename_],[_type_])

Returns the plain text of the client side storage file, or if given a `type`, will return the content in the specified type. If you leave both parameters `null` it will return the current document's content in plain text. The supported export file types are:

**Note:** This does _not_ export files to your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

* text (default)
* html
* json (includes metadata)
* raw (warning: this is browser specific!)

```javascript
syncWithServerBtn.onclick = function () {
  var theContent = editor.exportFile();
  saveToServerAjaxCall('/save', {data:theContent}, function () {
    console.log('Data was saved to the database.');
  });
}
```

### rename(_oldName_, _newName_)

Renames a client side storage file.

**Note:** This does _not_ rename files on your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
renameFileBtn.onclick = function () {
  var newName = prompt('What do you want to rename this file to?');
  editor.rename('old-filename.md', newName); //Prompts a user and renames a file on button click
}
```

### save()

Manually saves a file to client side storage (localStorage by default). EpicEditor will save continuously every 100ms by default, but if you set `autoSave` in the options to `false` or to longer intervals it's useful to manually save.

**Note:** This does _not_ save files to your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
saveFileBtn.onclick = function () {
  editor.save();
}
```

### remove(_name_)

Deletes a client side storage file.

**Note:** This does _not_ remove files from your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
removeFileBtn.onclick = function () {
  editor.remove('example.md');
}
```

### getFiles([_name_], [_excludeContent_])

If no `name` is given it returns an object containing the names and metadata of all client side storage file objects. If a `name` is specified it will return just the metadata of that single file object. If `excludeContent` is true, it will remove the content from the returned object. This is useful when you just want a list of files or get some meta data. If `excludeContent` is false (default), it'll return a `content` property per file in plain text format.

**Note:** This does _not_ get files from your server or machine (yet). This simply looks in localStorage where EpicEditor stores drafts.

```javascript
var files = editor.getFiles();
for (x in files) {
  console.log('File: ' + x); //Returns the name of each file
};
```

### on(_event_, _handler_)

Sets up an event handler (callback) for a specified event. For all event types, see the Events section below.

```javascript
editor.on('unload', function () {
  console.log('Editor was removed');
});
```

### emit(_event_)

Fires an event programatically. Similar to jQuery's `.trigger()`

```javascript
editor.emit('unload'); // Triggers the handler provided in the "on" method above
```

### removeListener(_event_, [_handler_])

Allows you to remove all listeners for an event, or just the specified one.

```javascript
editor.removeListener('unload'); //The handler above would no longer fire
```

### preview()

Puts the editor into preview mode.

```javascript
previewBtn.onclick = function () {
  editor.preview();
}
```

### edit()

Puts the editor into edit mode.

```javascript
editBtn.onclick = function () {
  editor.edit();
}
```

### focus()

Puts focus on the editor or previewer (whichever is visible). Works just like
doing plain old JavaScript and input focus like `someInput.focus()`. The
benefit of using this method however, is that it handles cross browser issues
and also will focus on the visible view (edit or preview).

```
showEditorBtn.onclick = function () {
  editorWrapper.style.display = 'block'; // switch from being hidden from the user
  editor.focus(); // Focus and allow user to start editing right away
}
```

### enterFullscreen([callback])

Puts the editor into fullscreen mode. A callback will be fired after the entering fullscreen animation completes. Some browsers
will be nearly instant while others, mainly Chrome, take 750ms before this event is fired. If already in fullscreen, the
callback will fire immediately.

**Note:** due to browser security restrictions, calling `enterFullscreen` programmatically
like this will not trigger native fullscreen. Native fullscreen can only be triggered by a user interaction like mousedown or keyup.

```javascript
enterFullscreenBtn.onclick = function () {
  editor.enterFullscreen(function () {
    console.log('Welcome to fullscreen mode!');
  });
}
```
### exitFullscreen([callback])

Closes fullscreen mode. A callback will be fired after the exiting fullscreen animation completes. If already not in fullscreen, the
callback will fire immediately.


```javascript
exitFullscreenBtn.onclick = function () {
  editor.exitFullscreen(function () {
    console.log('Finished closing fullscreen!');
  });
}
```

### reflow([type], [callback])

`reflow()` allows you to "reflow" the editor in it's container. For example, let's say you increased
the height of your wrapping element and want the editor to resize too. You could call `reflow`
and the editor will resize to fit. You can pass it one of two strings as the first parameter to
constrain the reflow to either `width` or `height`.

It also provides you with a callback parameter if you'd like to do something after the resize is finished.
The callback will return the new width and/or height in an object. Additionally, you can also listen for
the `reflow` event. This will also give you back the new size.

**Note:** If you call `reflow()` or `reflow('width')` and you have a fluid width container
EpicEditor will no longer be fluid because doing a reflow on the width sets an inline style on the editor.

```javascript
// For an editor that takes up the whole browser window:
window.onresize = function () {
  editor.reflow();
}

// Constrain the reflow to just height:
someDiv.resizeHeightHandle = function () {
  editor.reflow('height');
}

// Same as the first example, but this has a callback
window.onresize = function () {
  editor.reflow(function (data) {
    console.log('width: ', data.width, ' ', 'height: ', data.height);
  });
}
```

## Events

You can hook into specific events in EpicEditor with <a href="#onevent-handler"><code>on()</code></a> such as when a file is
created, removed, or updated. Below is a complete list of currently supported events and their description.

<table cellspacing="0" class="event-table">
  <tr>
    <th>Event Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>create</code></td>
    <td>Fires whenever a new file is created.</td>
  </tr>
  <tr>
    <td><code>read</code></td>
    <td>Fires whenever a file is read.</td>
  </tr>
  <tr>
    <td><code>update</code></td>
    <td>Fires whenever a file is updated.</td>
  </tr>
  <tr>
    <td><code>remove</code></td>
    <td>Fires whenever a file is deleted.</td>
  </tr>
  <tr>
    <td><code>load</code></td>
    <td>Fires when the editor loads via <code>load()</code>.</td>
  </tr>
  <tr>
    <td><code>unload</code></td>
    <td>Fires whenever the editor is unloaded via <code>unload()</code></td>
  </tr>
  <tr>
    <td><code>preview</code></td>
    <td>Fires whenever the previewer is opened (excluding fullscreen) via <code>preview()</code> or the preview button.</td>
  </tr>
  <tr>
    <td><code>edit</code></td>
    <td>Fires whenever the editor is opened (excluding fullscreen) via <code>edit()</code> or the edit button.</td>
  </tr>
  <tr>
    <td><code>fullscreenenter</code></td>
    <td>Fires whenever the editor opens in fullscreen via <code>fullscreen()</code> or the fullscreen button.</td>
  </tr>
  <tr>
    <td><code>fullscreenexit</code></td>
    <td>Fires whenever the editor closes in fullscreen via <code>fullscreen()</code> or the fullscreen button.</td>
  </tr>
  <tr>
    <td><code>save</code></td>
    <td>Fires whenever <code>save()</code> is called manually, or implicitly by ```importFile``` or ```open```.</td>
  </tr>
  <tr>
    <td><code>autosave</code></td>
    <td>Fires whenever the autoSave interval fires, and the file contents have been updated since the last save.</td>
  </tr>
  <tr>
    <td><code>open</code></td>
    <td>Fires whenever a file is opened or loads automatically by EpicEditor or when <code>open()</code> is called.</td>
  </tr>
  <tr>
    <td><code>reflow</code></td>
    <td>Fires whenever <code>reflow()</code> is called. Will return the new dimensions in the callback. Will also fire every time there is a resize from autogrow.</td>
  </tr>
</table>

## Themes

Theming is easy in EpicEditor. There are three different `<iframe>`s which means styles wont leak between the "chrome" of
EpicEditor, previewer, or editor. Each one is like it's own web page. In the `themes` directory  you'll see `base`, `preview`,  and
`editor`. The base styles are for the "chrome" of the editor which contains elements such as the utility bar containing the icons.
The editor is the styles for the contents of editor `<iframe>` and the preview styles are applied to the preview `<iframe>`.

The HTML of a generated editor (excluding contents) looks like this:

```html
<div id="container">
  <iframe id="epiceditor-instance-id">
    <html>
      <head>
        <link type="text/css" id="" rel="stylesheet" href="epiceditor/themes/base/epiceditor.css" media="screen">
      </head>
      <body>
        <div id="epiceditor-wrapper">
          <iframe id="epiceditor-editor-frame">
            <html>
              <head>
                <link type="text/css" rel="stylesheet" href="epiceditor/themes/editor/epic-dark.css" media="screen">
              </head>
              <body contenteditable="true">
                <!-- raw content -->
              </body>
            </html>
          </iframe>
          <iframe id="epiceditor-previewer-frame">
            <html>
              <head>
                <link type="text/css" rel="stylesheet" href="epiceditor/themes/preview/github.css" media="screen">
              </head>
              <body>
                <div id="epiceditor-preview">
                  <!-- rendered html -->
                </div>
              </body>
            </html>
          </iframe>
          <div id="epiceditor-utilbar">
            <span title="Toggle Preview Mode" class="epiceditor-toggle-btn epiceditor-toggle-preview-btn"></span>
            <span title="Enter Fullscreen" class="epiceditor-fullscreen-btn"></span>
          </div>
        </div>
      </body>
    </html>
  </iframe>
</div>
```

## Custom Parsers

EpicEditor is set up to allow you to use any parser that accepts and returns a string. This means you can use any flavor of Markdown, process Textile, or even create a simple HTML editor/previewer (`parser: false`). The possibilities are endless. Just make the parser available and pass its parsing function to the EpicEditor setting and you should be all set. You can output plain text or HTML. Here's an example of a parser that could remove "bad words" from the preview:

```js
var editor = new EpicEditor({
  parser: function (str) {
    var blacklist = ['foo', 'bar', 'baz'];
    return str.split(' ').map(function (word) {
      // If the word exists, replace with asterisks
      if (blacklist.indexOf(word) > -1) {
        return '****'
      }
      return word;
    }).join(' ');
  }
}).load();
```

Here's a [Wiki to HTML](http://remysharp.com/2008/04/01/wiki-to-html-using-javascript/) parser by Remy Sharp used with EpicEditor:

```js
var editor = new EpicEditor({
  parser: function (str) {
    return str.wiki2html();
  }
}).load();
```

For even more customization and optimization you can replace the default built-in processor on build. Running `jake build parser=path/to/parser.js` will override the default Marked build and replace it with your custom script.

## Support

If you're having any problems with EpicEditor feel free to open a [new ticket](http://github.com/OscarGodson/EpicEditor/issues/new). Go ahead and ask us anything and we'll try to help however we can. You can also see if there's someone available at the #epiceditor IRC channel on irc.freenode.net. If you need a little more help with implementing EpicEditor on your site we've teamed up with [CodersClan](http://codersclan.net) to offer support:

<a href="http://codersclan.net/support/step1.php?repo_id=2"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

## Contributing

Contributions are greatly encouraged and appreciated. For more on ways to contribute please check the wiki: [Contributing Guide](https://github.com/OscarGodson/EpicEditor/wiki/Contributing).

## Credits

EpicEditor relies on [Marked](https://github.com/chjj/marked) to parse markdown and is brought to you in part by [Oscar Godson](http://twitter.com/oscargodson) and [John Donahue](http://twitter.com/johnmdonahue). Special thanks to [Adam Bickford](http://twitter.com/adam_bickford) for the bug fixes and being the QA for pull requests. Lastly, huge thanks to [Sebastian Nitu](http://twitter.com/sebnitu) for the amazing logo and doc styles.
