(function (window, undefined) {

  /**
   * Applies attributes to a DOM object
   * @param  {object} context The DOM obj you want to apply the attributes to
   * @param  {object} attrs A key/value pair of attributes you want to apply
   * @returns {undefined}
   */
  function _applyAttrs(context, attrs) {
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        context[attr] = attrs[attr];
      }
    }
  }

  /**
   * Applies styles to a DOM object
   * @param  {object} context The DOM obj you want to apply the attributes to
   * @param  {object} attrs A key/value pair of attributes you want to apply
   * @returns {undefined}
   */
  function _applyStyles(context, attrs) {
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        context.style[attr] = attrs[attr];
      }
    }
  }

  /**
   * Returns a DOM objects computed style
   * @param  {object} el The element you want to get the style from
   * @param  {string} styleProp The property you want to get from the element
   * @returns {string} Returns a string of the value. If property is not set it will return a blank string
   */
  function _getStyle(el, styleProp) {
    var x = el
      , y = null

    if (window.getComputedStyle) {
      y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    }
    else if (x.currentStyle) {
      y = x.currentStyle[styleProp];
    }
    return y;
  }

  /**
   * Gets an elements total width including it's borders and padding
   * @param  {object} el The element to get the total width of
   * @returns {int}
   */
  function _outerWidth(el) {
    var b = parseInt(_getStyle(el, 'border-left-width'), 10) + parseInt(_getStyle(el, 'border-right-width'), 10)
      , p = parseInt(_getStyle(el, 'padding-left'), 10) + parseInt(_getStyle(el, 'padding-right'), 10)
      , w = el.offsetWidth
      , t

    //For IE in case no border is set and it defaults to "medium"
    if (isNaN(b)) { b = 0; }
    t = b + p + w;
    return t;
  }

  /**
   * Gets an elements total height including it's borders and padding
   * @param  {object} el The element to get the total width of
   * @returns {int}
   */
  function _outerHeight(el) {
    var b = parseInt(_getStyle(el, 'border-top-width'), 10) + parseInt(_getStyle(el, 'border-bottom-width'), 10)
      , p = parseInt(_getStyle(el, 'padding-top'), 10) + parseInt(_getStyle(el, 'padding-bottom'), 10)
      , w = el.offsetHeight
      , t

    //For IE in case no border is set and it defaults to "medium"
    if (isNaN(b)) { b = 0; }
    t = b + p + w;
    return t;
  }

  /**
   * Inserts a <link> tag specifically for CSS
   * @param  {string} path The path to the CSS file
   * @param  {object} context In what context you want to apply this to (document, iframe, etc)
   * @param  {string} id An id for you to reference later for changing properties of the <link>
   * @returns {undefined}
   */
  function _insertCSSLink(path, context, id) {
    var headID = context.getElementsByTagName("head")[0]
      , cssNode = context.createElement('link')
    
    id = id || '';
    
    _applyAttrs(cssNode, {
      type: 'text/css'
    , id: id
    , rel: 'stylesheet'
    , href: path + '?' + new Date().getTime()
    , name: path
    , media: 'screen'
    });

    headID.appendChild(cssNode);
  }

  //Simply replaces a class (o), to a new class (n) on an element provided (e)
  function _replaceClass(e, o, n) {
    e.className = e.className.replace(o, n);
  }

  /**
   * Will return the version number if the browser is IE. If not will return -1
   * TRY NEVER TO USE THIS AND USE FEATURE DETECTION IF POSSIBLE
   * @returns {Number} -1 if false or the version number if true
   */
  function _isIE() {
    var rv = -1 // Return value assumes failure.
      , ua
      , re

    if (navigator.appName === 'Microsoft Internet Explorer') {
      ua = navigator.userAgent;
      re = /MSIE ([0-9]{1,}[\.0-9]{0,})/;
      if (re.exec(ua) != null) {
        rv = parseFloat(RegExp.$1, 10);
      }
    }
    return rv;
  }

  /**
   * Determines if supplied value is a function
   * @param {object} object to determine type
   */
  function _isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * @param {boolean} [deepMerge=false] If true, will deep merge meaning it will merge sub-objects like {obj:obj2{foo:'bar'}}
   * @param {object} first object
   * @param {object} second object
   * @returnss {object} a new object based on obj1 and obj2
   */
  function _mergeObjs() {
    // copy reference to target object
    var target = arguments[0] || {}
      , i = 1
      , length = arguments.length
      , deep = false
      , options
      , name
      , src
      , copy

    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !_isFunction(target)) {
      target = {};
    }
    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          // @NOTE: added hasOwnProperty check
          if (options.hasOwnProperty(name)) {
            src = target[name];
            copy = options[name];
            // Prevent never-ending loop
            if (target === copy) {
              continue;
            }
            // Recurse if we're merging object values
            if (deep && copy && typeof copy === "object" && !copy.nodeType) {
              target[name] = _mergeObjs(deep,
                // Never move original objects, clone them
                src || (copy.length != null ? [] : {})
                , copy);
            } else if (copy !== undefined) { // Don't bring in undefined values
              target[name] = copy;
            }
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  /**
   * Initiates the EpicEditor object and sets up offline storage as well
   * @class Represents an EpicEditor instance
   * @param {object} options An optional customization object
   * @returns {object} EpicEditor will be returned
   */
  function EpicEditor(options) {
    //Default settings will be overwritten/extended by options arg
    var opts = options || {}
      , defaults = { container: 'epiceditor'
        , basePath: 'epiceditor'
        , localStorageName: 'epiceditor'
        , file: { name: opts.container || 'epiceditor' //Use the container's ID for an unique persistent file name - will be overwritten if passed a file.name opt
          , defaultContent: ''
          , autoSave: 100 //Set to false for no auto saving
          }
        , theme: { preview: '/themes/preview/github.css'
          , editor: '/themes/editor/epic-dark.css'
          }
        , focusOnLoad: false
        , shortcut: { modifier: 18 // alt keycode
          , fullscreen: 70 // f keycode
          , preview: 80 // p keycode
          , edit: 79 // o keycode
          }
        }
      , defaultStorage

    this.settings = _mergeObjs(true, defaults, opts);

    // Protect the id and overwrite if passed in as an option
    // TODO: Consider moving this off of the settings object to something like this.instanceId or this.iframeId
    this.settings.id = 'epiceditor-' + Math.round(Math.random() * 100000);

    //Setup local storage of files
    if (localStorage) {
      if (!localStorage[this.settings.localStorageName]) {
        //TODO: Needs a dynamic file name!
        defaultStorage = {files: {}};
        defaultStorage.files[this.settings.file.name] = this.settings.file.defaultContent;
        defaultStorage = JSON.stringify(defaultStorage);
        localStorage[this.settings.localStorageName] = defaultStorage;
      } else if (!JSON.parse(localStorage[this.settings.localStorageName]).files[this.settings.file.name]) {
        JSON.parse(localStorage[this.settings.localStorageName]).files[this.settings.file.name] = this.settings.file.defaultContent;
      } else {
        this.content = this.settings.file.defaultContent;
      }
    }
    //Now that it exists, allow binding of events if it doesn't exist yet
    if (!this.events) {
      this.events = {};
    }
    this.element = document.getElementById(this.settings.container);
    return this;
  }

  /**
   * Inserts the EpicEditor into the DOM via an iframe and gets it ready for editing and previewing
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.load = function (callback) {
    var self = this
      , iframeElement
      , _HtmlTemplate
      , widthDiff
      , heightDiff
      , iframeBody

    callback = callback || function () {};

    //This needs to replace the use of classes to check the state of EE
    self.eeState = {
      fullscreen: false
    , preview: false
    , edit: true
    }

    //The editor HTML
    //TODO: edit-mode class should be dynamicly added!
    _HtmlTemplate = '<div class="epiceditor-wrapper epiceditor-edit-mode">' +
                      '<div class="epiceditor-utilbar">' +
                        '<img width="16" src="' + this.settings.basePath + '/images/preview.png" class="epiceditor-toggle-btn"> ' +
                        '<img width="16" src="' + this.settings.basePath + '/images/fullscreen.png" class="epiceditor-fullscreen-btn">' +
                      '</div>' +
                      '<div class="epiceditor-editor">' +
                        '<textarea class="epiceditor-textarea"></textarea>' +
                      '</div>' +
                      '<div class="epiceditor-preview"></div>' +
                    '</div>';

    //Write an iframe and then select it for the editor
    this.element.innerHTML = '<iframe scrolling="no" frameborder="0" id= "' + self.settings.id + '"></iframe>';
    iframeElement = document.getElementById(self.settings.id);

    // Store a reference to the iframeElement itself
    self.iframeElement = iframeElement;

    //Grab the innards of the iframe (returns the document.body)
    self.iframe = iframeElement.contentDocument || iframeElement.contentWindow.document;
    self.iframe.open();
    self.iframe.write(_HtmlTemplate);

    //Set the default styles for the iframe
    widthDiff = _outerWidth(this.element) - this.element.offsetWidth;
    heightDiff = _outerHeight(this.element) - this.element.offsetHeight;

    iframeElement.style.width  = this.element.offsetWidth - widthDiff + 'px';
    iframeElement.style.height = this.element.offsetHeight - heightDiff + 'px';
    
    //Remove the default browser CSS body styles, then add base CSS styles for the editor
    iframeBody = self.iframe.body;
    iframeBody.style.padding = '0';
    iframeBody.style.margin = '0';
    _insertCSSLink(self.settings.basePath + self.settings.theme.editor, self.iframe);
    
    //Add a relative style to the overall wrapper to keep CSS relative to the editor
    self.iframe.getElementsByClassName('epiceditor-wrapper')[0].style.position = 'relative';

    //Now grab the editor and previewer for later use
    this.editor = self.iframe.getElementsByClassName('epiceditor-textarea')[0];
    this.previewer = self.iframe.getElementsByClassName('epiceditor-preview')[0];
    
    //Firefox's <body> gets all fucked up so, to be sure, we need to hardcode it
    self.iframe.body.style.height = this.element.offsetHeight + 'px';

    //Generate the width
    this.editor.style.width  = '100%';
    this.editor.style.height = this.element.offsetHeight + 'px';

    //Should actually check what mode it's in!
    this.previewer.style.display = 'none';
    this.previewer.style.overflow = 'auto';

    //Fit the preview window into the container
    //FIXME Should be in theme!
    this.previewer.style['padding'] = '10px';
    this.previewer.style.width  = this.element.offsetWidth - _outerWidth(this.previewer) - widthDiff + 'px';
    this.previewer.style.height = this.element.offsetHeight - _outerHeight(this.previewer) - heightDiff + 'px';

    //FIXME figure out why it needs +2 px
    if (_isIE() > -1) {
      this.previewer.style.height = parseInt(_getStyle(this.previewer, 'height'), 10) + 2;
    }

    //Preload the preview theme:
    _insertCSSLink(self.settings.basePath + self.settings.theme.preview, self.iframe, 'theme');

    //If there is a file to be opened with that filename and it has content...
    this.open(self.settings.file.name);

    if (this.settings.focusOnLoad) {
      this.editor.focus();
    }

    //Sets up the onclick event on the previewer/editor toggle button
    self.iframe.getElementsByClassName('epiceditor-toggle-btn')[0].addEventListener('click', function () {
      //If it was in edit mode...
      if (self.eeState.edit) {
        self.preview();
      } else { //If it was in preview mode...
        self.edit();
      }
    });

    var utilBtns = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];

    // @NOTE: comment console.log
    // console.log(_getStyle(self.editor,'width'));
    var _saveStyleState = function (el, type, styles) {
      var returnState = {}
        , style

      if (type === 'save') {
        for (style in styles) {
          if (styles.hasOwnProperty(style)) {
            // @NOTE: comment console.log
            // if (el == self.editor && style == 'width') { console.log(_getStyle(el, style), window.innerWidth); }
            returnState[style] = _getStyle(el, style);
          }
        }
        //After it's all done saving all the previous states, change the styles
        _applyStyles(el, styles);
      } else if (type === 'apply') {
        _applyStyles(el, styles);
      }
      return returnState;
    }

    var _elementStates = {};
    var _goFullscreen = function (el) {
      var nativeFs = el.webkitRequestFullScreen ? true : false;

      //Set the state of EE in fullscreen
      //We set edit and preview to true also because they're visible
      //we might want to allow fullscreen edit mode without preview (like a "zen" mode)
      self.eeState.fullscreen = true;
      self.eeState.edit = true;
      self.eeState.preview = true;

      //Cache calculations
      var windowInnerWidth = window.innerWidth
        , windowInnerHeight = window.innerHeight
        , windowOuterWidth = window.outerWidth
        , windowOuterHeight = window.outerHeight

      //Setup the containing element CSS for fullscreen
      _elementStates.element = _saveStyleState(self.element, 'save', {
        'position': 'fixed'
      , 'top': '0'
      , 'left': '0'
      , 'width': '100%'
      , 'z-index': '9999' //Most browsers
      , 'zIndex': '9999' //Firefox
      , 'border': 'none'
      , 'background': _getStyle(self.editor, 'background-color') //Try to hide the site below
      , 'height': windowInnerHeight + 'px'
      });

      //The iframe element
      _elementStates.iframeElement = _saveStyleState(self.iframeElement, 'save', {
        'width': windowInnerWidth + 'px'
      , 'height': windowInnerHeight + 'px'
      });

      //...the editor...
      _elementStates.editor = _saveStyleState(self.editor, 'save', {
        'width': windowOuterWidth / 2 + 'px'
      , 'height': windowOuterHeight + 'px'
      , 'float': 'left' //Most browsers
      , 'cssFloat': 'left' //FF
      , 'styleFloat': 'left' //Older IEs
      , 'display': 'block'
      });

      //...and finally, the previewer
      _elementStates.previewer = _saveStyleState(self.previewer, 'save', {
        'width': (windowOuterWidth - _outerWidth(self.editor)) + 'px'
      , 'height': windowOuterHeight + 'px'
      , 'float': 'right' //Most browsers
      , 'cssFloat': 'right' //FF
      , 'styleFloat': 'right' //Older IEs
      , 'display': 'block'
      });

      // console.log(_elementStates.element,_elementStates.iframeElement,_elementStates.editor,_elementStates.previewer);

      //...Oh, and hide the buttons and prevent scrolling
      utilBtns.style.visibility = 'hidden';

      if (!nativeFs) {
        document.body.style.overflow = 'hidden';
      } else {
        // console.log('Native Fullscreen');
        el.webkitRequestFullScreen();
      }

      self.preview(true);
      self.editor.addEventListener('keyup', function () { self.preview(true); });
    };

    var _exitFullscreen = function (el) {
      var nativeFs = el.webkitRequestFullScreen ? true : false;
      _saveStyleState(self.element, 'apply', _elementStates.element);
      _saveStyleState(self.iframeElement, 'apply', _elementStates.iframeElement);
      _saveStyleState(self.editor, 'apply', _elementStates.editor);
      _saveStyleState(self.previewer, 'apply', _elementStates.previewer);
      utilBtns.style.visibility = 'hidden';
      if (!nativeFs) {
        document.body.style.overflow = 'auto';
      }
    };

    var fsElement = document.getElementById(self.settings.id);

    //Sets up the NATIVE fullscreen editor/previewer for WebKit
    if (document.body.webkitRequestFullScreen) {
      self.iframe.getElementsByClassName('epiceditor-fullscreen-btn')[0].addEventListener('click', function () {
        // @NOTE: This does not seem to be used
        if (_getStyle(self.previewer, 'display') === 'block') {
          var revertBackTo = self.previewer;
        }
        _goFullscreen(fsElement);
      });

      fsElement.addEventListener('webkitfullscreenchange', function () {
        if (document.webkitIsFullScreen) {
          //_goFullscreen(fsElement);
        } else {
          _exitFullscreen(fsElement);
        }
      }, false);
    }

    var utilBar = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];
    
    //Hide it at first until they move their mouse
    utilBar.style.display = 'none';

    //Hide and show the util bar based on mouse movements
    var utilBarTimer
      , mousePos = { y: -1, x: -1 }
      
    this.iframe.addEventListener('mousemove', function (e) {
      //Here we check if the mouse has moves more than 5px in any direction before triggering the mousemove code
      //we do this for 2 reasons:
      //1. On Mac OS X lion when you scroll and it does the iOS like "jump" when it hits the top/bottom of the page itll fire off
      //   a mousemove of a few pixels depending on how hard you scroll
      //2. We give a slight buffer to the user in case he barely touches his touchpad or mouse and not trigger the UI
      if (Math.abs(mousePos.y - e.pageY) >= 5 || Math.abs(mousePos.x - e.pageX) >= 5) {
        utilBar.style.display = 'block';
        // if we have a timer already running, kill it out
        if (utilBarTimer) {
          clearTimeout(utilBarTimer);
        }
        // begin a new timer that hides our object after 1000 ms
        utilBarTimer = window.setTimeout(function () {
          utilBar.style.display = 'none';
        }, 1000);
      }
      mousePos = { y: e.pageY, x: e.pageX };
    });

    //Save the document every 100ms by default
    if (self.settings.file.autoSave) {
      var saveTimer = window.setInterval(function () {
        self.content = this.value;
        self.save(self.settings.file.name, this.value);
      }, self.settings.file.autoSave);
    }

    //Add keyboard shortcuts for convenience.
    var isMod = false;
    var isCtrl = false;
    self.iframe.addEventListener('keyup', function (e) {
      if (e.keyCode === self.settings.shortcut.modifier) { isMod = false }
      if (e.keyCode === 17) { isCtrl = false }
    });
    self.iframe.addEventListener('keydown', function (e) {
      if (e.keyCode === self.settings.shortcut.modifier) { isMod = true } //check for modifier press(default is alt key), save to var
      if (e.keyCode === 17) { isCtrl = true } //check for ctrl/cmnd press, in order to catch ctrl/cmnd + s

      //Check for alt+p and make sure were not in fullscreen - default shortcut to switch to preview
      if (isMod === true && e.keyCode === self.settings.shortcut.preview && !self.eeState.fullscreen) {
        e.preventDefault();
        self.preview();
      }
      //Check for alt+o - default shortcut to switch back to the editor
      if (isMod === true && e.keyCode === self.settings.shortcut.edit) {
        e.preventDefault();
        if (!self.eeState.fullscreen) {
          self.edit();
        }
      }
      //Check for alt+f - default shortcut to make editor fullscreen
      if (isMod === true && e.keyCode === self.settings.shortcut.fullscreen) {
        e.preventDefault();
        _goFullscreen(fsElement);
      }

      //When a user presses "esc", revert everything!
      if (e.keyCode === 27 && self.eeState.fullscreen) {
        if (!document.body.webkitRequestFullScreen) {
          _exitFullscreen(fsElement);
        }
      }

      //Check for ctrl/cmnd + s (since a lot of people do it out of habit) and make it do nothing
      if (isCtrl === true && e.keyCode === 83) {
        e.preventDefault();
      }
    });

    window.addEventListener('resize', function () {
      var widthDiff = _outerWidth(self.element) - self.element.offsetWidth;
      iframeElement.style.width  = self.element.offsetWidth - widthDiff + 'px';

      if (self.eeState.fullscreen) {
        _applyStyles(self.previewer, {
          'width': (window.outerWidth - _outerWidth(self.editor)) + 'px'
        , 'height': window.outerHeight + 'px'
        });

        _applyStyles(self.editor, {
          'width': window.outerWidth / 2 + 'px'
        , 'height': window.outerHeight + 'px'
        });

        _applyStyles(self.iframeElement, {
          'width': window.innerWidth + 'px'
        , 'height': window.innerHeight + 'px'
        });
      }
    });

    self.iframe.close();
    //The callback and call are the same thing, but different ways to access them
    callback.call(this);
    this.emit('load');
    return this;
  }

  /**
   * Will remove the editor, but not offline files
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.unload = function (callback) {
    var self = this
      , editor = window.parent.document.getElementById(self.settings.id)

    editor.parentNode.removeChild(editor);
    callback = callback || function () {};
    
    callback.call(this);
    self.emit('unload');
    return self;
  }

  /**
   * Will take the markdown and generate a preview view based on the theme
   * @param {string} theme The path to the theme you want to preview in
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.preview = function (theme, live) {
    var self = this
      , themePath = self.settings.basePath + self.settings.theme.preview

    if (typeof theme === 'boolean') {
      live = theme;
      theme = themePath
    } else {
      theme = theme || themePath
    }

    _replaceClass(self.get('wrapper'), 'epiceditor-edit-mode', 'epiceditor-preview-mode');
    self.eeState.preview = true;
    self.eeState.edit = false;

    //Check if no CSS theme link exists
    if (!self.iframe.getElementById('theme')) {
      _insertCSSLink(theme, self.iframe, 'theme');
    } else if (self.iframe.getElementById('theme').name !== theme) {
      self.iframe.getElementById('theme').href = theme;
    }
    
    //Add the generated HTML into the previewer
    this.previewer.innerHTML = this.exportHTML();
    
    //Hide the editor and display the previewer
    if (!live) {
      this.editor.style.display = 'none';
      this.previewer.style.display = 'block';
    }

    self.emit('preview');
    return this;
  }

  /**
   * Hides the preview and shows the editor again
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.edit = function () {
    var self = this;
    _replaceClass(self.get('wrapper'), 'epiceditor-preview-mode', 'epiceditor-edit-mode');
    self.eeState.preview = false;
    self.eeState.edit = true;
    this.editor.style.display = 'block';
    this.previewer.style.display = 'none';
    self.emit('edit');
    return this;
  }

  /**
   * Grabs a specificed HTML node. Use it as a shortcut to getting the iframe contents
   * @param   {String} name The name of the node (can be document, body, editor, previewer, or wrapper)
   * @returns {Object|Null}
   */
  EpicEditor.prototype.get = function (name) {
    var available = { document: this.iframe
        , body: this.iframe.body
        , editor: this.editor
        , previewer: this.previewer
        , wrapper: this.iframe.getElementsByClassName('epiceditor-wrapper')[0]
        }

    if (!available[name]) {
      return null;
    } else {
      return available[name];
    }
  }

  /**
   * Opens a file
   * @param   {string} name The name of the file you want to open
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.open = function (name) {
    var self = this
      , fileObj

    name = name || self.settings.file.name;
    if (localStorage && localStorage[self.settings.localStorageName]) {
      fileObj = JSON.parse(localStorage[self.settings.localStorageName]).files;
      if (fileObj[name]) {
        self.editor.value = fileObj[name];
      } else {
        self.editor.value = this.settings.file.defaultContent;
      }
      self.settings.file.name = name;
      this.previewer.innerHTML = this.exportHTML();
      this.emit('open');
    }
    return this;
  }

  /**
   * Saves content for offline use
   * @param  {string} file A filename for the content to be saved to
   * @param  {string} content The content you want saved
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.save = function (file, content) {
    var self = this
      , s

    file = file || self.settings.file.name;
    content = content || this.editor.value;
    s = JSON.parse(localStorage[self.settings.localStorageName]);
    s.files[file] = content;
    localStorage[self.settings.localStorageName] = JSON.stringify(s);
    this.emit('save');
    return this;
  }

  /**
   * Removes a page
   * @param   {string} name The name of the file you want to remove from localStorage
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.remove = function (name) {
    var self = this
      , s

    name = name || self.settings.file.name;
    s = JSON.parse(localStorage[self.settings.localStorageName]);
    delete s.files[name];
    localStorage[self.settings.localStorageName] = JSON.stringify(s);
    this.emit('remove');
    return this;
  };


  /**
   * Imports a MD file instead of having to manual inject content via
   * .get(editor).value = 'the content'
   * @param   {string} name    The name of the file
   * @param   {string} content The MD to import
   * @returns {object} EpicEditor will be returned
   */
  
  //********* @NOTE: Import is reserved
  EpicEditor.prototype.importMarkdown = function (name, content) {
    var self = this;
    
    content = content || '';
    self.open(name).get('editor').value = content;
    //we reopen the file after saving so that it will preview correctly if in the previewer
    self.save().open(name);
    return this;
  };

  /**
   * Renames a file
   * @param   {string} oldName The old file name
   * @param   {string} newName The new file name
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.rename = function (oldName, newName) {
    var self = this
      , s = JSON.parse(localStorage[self.settings.localStorageName])

    s.files[newName] = s.files[oldName];
    delete s.files[oldName];
    localStorage[self.settings.localStorageName] = JSON.stringify(s);
    self.open(newName);
    return this;
  };

  /**
   * Converts content into HTML from markdown
   * @returns {string} Returns the HTML that was converted from the markdown
   */
  EpicEditor.prototype.exportHTML = function () {
    return marked(this.editor.value);
  }

  //EVENTS
  //TODO: Support for namespacing events like "preview.foo"
  /**
   * Sets up an event handler for a specified event
   * @param  {string} ev The event name
   * @param  {function} handler The callback to run when the event fires
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.on = function (ev, handler) {
    var self = this;

    if (!this.events[ev]) {
      this.events[ev] = [];
    }
    this.events[ev].push(handler);
    return self;
  };

  /**
   * This will emit or "trigger" an event specified
   * @param  {string} ev The event name
   * @param  {any} data Any data you want to pass into the callback
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.emit = function (ev, data) {
    var self = this;

    if (!this.events[ev]) {
      return;
    }
    //TODO: Cross browser support!
    function invokeHandler(handler) {
      handler.call(self.iframe, data);
    }
    this.events[ev].forEach(invokeHandler);
    return self;
  };

  /**
   * Will remove any listeners added from EpicEditor.on()
   * @param  {string} ev The event name
   * @param  {function} handler Handler to remove
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.removeListener = function (ev, handler) {
    var self = this;

    if (!handler) {
      this.events[ev] = [];
      return self;
    }
    if (!this.events[ev]) {
      return self;
    }
    //Otherwise a handler and event exist, so take care of it
    this._events[ev].splice(this._events[ev].indexOf(handler), 1);
    return self;
  }

  window.EpicEditor = EpicEditor;
})(window);
