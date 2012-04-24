# ![](https://github.com/johnmdonahue/EpicEditor/raw/readme-build/images/epiceditor-logo.png)

EpicEditor is an embeddable JavaScript [Markdown](http://daringfireball.net/projects/markdown/) editor with some Markdown enhancements such as automatic link creation and code fencing a la [Github Flavored Markdown](). EpicEditor allows for all kinds of customization. For simple drop-in-and-go support see the quick start below, otherwise checkout the full API.

## Why

WYSIWYGs suck and they suck hard. Markdown is quickly becoming the replacement. [GitHub](http://github.com), [Stackoverflow](http://stackoverflow.com), and even blogging apps like [Posterous](http://posterous.com) support Markdown. EpicEditor allows you to create a Markdown editor with a preview, fullscreen editing, full CSS theming, and offline support with one simple call:

```javascript
var editor = new EpicEditor().load();
```

## Quick Start

EpicEditor is easy to implement. Add the script and assets to your page, provide a target container and call `load()`.

### Step 1: Download

```bash
$ git clone git@github.com:OscarGodson/EpicEditor
```

### Step 2: Position the target container and load the script

```html
<div id="epiceditor"></div>
<script src="epiceditor.min.js"></script>
```

### Step 3: Init EpicEditor

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
    defaultContent: ''
  },
  theme: {
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

* `container`: The ID of the target container element. By default it will look for an element with ID `epiceditor`.
* `basePath`: The base path of the directory containing the `/themes`, `/images`, etc. It's `epiceditor` by default. _Don't add a trailing slash!_
* `localStorageName`: The name to use for the localStorage object, set to `epiceditor` by default.
* `file`
  * `name`: If no file exists with this name a new one will be made, otherwise the existing will be opened.
  * `defaultContent`: The content to show if no content exists for that file.
* `theme`
  * `editor`: The theme for the editor which is a textarea inside of an iframe.
  * `preview`: The theme for the previewer which is a div of content inside of an iframe.
* `focusOnLoad`: Will focus on the editor on load. It's `false` by default.
* `shortcut`
  * `modifier`: The modifying key for shortcuts. It's `18` (the `alt` key) by default, to reduce default browser shortcut conflicts.
  * `fullscreen`: The fullscreen shortcut key. It's `70` (`f` key) by default.
  * `preview`: The preview shortcut key. It's `80` (`p` key) by default.
  * `edit`: The edit mode shortcut key. It's `79` (`o` key) by default.

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

### get(_element_)

Grabs an editor element for easy DOM manipulation. See the Themes section below for more on the layout of EpicEditor elements.

* `'container'`: The container element where the editor is injected
* `'wrapper'`: The div containing both the editor and preview iframes
* `'wrapperIframe'`: The iframe containing the wrapper element
* `'editor'`: The document object of the editor iframe (e.g. `editor.getElement('editor').body`)
* `'editorIframe'`: The iframe containing the editor element.
* `'previewerIframe'`: The iframe containing the previewer element
* `'previewer'`: The document object of the previewer iframe (e.g. `editor.getElement('previewer').body`)


```javascript
someBtn.onclick = function(){
  console.log(editor.get('editor').body.innerHTML); // Returns the editor's content
}
```

### open(_filename_)

Opens a file into the editor.

```javascript
openFileBtn.onclick = function(){
  editor.open('example.md'); // Opens "example.md" on click
}
```

### importFile([_filename_],[_content_])

Imports a string of content into a file. If the file already exists, it will be overwritten. Useful if you want to inject a bunch of content via AJAX. Will also run `.open()` after import automatically.

Imports a string of content into a file. If the file already exists, it will be overwritten. Useful if you want to inject a bunch of content via AJAX. Will also run .open() after import automatically.

```javascript
importFileBtn.onclick = function(){
  editor.importMarkdown('example.md', "# Imported markdown\nFancy, huh?"); //Imports a file when the user clicks this button
}
```

### exportFile(_filename_,[_type_])

Returns the raw content of the file by default, or given a type will return the content converted into that type. If you leave both parameters null it will return the current document's raw content.

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

Manually saves a file. EpicEditor will save on keyup by default but if you are inserting content via ajax for example, this is useful.

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

**load** - Fires when the editor is loaded via `.load()`.

**unload** - Fires when the editor is unloaded via `.unload()`.

**preview** - Fires when the user clicks the preview button, or when `.preview()` is called.

**edit** - Fires when the user clicks the edit button, or when `.edit()` is called.

**save** - Fires when the file is saved automatically by EpicEditor, or when `.save()` is called.

**open** - Fires when the file is opened on load automatically by EpicEditor, or when `.open()` is called.

## Themes

TODO: This needs to be updated with the 3 new frame layout -->

Theming involves two parts; each are optional. There is an `editor` and `preview` theme for each instance of an editor and these themes reside in `/themes/editor` and `/themes/preview`. The editor involves just a `textarea` and the `#utilbar` (the area containing the preview/edit and fullscreen buttons). The preview is just a `div` with the generated HTML inside. All HTML for each editor is in an `iframe` so there is no need to worry about breaking the page you're embedding on with similar class names or style conflicts.

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
            #document
            <html>
              <head>
                <link type="text/css" rel="stylesheet" href="epiceditor/themes/editor/epic-dark.css" media="screen">
              </head>
              <body contenteditable="true">
                <!-- markdown content -->
              </body>
            </html>
          </iframe>
          <iframe id="epiceditor-previewer-frame">
            #document
            <html>
              <head>
                <link type="text/css" rel="stylesheet" href="epiceditor/themes/preview/github.css" media="screen">
              </head>
              <body>
                <div class="epiceditor-preview">
                  <!-- rendered html -->
                </div>
              </body>
            </html>
          </iframe>
          <div class="epiceditor-utilbar">
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

<!-- @TODO: Update links to GFM, Marked etc -->

[Oscar Godson](http://twitter.com/oscargodson) (me!), created EpicEditor with help from [Adam Bickford](http://twitter.com/adam_bickford). With many thanks to John Fraser (_site is no longer up_) for his [Showdown.js](https://github.com/coreyti/showdown) script and [John Gruber](http://daringfireball.net/) for [Markdown](http://daringfireball.net/projects/markdown/). Also, [Isaac Z. Schlueter](http://blog.izs.me) for his port of [GitHub Flavored Markdown](https://github.com/isaacs/github-flavored-markdown) which I [forked](https://github.com/oscargodson/github-flavored-markdown).