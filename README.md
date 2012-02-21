**alpha 0.0.1**

_Note: this is a developer preview. We're releasing early so we can get other people's input and pull requests. While it works, there are still bugs and missing features. Use at your own risk._

#EpicEditor 

##An Embeddable JavaScript Markdown Editor

EpicEditor is an embeddable JavaScript [Markdown](http://daringfireball.net/projects/markdown/) editor with some minor Markdown enhancements such as automatic link creation and code fencing.

###Why
WYSIWYGs suck and they suck hard. Markdown is quickly becoming the replacement. [GitHub](http://github.com), [Stackoverflow](http://stackoverflow.com), and even blogging apps like [Posterous](http://posterous.com) support Markdown now. This allows you to generate a Markdown editor with a preview, fullscreen editing, full CSS theming, and offline support with a simple:

```javascript
var editor = new EpicEditor(element).load();
```

###How

EpicEditor allows for all kinds of customization. For simple drop-in-and-go support see the quick start right below, otherwise checkout the full API.

####Quick Start
EpicEditor is easy to implement simply clone the repo and then it only needs an element to add the editor to and then you call `load()` when you're ready.

#####Step 1: Clone the repo

```javascript
$ git clone git@github.com:OscarGodson/EpicEditor
```

#####Step 2: Load the script

    <script src="epiceditor.js"></script>

#####Step 3: Init EpicEditor

```javascript
var element = document.getElementById('editor-wrapper');
var editor = new EpicEditor(element).load();
```

####API

**API Notes:**  
The constructor is first (`EpicEditor()`), but everything after are methods of that constructor. Any parameter inside wrapped in square brackets like `load([callback])` below means the parameter optional.

**Table of Contents:**

<ol>
  <li><a href="#api-epiceditor"><code>EpicEditor()</code></a></li>
  <li><a href="#api-load"><code>load()</code></a></li>
  <li><a href="#api-unload"><code>unload()</code></a></li>
  <li><a href="#api-options"><code>options()</code></a></li>
  <li><a href="#api-get"><code>get()</code></a></li>
  <li><a href="#api-open"><code>open()</code></a></li>
  <li><a href="#api-save"><code>save()</code></a></li>
  <li><a href="#api-on"><code>on()</code></a></li>
  <li><a href="#api-emit"><code>emit()</code></a></li>
  <li><a href="#api-removeListener"><code>removeListener()</code></a></li>
  <li><a href="#api-preview"><code>preview()</code></a></li>
  <li><a href="#api-edit"><code>edit()</code></a></li>
  <li><a href="#api-exportHTML"><code>exportHTML()</code></a></li>
</ol>

#####Constructor

<h6 id="api-epiceditor">EpicEditor(<em>element</em>)</h6>

Creates a new EpicEditor instance. Give it an element you want to insert the editor into

**Example:**

```javascript
var editor = new EpicEditor(element);
```

_Note:_ all the examples below will continue to use this same constructor.

#####Methods

<h6 id="api-load">load([<em>callback</em>])</h6>

Loads the editor by inserting it into the DOM by creating an `<iframe>`. Will trigger the `load` event, or you can use the callback instead

**Example:**

```javascript
editor.load();
```

<h6 id="api-unload">unload([<em>callback</em>])</h6>
Unloads the editor by removing the `<iframe>`, but will keep any options you set and file contents so you can easily call `.load()` again. Will trigger the `unload` event, or you can use the callback instead.

**Example:**

```javascript
editor.unload();
```

<h6 id="api-options">options(<em>options</em>)</h6>
Lets you set options for the editor. The example below has all the options available currently.


- `basePath`: The base path of the directory containing the `/themes`, `/images`, etc. It's `epiceditor` by default. _Don't add a trailing slash!_.

- `file.name`: If no file exists with this name a new one will be made, otherwise the existing will be opened.

- `file.defaultContent`: The content to show if no content exists for that file.

- `themes.editor`: The theme for the editor which is a textarea inside of an iframe.

- `themes.preview`: The theme for the previewer which is a div of content inside of an iframe.

- `focusOnLoad`: Will focus on the editor on load. It's `false</code> by default.`

**Example:**

```javascript
editor.options({
  file:{
    name:'example'
    defaultContent:'Write text in here!'
  },
  themes:{
    editor:'/css/epiceditor/editor-custom.css'
    preview:'/css/epiceditor/preview-custom.css'
  },
  focusOnLoad:true
}).load();
```

<h6 id="api-get">get(<em>element</em>)</h6>
Will grab an element of the editor for easy DOM manipulation inside of the editor.

- `'document'`: Returns the iframe element.
- `'body'`: Returns the iframe's inner `<body>` element.
- `'editor'`: Returns the editor which is a `<textarea>`.
- `'previewer'`: Returns the previewer element which is a `<div>`.

**Example:**

```javascript
someBtn.onclick = function(){
  console.log(ee.get('editor').value); //Would return the editor's content
}
```

<h6 id="api-open">open(<em>filename</em>)</h6>
Opens a file into the editor.

**Example:**

```javascript
openFileBtn.onclick = function(){
  ee.open('some-file'); //Open a file when the user clicks this button
}
```

<h6 id="api-save">save()</h6>
Manually save a file. EpicEditor will save on keyup by default but if you are inserting content via ajax for example, this is useful.

**Example:**

```javascript
saveFileBtn.onclick = function(){
  ee.save();
}
```

<h6 id="api-on">on(<em>event</em>,<em>handler</em>)</h6>
Sets up an event handler (callback) for a specified event. For all event types, see the <a href="#events">Events</a> section below.

**Example:**

```javascript
ee.on('unload',function(){
  console.log('Editor was removed');
});
```

<h6 id="api-emit">emit(<em>event</em>)</h6>
Sets off an event manually. Like jQuery's `.trigger()`

**Example:**

```javascript
ee.emit('unload'); //Would trigger the above handler
```

<h6 id="api-removeListener">removeListener(<em>event</em>,[<em>handler</em>])</h6>

Allows you to remove all listeners for an event, or just the specified one.

**Example:**

```javascript
ee.removeListener('unload'); //The handler above would no longer fire
```

<h6 id="api-preview">preview()</h6>
Will put the editor into preview mode.

**Example:**

```javascript
previewBtn.onclick = function(){
  ee.preview();
}
```

<h6 id="api-edit">edit()</h6>
Will put the editor into edit mode.

**Example:**

```javascript
editBtn.onclick = function(){
  ee.edit();
}
```

<h6 id="api-exportHTML">exportHTML()</h6>
Will return the generated HTML from the Markdown that you see in the preview mode. Useful to saving content to a database.

**Example:**

```javascript
syncWithServerBtn.onclick = function(){
  var theHTML = ee.exportHTML();
  saveToServerAjaxCall('/save',{data:theHTML},function(){
    console.log('data was saved to a db');
  });
}
```

<h5 id="events">Events</h5>

<h6 id="">load</h6>
Fires when the editor is loaded via `.load()`.

<h6 id="">unload</h6>
Fires when the editor is unloaded via `.unload()`.

<h6 id="">preview</h6>
Fires when the user clicks the preview button, or when `.preview()` is called.

<h6 id="">edit</h6>
Fires when the user clicks the edit button, or when `.edit()` is called.

<h6 id="">save</h6>
Fires when the file is saved automatically by EpicEditor, or when `.save()` is called.

<h6 id="">open</h6>
Fires when the file is opened on load automatically by EpicEditor, or when `.open()` is called.

####Theming

Theming involves two parts; each are optional. There is an `editor` and `preview` theme for each instance of an editor and these themes reside in `/themes/editor` and `/themes/preview`. The editor involves just a `<textarea>` and the `#utilbar` (the thing with the preview/edit andn fullscreen buttons). The preview is just a `<div>` with the generated HTML inside. All HTML for each editor is in an `<iframe>` so there is no need to worry about breaking the page you're embedding this on with similar class names or anything.

The HTML of a generated editor (excluding any content) looks like this:

```html
<div class="epiceditor-wrapper epiceditor-edit-mode">
  <div class="epiceditor-utilbar">
    <img width="16" src="epiceditor/images/preview.png" class="epiceditor-toggle-btn">
    <img width="16" src="epiceditor/images/fullscreen.png" class="epiceditor-fullscreen-btn">
  </div>
  <div class="epiceditor-editor">
    <textarea class="epiceditor-textarea"></textarea>
  </div>
  <div class="epiceditor-preview"></div>
</div>
```

###Who

[Oscar Godson](http://twitter.com/oscargodson) (me!), created EpicEditor with help from [Adam Bickford](http://twitter.com/adam_bickford). With many thanks to John Fraser (_site is no longer up_) for his [Showdown.js](https://github.com/coreyti/showdown) script and [John Gruber](http://daringfireball.net/) for [Markdown](http://daringfireball.net/projects/markdown/). Also, [Isaac Z. Schlueter](http://blog.izs.me) for his port of [GitHub Flavored Markdown](https://github.com/isaacs/github-flavored-markdown) which I [forked](https://github.com/oscargodson/github-flavored-markdown).</p>
</div>