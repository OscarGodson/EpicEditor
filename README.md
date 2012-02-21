#EpicEditor

##An Embeddable JavaScript Markdown Editor
EpicEditor is an embeddable JavaScript [Markdown](http://daringfireball.net/projects/markdown/) editor with some minor Markdown enhancements such as automatic link creation and code fencing.

##Why
WYSIWYGs suck and they suck hard. Markdown is quickly becoming the replacement. [GitHub](http://github.com), [Stackoverflow](http://stackoverflow.com), and even blogging apps like [Posterous](http://posterous) support Markdown now. This allows you to generate a Markdown editor with a preview, fullscreen editing, full CSS theming, and offline support with a simple:

```javascript
var editor = new EpicEditor(element).load();
```

##How
EpicEditor allows for all kinds of customization. For simple drop-in-and-go support see the quick start right below, otherwise checkout the full API.

###Quickstart

EpicEditor is easy to implement. It only needs an element to add the editor to and then you call `load()` when you're ready.

Example:  

```javascript
var element = document.getElementById('editor-wrapper');
var editor = new EpicEditor(element).load();
```


###API

**API Notes:**  
The contractor is first (`EpicEditor()`), but everything after are methods of that constructor. Any parameter inside wrapped in square brackets like `load([callback])` below means the parameter optional.

**Table of Contents:**

- EpicEditor()
- load()
- unload()
- options()
- get()
- open()
- save()
- on()
- emit()
- removeListener()
- preview()
- edit()
- exportHTML()

###EpicEditor(_element_)
Creates a new EpicEditor instance. Give it an element you want to insert the editor into.

Example:  

```javascript
var editor = new EpicEditor(element);
```

_Note: all the examples below will continue to use this same constructor._

###load(_[callback]_)
Loads the editor by inserting it into the DOM by creating an `<iframe>`. Will trigger the load event, or you can use the callback instead.

Example:  

```javascript
editor.load();
```

###unload([_callback_])
Unloads the editor by removing the `<iframe>`, but will keep any options you set and file contents so you can easily call `.load()` again. Will trigger the unload event, or you can use the callback instead.

Example:  

```javascript
editor.unload();
```

###options(_options_)
Lets you set options for the editor. The example below has all the options available currently.

- `file.name`: If no file exists with this name a new one will be made, otherwise the existing will be opened.
- `file.defaultContent`: The content to show if no content exists for that file.
- `themes.editor`: The theme for the editor which is a textarea inside of an iframe.
- `themes.preview`: The theme for the previewer which is a div of content inside of an iframe.
- `focusOnLoad`: Will focus on the editor on load. It's false by default.

Example:  

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

###get(_element_)
Will grab an element of the editor for easy DOM manipulation inside of the editor.

- `'document'`: Returns the iframe element.
- `'body'`: Returns the `<iframe>`'s inner `<body>` element.
- `'editor'`: Returns the editor which is a `<textarea>`.
- `'previewer'`: Returns the previewer element which is a `<div>`.

Example:  

```javascript
someBtn.onclick = function(){
  console.log(ee.get('editor').value); //Would return the editor's content
}
```

###open(_filename_)
Opens a file into the editor.

Example:  

```javascript
openFileBtn.onclick = function(){
  ee.open('some-file'); //Open a file when the user clicks this button
}
```

###save()
Manually save a file. EpicEditor will save on keyup by default but if you 
are inserting content via ajax for example, this is useful.

Example:  

```javascript
saveFileBtn.onclick = function(){
  ee.save();
}
```

###on(_event_,_handler_)
Sets up an event handler (callback) for a specified event. For all event types, see the Events section below.

Example:  

```javascript
ee.on('unload',function(){
  console.log('Editor was removed');
});
```

###emit(_event_)
Sets off an event manually. Like jQuery's `.trigger()`

Example:  

```javascript
ee.emit('unload'); //Would trigger the above handler
```

###removeListener(_event_,[_handler_])
Allows you to remove all listeners for an event (if you leave the `handler` param blank), or just the specified one.

Example:  

```javascript
ee.removeListener('unload'); //The handler above would no longer fire
```

###preview()
Will put the editor into preview mode.

Example:  

```javascript
previewBtn.onclick = function(){
  ee.preview();
}
```


###edit()
Will put the editor into edit mode.

Example:  

```javascript
editBtn.onclick = function(){
  ee.edit();
}
```

###exportHTML()
Will return the generated HTML from the Markdown that you see in the preview mode. Useful to saving content to a database.

Example:  

```javascript
syncWithServerBtn.onclick = function(){
  var theHTML = ee.exportHTML();
  saveToServerAjaxCall('/save',{data:theHTML},function(){
    console.log('data was saved to a db');
  });
}
```

###Events

###load
Fires when the editor is loaded via `.load()`.

###unload
Fires when the editor is unloaded via `.unload()`.

###preview
Fires when the user clicks the preview button, or when `.preview()` is called.

###edit
Fires when the user clicks the edit button, or when `.edit()` is called.

###save
Fires when the file is saved automatically by EpicEditor, or when `.save()` is called.

###open
Fires when the file is opened on load automatically by EpicEditor, or when `.open()` is called.

##Using Markdown

For a quick cheat sheet see: [http://warpedvisions.org/projects/markdown-cheat-sheet/](http://warpedvisions.org/projects/markdown-cheat-sheet/)

###EpicEditor Flavored Markdown

EpicEditor does some markdown differently to make it just that much more awesome.

- Auto linking: If you type a URL like "http://google.com" EpicEditor will automatically make that a link
- Code fencing: If you have a block of code you can use code fencing (see GitHub's examples here under "_Fenced code blocks_": [http://github.github.com/github-flavored-markdown/](http://github.github.com/github-flavored-markdown/)). Also, you can add a language like they show under "_Syntax highlighting_".

##Who

[Oscar Godson](http://twitter.com/oscargodson) (me!), created EpicEditor with the help of [Adam Bickford](http://twitter.com/adam_bickford). With many thanks to John Fraser (site is no longer up) for his [Showdown.js](https://github.com/coreyti/showdown) script and [John Gruber](http://daringfireball.net/) for [Markdown](http://daringfireball.net/projects/markdown/). Also, [Isaac Z. Schlueter](http://blog.izs.me/) for his port of [GitHub Flavored Markdown](https://github.com/isaacs/github-flavored-markdown) which I [forked](https://github.com/oscargodson/github-flavored-markdown).