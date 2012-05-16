# ![](docs/images/epiceditor-logo.png)

## An Embeddable JavaScript Markdown Editor

EpicEditor is an embeddable JavaScript [Markdown](http://daringfireball.net/projects/markdown/) editor with some Markdown enhancements such as automatic link creation and code fencing a la [Github Flavored Markdown](http://github.github.com/github-flavored-markdown/). EpicEditor allows for all kinds of customization. For simple drop-in-and-go support see the quick start below, otherwise checkout the full API.


## Download

[EpicEditor v0.1.0](docs/downloads/EpicEditor-v0.1.0.zip)

## Why

WYSIWYGs suck and they suck hard. Markdown is quickly becoming the replacement. [GitHub](http://github.com), [Stackoverflow](http://stackoverflow.com), and even blogging apps like [Posterous](http://posterous.com) support Markdown now. EpicEditor allows you to create a Markdown editor with a preview, split fullscreen editing, full CSS theming, and offline support with one simple call:

```javascript
var editor = new EpicEditor().load();
```

## Quick Start

EpicEditor is easy to implement. Add the script and assets to your page, provide a target container and call `load()`.

### Step 1: Download

Grab the .zip in `docs/downloads` or clone the repo:

```bash
$ git clone git@github.com:OscarGodson/EpicEditor
```

### Step 2: Create your container element

```html
<div id="epiceditor"></div>
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
  basePath: 'epiceditor',
  localStorageName: 'epiceditor',
  file: {
    name: 'epiceditor',
    defaultContent: '',
    autoSave: 100
  },
  theme: {
    base:'/themes/base/epiceditor.css',
    preview:'/themes/preview/preview-dark.css',
    editor:'/themes/editor/epic-dark.css'
  },
  focusOnLoad: false,
  shortcut: {
    modifier: 18,
    fullscreen: 70,
    preview: 80,
    edit: 79
  }
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
    <td>`container`</td>
    <td>The ID (string) or element (object) of the target container in which you want the editor to appear.</td>
    <td>`epiceditor`</td>
  </tr>
  <tr>
    <td>`basePath`</td>
    <td>The base path of the directory containing the `/themes`, `/images`, etc.</td>
    <td>`epiceditor`</td>
  </tr>
  <tr>
    <td>`localStorageName`</td>
    <td>The name to use for the localStorage object.</td>
    <td>`epiceditor`</td>
  </tr>
  <tr>
    <td>`focusOnLoad`</td>
    <td>If `true`, editor will focus on load.</td>
    <td>`false`</td>
  </tr>
  <tr>
    <td>`file.name`</td>
    <td>If no file exists with this name a new one will be made, otherwise the existing will be opened.</td>
    <td>container ID</td>
  </tr>
  <tr>
    <td>`file.defaultContent`</td>
    <td>The content to show if no content exists for a file.</td>
    <td></td>
  </tr>
  <tr>
    <td>`file.autoSave`</td>
    <td>How often to auto save the file in milliseconds. Set to `false` to turn it off.</td>
    <td>`100`</td>
  </tr>
  <tr>
    <td>`theme.base`</td>
    <td>The base styles such as the utility bar with the buttons.</td>
    <td>`themes/base/epiceditor.css`</td>
  </tr>
  <tr>
    <td>`theme.editor`</td>
    <td>The theme for the editor which is the area you type into.</td>
    <td>`themes/editor/epic-dark.css`</td>
  </tr>
  <tr>
    <td>`theme.preview`</td>
    <td>The theme for the previewer.</td>
    <td>`themes/preview/github.css`</td>
  </tr>
  <tr>
    <td>`shortcut.modifier`</td>
    <td>The key to hold while holding the other shortcut keys to trigger a key combo.</td>
    <td>`18` (`alt` key)</td>
  </tr>
  <tr>
    <td>`shortcut.fullscreen`</td>
    <td>The shortcut to open fullscreen.</td>
    <td>`70` (`f` key)</td>
  </tr>
  <tr>
    <td>`shortcut.preview`</td>
    <td>The shortcut to open the previewer.</td>
    <td>`80` (`p` key)</td>
  </tr>
  <tr>
    <td>`shortcut.edit`</td>
    <td>The shortcut to open the editor.</td>
    <td>`79` (`o` key)</td>
  </tr>
</table>

### load([_callback_])

Loads the editor by inserting it into the DOM by creating an `iframe`. Will trigger the `load` event, or you can provide a callback.

```javascript
editor.load(function () { console.log("Editor loaded.") });
```

### unload([_callback_])

Unloads the editor by removing the `iframe`. Keeps any options and file contents so you can easily call `.load()` again. Will trigger the `unload` event, or you can provide a callback.

```javascript
editor.unload(function () { console.log("Editor unloaded.") });
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
someBtn.onclick = function(){
  console.log(editor.getElement('editor').body.innerHTML); // Returns the editor's content
}
```

### open(_filename_)

Opens a file into the editor.

```javascript
openFileBtn.onclick = function(){
  editor.open('some-file'); // Opens a file when the user clicks this button
}
```

### importFile([_filename_],[_content_])

Imports a string of content into a file. If the file already exists, it will be overwritten. Useful if you want to inject a bunch of content via AJAX. Will also run `.open()` after import automatically.

```javascript
importFileBtn.onclick = function(){
  editor.importFile('some-file',"#Imported markdown\nFancy, huh?"); //Imports a file when the user clicks this button
}
```

### exportFile([_filename_],[_type_])

Returns the raw content of the file by default, or if given a `type` will return the content converted into that type. If you leave both parameters `null` it will return the current document's raw content.

```javascript
syncWithServerBtn.onclick = function(){
  var theContent = editor.exportFile();
  saveToServerAjaxCall('/save', {data:theContent}, function () {
    console.log('Data was saved to the database.');
  });
}
```

### rename(_oldName_, _newName_)

Renames a file.

```javascript
renameFileBtn.onclick = function(){
  var newName = prompt('What do you want to rename this file to?');
  editor.rename('old-filename.md', newName); //Prompts a user and renames a file on button click
}
```

### save()

Manually saves a file. EpicEditor will save continuously every 100ms by default, but if you set `autoSave` in the options to `false` or to longer intervals it's useful to manually save.

```javascript
saveFileBtn.onclick = function(){
  editor.save();
}
```

### remove(_name_)

Deletes a file.

```javascript
removeFileBtn.onclick = function(){
  editor.remove('example.md');
}
```

### on(_event_, _handler_)

Sets up an event handler (callback) for a specified event. For all event types, see the Events section below.

```javascript
editor.on('unload',function(){
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
previewBtn.onclick = function(){
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

## Events

You can hook into specific events in EpicEditor with <a href="#onevent-handler"><code>on()</code></a> such as when a file is
created, removed, or updated. Below is a complete list of currently supported events and their description.

<table cellspacing="0" class="event-table">
  <tr>
    <th>Event Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>`create`</td>
    <td>Fires whenever a new file is created.</td>
  </tr>
  <tr>
    <td>`read`</td>
    <td>Fires whenever a file is read.</td>
  </tr>
  <tr>
    <td>`update`</td>
    <td>Fires whenever a file is updated.</td>
  </tr>
  <tr>
    <td>`remove`</td>
    <td>Fires whenever a file is deleted.</td>
  </tr>
  <tr>
    <td>`load`</td>
    <td>Fires when the editor loads via `load()`.</td>
  </tr>
  <tr>
    <td>`unload`</td>
    <td>Fires whenever the editor is unloaded via `unload()`</td>
  </tr>
  <tr>
    <td>`preview`</td>
    <td>Fires whenever the previewer is opened (excluding fullscreen) via `preview()` or the preview button.</td>
  </tr>
  <tr>
    <td>`edit`</td>
    <td>Fires whenever the editor is opened (excluding fullscreen) via `edit()` or the edit button.</td>
  </tr>
  <tr>
    <td>`save`</td>
    <td>Fires whenever the file is saved whether by EpicEditor automatically or when `save()` is called.</td>
  </tr>
  <tr>
    <td>`open`</td>
    <td>Fires whenever a file is opened or loads automatically by EpicEditor or when `open()` is called.</td>
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
            <img width="16" src="epiceditor/images/preview.png" class="epiceditor-toggle-btn">
            <img width="16" src="epiceditor/images/fullscreen.png" class="epiceditor-fullscreen-btn">
          </div>
        </div>
      </body>
    </html>
  </iframe>
</div>
```

## Contributing

Contributions are greatly encouraged and appreciated. For more on ways to contribute please check the wiki: [Contributing Guide](https://github.com/OscarGodson/EpicEditor/wiki/Contributing).

## Credits

EpicEditor relies on [Marked](https://github.com/chjj/marked) to parse markdown and is brought to you in part by [Oscar Godson](http://twitter.com/oscargodson) and [John Donahue](http://twitter.com/johnmdonahue). Special thanks to [Adam Bickford](http://twitter.com/adam_bickford) for the bug fixes and being the QA for pull requests. Lastly, huge thanks to [Sebastian Nitu](http://twitter.com/sebnitu) for the amazing logo and doc styles.

