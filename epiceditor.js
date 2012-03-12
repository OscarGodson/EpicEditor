/**
 * Copyright (c) 2011 Oscar Godson http://oscargodson.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function(window, undefined){

  /**
   * showdown.js -- A javascript port of Markdown.
   * Copyright (c) 2007 John Fraser.
   * Original Markdown Copyright (c) 2004-2005 John Gruber
   * Redistributable under a BSD-style open source license.
   */  
  var Showdown={};"object"===typeof exports&&(Showdown=exports,Showdown.parse=function(h,i){return(new Showdown.converter).makeHtml(h,i)});var GitHub;
  Showdown.converter=function(){var h,i,o,p=0;this.makeHtml=function(a,c){"undefined"!==typeof c&&("string"===typeof c&&(c={nameWithOwner:c}),GitHub=c);h=[];i=[];o=[];a=a.replace(/~/g,"~T");a=a.replace(/\$/g,"~D");a=a.replace(/\r\n/g,"\n");a=a.replace(/\r/g,"\n");a="\n\n"+a+"\n\n";a=v(a);a=a.replace(/^[ \t]+$/mg,"");a=w(a);a=C(a);a=q(a);a=x(a);a=a.replace(/~D/g,"$$");a=a.replace(/~T/g,"~");a=a.replace(/https?\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!]/g,function(b,c){var d=a.slice(0,c),f=a.slice(c);return d.match(/<[^>]+$/)&&
  f.match(/^[^>]*>/)?b:"<a target='blank' href='"+b+"'>"+b+"</a>"});a=a.replace(/[a-z0-9_\-+=.]+@[a-z0-9\-]+(\.[a-z0-9-]+)+/ig,function(a){return"<a href='mailto:"+a+"'>"+a+"</a>"});a=a.replace(/[a-f0-9]{40}/ig,function(b,c){if("undefined"==typeof GitHub||"undefined"==typeof GitHub.nameWithOwner)return b;var d=a.slice(0,c),f=a.slice(c);return d.match(/@$/)||d.match(/<[^>]+$/)&&f.match(/^[^>]*>/)?b:"<a target='blank' href='http://github.com/"+GitHub.nameWithOwner+"/commit/"+b+"'>"+b.substring(0,7)+"</a>"});
  a=a.replace(/([a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(b,c,d,f){if("undefined"==typeof GitHub||"undefined"==typeof GitHub.nameWithOwner)return b;GitHub.repoName=GitHub.repoName||GitHub.nameWithOwner.match(/^.+\/(.+)$/)[1];var j=a.slice(0,f),f=a.slice(f);return j.match(/\/$/)||j.match(/<[^>]+$/)&&f.match(/^[^>]*>/)?b:"<a target='blank' href='http://github.com/"+c+"/"+GitHub.repoName+"/commit/"+d+"'>"+c+"@"+d.substring(0,7)+"</a>"});a=a.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,
  function(a,c,d){return"<a target='blank' href='http://github.com/"+c+"/commit/"+d+"'>"+c+"@"+d.substring(0,7)+"</a>"});a=a.replace(/#([0-9]+)/ig,function(b,c,d){if("undefined"==typeof GitHub||"undefined"==typeof GitHub.nameWithOwner)return b;var f=a.slice(0,d),d=a.slice(d);return""==f||f.match(/[a-z0-9_\-+=.]$/)||f.match(/<[^>]+$/)&&d.match(/^[^>]*>/)?b:"<a target='blank' href='http://github.com/"+GitHub.nameWithOwner+"/issues/#issue/"+c+"'>"+b+"</a>"});a=a.replace(/([a-z0-9_\-+=.]+)#([0-9]+)/ig,
  function(b,c,d,f){if("undefined"==typeof GitHub||"undefined"==typeof GitHub.nameWithOwner)return b;GitHub.repoName=GitHub.repoName||GitHub.nameWithOwner.match(/^.+\/(.+)$/)[1];var j=a.slice(0,f),f=a.slice(f);return j.match(/\/$/)||j.match(/<[^>]+$/)&&f.match(/^[^>]*>/)?b:"<a target='blank' href='http://github.com/"+c+"/"+GitHub.repoName+"/issues/#issue/"+d+"'>"+b+"</a>"});return a=a.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,c,d){return"<a target='blank' href='http://github.com/"+
  c+"/issues/#issue/"+d+"'>"+a+"</a>"})};var C=function(a){return a=a.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(a,b,e,d,f){b=b.toLowerCase();h[b]=y(e);if(d)return d+f;f&&(i[b]=f.replace(/"/g,"&quot;"));return""})},w=function(a){a=a.replace(/\n/g,"\n\n");a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,m);a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,
  m);a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,m);a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,m);a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,m);return a=a.replace(/\n\n/g,"\n")},m=function(a,c){var b;b=c.replace(/\n\n/g,"\n");b=b.replace(/^\n/,"");b=b.replace(/\n+$/g,"");return b="\n\n~K"+(o.push(b)-1)+"K\n\n"},q=function(a){for(var a=D(a),c=k("<hr />"),a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,c),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,
  c),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,c),a=z(a),a=E(a),a=F(a),a=G(a),a=w(a),a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,""),b=a.split(/\n{2,}/g),a=[],c=b.length,e=0;e<c;e++){var d=b[e];0<=d.search(/~K(\d+)K/g)?a.push(d):0<=d.search(/\S/)&&(d=n(d),d=d.replace(/\n/g,"<br />"),d=d.replace(/^([ \t]*)/g,"<p>"),d+="</p>",a.push(d))}c=a.length;for(e=0;e<c;e++)for(;0<=a[e].search(/~K(\d+)K/);)b=o[RegExp.$1],b=b.replace(/\$/g,"$$$$"),a[e]=a[e].replace(/~K\d+K/,b);return a=a.join("\n\n")},n=function(a){a=
  H(a);a=I(a);a=a.replace(/\\(\\)/g,r);a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,r);a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,A);a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,A);a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,s);a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,s);a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,s);a=J(a);a=y(a);a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
  "<strong>$2</strong>");a=a.replace(/(\w)_(\w)/g,"$1~E95E$2");a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");return a=a.replace(/  +\n/g," <br />\n")},I=function(a){return a=a.replace(/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi,function(a){a=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return a=l(a,"\\`*_")})},s=function(a,c,b,e,d,f,j,g){void 0==g&&(g="");a=e.toLowerCase();if(""==d)if(""==a&&(a=b.toLowerCase().replace(/ ?\n/g," ")),void 0!=h[a])d=h[a],void 0!=i[a]&&(g=i[a]);else if(-1<
  c.search(/\(\s*\)$/m))d="";else return c;d=l(d,"*_");c="<a target='blank' href=\""+d+'"';""!=g&&(g=g.replace(/"/g,"&quot;"),g=l(g,"*_"),c+=' title="'+g+'"');return c+(">"+b+"</a>")},A=function(a,c,b,e,d,f,j,g){a=b;e=e.toLowerCase();g||(g="");if(""==d)if(""==e&&(e=a.toLowerCase().replace(/ ?\n/g," ")),void 0!=h[e])d=h[e],void 0!=i[e]&&(g=i[e]);else return c;a=a.replace(/"/g,"&quot;");d=l(d,"*_");c='<img src="'+d+'" alt="'+a+'"';g=g.replace(/"/g,"&quot;");g=l(g,"*_");return c+(' title="'+g+'"')+" />"},
  D=function(a){a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,b){return k("<h1>"+n(b)+"</h1>")});a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,b){return k("<h2>"+n(b)+"</h2>")});return a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,b,e){a=b.length;return k("<h"+a+">"+n(e)+"</h"+a+">")})},t,z=function(a){var a=a+"~0",c=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;p?a=a.replace(c,function(a,c,d){a=c;d=-1<d.search(/[*+-]/g)?"ul":
  "ol";a=a.replace(/\n{2,}/g,"\n\n\n");a=t(a);a=a.replace(/\s+$/,"");return"<"+d+">"+a+"</"+d+">\n"}):(c=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(c,function(a,c,d,f){a=d;f=-1<f.search(/[*+-]/g)?"ul":"ol";a=a.replace(/\n{2,}/g,"\n\n\n");a=t(a);return c+"<"+f+">\n"+a+"</"+f+">\n"}));return a=a.replace(/~0/,"")};t=function(a){p++;a=a.replace(/\n{2,}$/,"\n");a=(a+"~0").replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
  function(a,b,e,d,f){a=f;b||-1<a.search(/\n{2,}/)?a=q(u(a)):(a=z(u(a)),a=a.replace(/\n$/,""),a=n(a));return"<li>"+a+"</li>\n"});a=a.replace(/~0/g,"");p--;return a};var F=function(a){a=(a+"~0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,e){a=B(u(b));a=v(a);a=a.replace(/^\n+/g,"");a=a.replace(/\n+$/g,"");return k("<pre><code>"+a+"\n</code></pre>")+e});return a=a.replace(/~0/,"")},E=function(a){return a=a.replace(/`{3}(?:(.*$)\n)?([\s\S]*?)`{3}/gm,function(a,
  b,e){return'<div class="highlight"><pre lang="'+b+'">'+e+"</pre></div>"})},k=function(a){a=a.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(o.push(a)-1)+"K\n\n"},H=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,e,d){a=d.replace(/^([ \t]*)/g,"");a=a.replace(/[ \t]*$/g,"");a=B(a);return b+"<code>"+a+"</code>"})},B=function(a){a=a.replace(/&/g,"&amp;");a=a.replace(/</g,"&lt;");a=a.replace(/>/g,"&gt;");return a=l(a,"*_{}[]\\",!1)},G=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
  function(a,b){var e;e=b.replace(/^[ \t]*>[ \t]?/gm,"~0");e=e.replace(/~0/g,"");e=e.replace(/^[ \t]+$/gm,"");e=q(e);e=e.replace(/(^|\n)/g,"$1  ");e=e.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c;c=b.replace(/^  /mg,"~0");return c=c.replace(/~0/g,"")});return k("<blockquote>\n"+e+"\n</blockquote>")})},y=function(a){a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");return a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;")},J=function(a){a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a target='blank' href=\"$1\">$1</a>");
  return a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return K(x(b))})},K=function(a){var c=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){a=a.charCodeAt(0);return"&#x"+("0123456789ABCDEF".charAt(a>>4)+"0123456789ABCDEF".charAt(a&15))+";"},function(a){return a}],a=("mailto:"+a).replace(/./g,function(a){if("@"==a)a=c[Math.floor(2*Math.random())](a);else if(":"!=a)var e=Math.random(),a=0.9<e?c[2](a):0.45<e?c[1](a):c[0](a);return a});return a=("<a target='blank' href=\""+
  a+'">'+a+"</a>").replace(/">.+:/g,'">')},x=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var e=parseInt(b);return String.fromCharCode(e)})},u=function(a){a=a.replace(/^(\t|[ ]{1,4})/gm,"~0");return a=a.replace(/~0/g,"")},v=function(a){a=a.replace(/\t(?=\t)/g,"    ");a=a.replace(/\t/g,"~A~B");a=a.replace(/~B(.+?)~A/g,function(a,b){for(var e=b,d=4-e.length%4,f=0;f<d;f++)e+=" ";return e});a=a.replace(/~A/g,"    ");return a=a.replace(/~B/g,"")},l=function(a,c,b){c="(["+c.replace(/([\[\]\\])/g,
  "\\$1")+"])";b&&(c="\\\\"+c);return a=a.replace(RegExp(c,"g"),r)},r=function(a,c){return"~E"+c.charCodeAt(0)+"E"}};

  //Fullscreen API wrapper ( http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/ )
  //TODO: Need a new wrapper with support for W3C spec
  (function(){var a={supportsFullScreen:!1,isFullScreen:function(){return!1},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",prefix:""},c="webkit moz o ms khtml".split(" ");if("undefined"!=typeof document.cancelFullScreen)a.supportsFullScreen=!0;else for(var b=0,d=c.length;b<d;b++)if(a.prefix=c[b],"undefined"!=typeof document[a.prefix+"CancelFullScreen"]){a.supportsFullScreen=!0;break}if(a.supportsFullScreen)a.fullScreenEventName=a.prefix+"fullscreenchange",a.isFullScreen=
  function(){switch(this.prefix){case "":return document.fullScreen;case "webkit":return document.webkitIsFullScreen;default:return document[this.prefix+"FullScreen"]}},a.requestFullScreen=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},a.cancelFullScreen=function(){return""===this.prefix?document.cancelFullScreen():document[this.prefix+"CancelFullScreen"]()};if("undefined"!=typeof jQuery)jQuery.fn.requestFullScreen=function(){return this.each(function(){a.supportsFullScreen&&
  a.requestFullScreen(this)})};window.fullScreenApi=a})();

  /**
   * Applies attributes to a DOM object
   * @param  {object} context The DOM obj you want to apply the attributes to
   * @param  {object} attrs A key/value pair of attributes you want to apply
   * @returns {undefined}
   */
  function _applyAttrs(context,attrs){
    for(var attr in attrs){
       if(attrs.hasOwnProperty(attr)) {
        context[attr] = attrs[attr];
      }
    }
  }

  /**
   * Returns a DOM objects computed style
   * @param  {object} el The element you want to get the style from
   * @param  {string} styleProp The property you want to get from the element
   * @returns {string} Returns a string of the value. If property is not set it will return a blank string
   */
  function _getStyle(el,styleProp){
    var x = el,
      y = null;
      
    if (window.getComputedStyle) {
      y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp); 
    } else if (x.currentStyle) {
      y = x.currentStyle[styleProp];
    }

    return y;
  }

  /**
   * Gets an elements total width including it's borders and padding
   * @param  {object} el The element to get the total width of
   * @returns {int}
   */
  function _outerWidth(el){
    var b = parseInt(_getStyle(el,'border-left-width'), 10)+parseInt(_getStyle(el,'border-right-width'), 10)
    ,   p = parseInt(_getStyle(el,'padding-left'), 10)+parseInt(_getStyle(el,'padding-right'), 10)
    ,   w = el.offsetWidth
    //For IE in case no border is set and it defaults to "medium"
    if(isNaN(b)){ b = 0; }
    var t = b+p+w;
    return t;
  }

  /**
   * Gets an elements total height including it's borders and padding
   * @param  {object} el The element to get the total width of
   * @returns {int}
   */
  function _outerHeight(el){
    var b = parseInt(_getStyle(el,'border-top-width'), 10)+parseInt(_getStyle(el,'border-bottom-width'), 10)
    ,   p = parseInt(_getStyle(el,'padding-top'), 10)+parseInt(_getStyle(el,'padding-bottom'), 10)
    ,   w = el.offsetHeight
    //For IE in case no border is set and it defaults to "medium"
    if(isNaN(b)){ b = 0; }
    var t = b+p+w;
    return t;
  }

  /**
   * Inserts a <link> tag specifically for CSS
   * @param  {string} path The path to the CSS file
   * @param  {object} context In what context you want to apply this to (document, iframe, etc)
   * @param  {string} id An id for you to reference later for changing properties of the <link>
   * @returns {undefined}
   */
  function _insertCSSLink(path,context,id){
    id = id || '';
    var headID = context.getElementsByTagName("head")[0];
    var cssNode = context.createElement('link');
    
    _applyAttrs(cssNode,{
      type:'text/css'
    , id:id
    , rel:'stylesheet'
    , href: path+'?'+new Date().getTime()
    , name: path
    , media: 'screen'
    });

    headID.appendChild(cssNode);
  }

  //Simply replaces a class (o), to a new class (n) on an element provided (e)
  function _replaceClass(e, o, n){
    e.className = e.className.replace(o, n);
  }

  /**
   * Will return the version number if the browser is IE. If not will return -1
   * TRY NEVER TO USE THIS AND USE FEATURE DETECTION IF POSSIBLE
   * @returns {Number} -1 if false or the version number if true
   */
  function _isIE(){
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer'){
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1, 10 );
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
  function _mergeObjs(){
    // copy reference to target object
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

    // Handle a deep copy situation
    if (typeof target === "boolean"){
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !_isFunction(target)){
      target = {};
    }
    // extend jQuery itself if only one argument is passed
    if (length == i){
      target = this;
      --i;
    }

    for ( ; i < length; i++ ){
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ){
        // Extend the base object
        for ( var name in options ) {
          var src = target[ name ], copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ){
            continue;
          }
          // Recurse if we're merging object values
          if ( deep && copy && typeof copy === "object" && !copy.nodeType ){
            target[ name ] = _mergeObjs( deep, 
            // Never move original objects, clone them
            src || ( copy.length != null ? [ ] : { } )
          , copy );
          }
          // Don't bring in undefined values
          else if ( copy !== undefined ){
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  /**
   * Initiates the EpicEditor object and sets up offline storage as well
   * @class Represents an EpicEditor instance
   * @param {object} e A DOM object for the editor to be placed in
   * @returns {object} EpicEditor will be returned
   */
  function EpicEditor(e){
    var uId = 'epiceditor-'+Math.round(Math.random()*100000)
    ,   fileName = e.id;

    //TODO: Check for data-filename as well
    if(!fileName){ //If there is no id on the element to use, just use "default"
      fileName = 'default';
    }

    //Default settings (will be overwritten if .options() is called with parameters)
    this.settings = {
      basePath:'epiceditor'
    , themes: {
        preview:'/themes/preview/preview-dark.css'
      , editor:'/themes/editor/epic-dark.css'
      }
    , file: {
        name:fileName //Use the DOM element's ID for an unique persistent file name
      , defaultContent:''
      }
      //Because there might be multiple editors, we create a random id
    , id:uId
    , focusOnLoad:false
    , shortcuts: { 
        modifier: 18 // alt keycode
      , fullscreen: 70 // f keycode
      , preview: 80 // p keycode
      , edit: 79 // o keycode
      }
    };

    //Setup local storage of files
    if(localStorage){
      if(!localStorage['epiceditor']){
        //TODO: Needs a dynamic file name!
        var defaultStorage = {files:{}};
        defaultStorage.files[this.settings.file.name] = this.settings.file.defaultContent;
        defaultStorage = JSON.stringify(defaultStorage);
        localStorage['epiceditor'] = defaultStorage;
      }
      else if(!JSON.parse(localStorage['epiceditor']).files[this.settings.file.name]){
        JSON.parse(localStorage['epiceditor']).files[this.settings.file.name] = this.settings.file.defaultContent;
      }
      else{
        this.content = this.settings.file.defaultContent;
      }
    }
    //Now that it exists, allow binding of events if it doesn't exist yet
    if(!this.events){
      this.events = {}; 
    }
    this.element = e;
    return this;
  }

  /**
   * Changes default options such as theme, id, etc for the EpicEditor instance
   * @param  {object} options A key/value pair of options you want to change from the default
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.options = function(options){
    var self = this;
    self.settings = _mergeObjs(true, this.settings, options);
    return self;
  }

  /**
   * Inserts the EpicEditor into the DOM via an iframe and gets it ready for editing and previewing
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.load = function(callback){
    var self = this;

    callback = callback || function(){};

  //The editor HTML
  //TODO: edit-mode class should be dynamicly added!
  var _HtmlTemplate = '<div class="epiceditor-wrapper epiceditor-edit-mode">'+
                        '<div class="epiceditor-utilbar">'+
                          '<img width="16" src="'+this.settings.basePath+'/images/preview.png" class="epiceditor-toggle-btn"> '+
                          '<img width="16" src="'+this.settings.basePath+'/images/fullscreen.png" class="epiceditor-fullscreen-btn">'+
                        '</div>'+
                        '<div class="epiceditor-editor">'+
                          '<textarea class="epiceditor-textarea"></textarea>'+
                        '</div>'+
                        '<div class="epiceditor-preview"></div>'+
                      '</div>';

    //Write an iframe and then select it for the editor
    this.element.innerHTML = '<iframe scrolling="no" frameborder="0" id= "'+self.settings.id+'"></iframe>';
    var iframeElement = document.getElementById(self.settings.id);

    //Grab the innards of the iframe (returns the document.body)
    self.iframe = iframeElement.contentDocument || iframeElement.contentWindow.document;
    self.iframe.open();
    self.iframe.write(_HtmlTemplate);

    //Set the default styles for the iframe

    var widthDiff = _outerWidth(this.element) - this.element.offsetWidth;
    var heightDiff = _outerHeight(this.element) - this.element.offsetHeight;

    iframeElement.style.width  = this.element.offsetWidth - widthDiff +'px';
    iframeElement.style.height = this.element.offsetHeight - heightDiff +'px';
    
    //Remove the default browser CSS body styles, then add base CSS styles for the editor
    var iframeBody = self.iframe.body;
    iframeBody.style.padding = '0';
    iframeBody.style.margin = '0';
    _insertCSSLink(self.settings.basePath+self.settings.themes.editor,self.iframe);
    
    //Add a relative style to the overall wrapper to keep CSS relative to the editor
    self.iframe.getElementsByClassName('epiceditor-wrapper')[0].style.position = 'relative';

    //Now grab the editor and previewer for later use
    this.editor = self.iframe.getElementsByClassName('epiceditor-textarea')[0];
    this.previewer = self.iframe.getElementsByClassName('epiceditor-preview')[0];
    
    //Firefox's <body> gets all fucked up so, to be sure, we need to hardcode it
    self.iframe.body.style.height = this.element.offsetHeight+'px';

    //Generate the width
    this.editor.style.width  = '100%';
    this.editor.style.height = this.element.offsetHeight+'px';

    //Should actually check what mode it's in!
    this.previewer.style.display = 'none';
    this.previewer.style.overflow = 'auto';

    //Fit the preview window into the container
    //FIXME Should be in theme!
    this.previewer.style['padding'] = '10px';
    this.previewer.style.width  = this.element.offsetWidth - _outerWidth(this.previewer) - widthDiff +'px';
    this.previewer.style.height = this.element.offsetHeight - _outerHeight(this.previewer) - heightDiff +'px';

    //FIXME figure out why it needs +2 px
    if(_isIE() > -1){
      this.previewer.style.height = parseInt(_getStyle(this.previewer,'height'))+2;
    }

    //Preload the preview theme:
    _insertCSSLink(self.settings.basePath+self.settings.themes.preview, self.iframe, 'theme');

    //If there is a file to be opened with that filename and it has content...
    this.open(self.settings.file.name);

    if(this.settings.focusOnLoad){
      this.editor.focus();
    }

    //Sets up the onclick event on the previewer/editor toggle button
    //TODO: Should use EE's state object rather than classes
    self.iframe.getElementsByClassName('epiceditor-toggle-btn')[0].addEventListener('click',function(){
      //If it was in edit mode...
      if(self.get('wrapper').className.indexOf('epiceditor-edit-mode') > -1){
        self.preview();
      }
      //If it was in preview mode...
      else{
        self.edit();
      }
    });

    //Sets up the fullscreen editor/previewer
    //TODO: Deal with the fact Firefox doesn't really support fullscreen and don't browser sniff
    if (fullScreenApi.supportsFullScreen && document.body.webkitRequestFullScreen) {
      var fsElement = document.getElementById(self.settings.id)
      ,   fsBtns = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];


      //A simple helper to save the state of the styles on an element to make reverting easier
      var currentStyleState = [];
      var styleState = function(e,t){
        t = t || 'load';
        if(t === 'save'){
          currentStyleState[e] = {
            width:_getStyle(e,'width')
          , height:_getStyle(e,'height')
          , float:_getStyle(e,'float')
          , display:_getStyle(e,'display')
          }
        }
        else{
          for(x in currentStyleState[e]){
            if(currentStyleState[e].hasOwnProperty(x)){
              e.style[x] = currentStyleState[e][x];
            }
          }
        }
      }

      styleState(self.editor,'save');
      styleState(self.previewer,'save');

      var revertBackTo = self.editor;

      self.iframe.getElementsByClassName('epiceditor-fullscreen-btn')[0].addEventListener('click',function(){
        if(_getStyle(self.previewer,'display') === 'block'){
          revertBackTo = self.previewer;
        }
        fullScreenApi.requestFullScreen(fsElement);
      });
      fsElement.addEventListener(fullScreenApi.fullScreenEventName,function(){
        if (fullScreenApi.isFullScreen()) {
          fsBtns.style.visibility = 'hidden';

          //Editor styles
          self.editor.style.height  = window.outerHeight+'px';
          self.editor.style.width   = window.outerWidth/2+'px'; //Half of the screen
          self.editor.style.float   = 'left';
          self.editor.style.display = 'block';

          //Previewer styles
          self.previewer.style.height  = window.outerHeight+'px'
          self.previewer.style.width   = (window.outerWidth-_outerWidth(self.editor))+'px'; //Fill in the remaining space
          self.previewer.style.float   = 'right';
          self.previewer.style.display = 'block';

          self.preview(true);

          var fullscreenLivePreview = self.editor.addEventListener('keyup',function(){
            self.preview(true);
          });

        }
        else{
          fsBtns.style.visibility = 'visible';
          styleState(self.editor);
          styleState(self.previewer);
          if(revertBackTo === self.editor){
            self.edit(); 
          }
          else{
            self.preview();
          }
        }
      }, true);
    }
    else{
      //TODO: homebrew support by position:fixed and width/height 100% of document size
      self.iframe.getElementsByClassName('epiceditor-fullscreen-btn')[0].style.display = 'none';
    }

    var utilBar = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];
    
    //Hide it at first until they move their mouse
    utilBar.style.display = 'none';

    //Hide and show the util bar based on mouse movements
    var utilBarTimer
    ,   mousePos = { y:-1, x:-1 };
    this.iframe.addEventListener('mousemove',function(e){
      //Here we check if the mouse has moves more than 5px in any direction before triggering the mousemove code
      //we do this for 2 reasons:
      //1. On Mac OS X lion when you scroll and it does the iOS like "jump" when it hits the top/bottom of the page itll fire off
      //   a mousemove of a few pixels depending on how hard you scroll
      //2. We give a slight buffer to the user in case he barely touches his touchpad or mouse and not trigger the UI
      if(Math.abs(mousePos.y-e.pageY) >= 5 || Math.abs(mousePos.x-e.pageX) >= 5){
        utilBar.style.display = 'block';
        // if we have a timer already running, kill it out
        if(utilBarTimer){
          clearTimeout(utilBarTimer);   
        }

        // begin a new timer that hides our object after 1000 ms
        utilBarTimer = window.setTimeout(function() {
            utilBar.style.display = 'none';
        }, 1000);
      }
      mousePos = { y:e.pageY, x:e.pageX };
    });

    //Make sure, on window resize, if the containing element changes size keep it fitting inside
    window.addEventListener('resize',function(){
      var widthDiff = _outerWidth(self.element) - self.element.offsetWidth;
      iframeElement.style.width  = self.element.offsetWidth - widthDiff +'px';
    });

    //TODO: This should have a timer to save on performance
    //TODO: The save file shoudl be dynamic, not just default
    //On keyup, save the content to the proper file for offline use
    self.editor.addEventListener('keyup',function(){
      self.content = this.value;
      self.save(self.settings.file.name,this.value);
    });

    //Add keyboard shortcuts for convenience.
    var isMod = false;
    self.iframe.addEventListener('keyup', function(e){
      if(e.keyCode === self.settings.shortcuts.modifier){ isMod = false };
    });
    self.iframe.addEventListener('keydown', function(e){
      if(e.keyCode === self.settings.shortcuts.modifier){ isMod = true }; //check for modifier press(default is alt key), save to var

      //Check for alt+p and make sure were not in fullscreen - default shortcut to switch to preview
      if(isMod === true && e.keyCode === self.settings.shortcuts.preview && !fullScreenApi.isFullScreen()){
        e.preventDefault();
        self.preview();
      }
      //Check for alt+o - default shortcut to switch back to the editor
      if(isMod === true && e.keyCode === self.settings.shortcuts.edit){
        e.preventDefault();
        if(!fullScreenApi.isFullScreen()){
          self.edit();
        }
      }
      //Check for alt+f - default shortcut to make editor fullscreen
      if(isMod === true && e.keyCode === self.settings.shortcuts.fullscreen){
        e.preventDefault();
        //TODO remove this once issue #32 is fixed, but don't until #32 or else FF will error out
        if(document.body.webkitRequestFullScreen){
          fullScreenApi.requestFullScreen(fsElement);
        }
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
  EpicEditor.prototype.unload = function(callback){
    var self = this;
    var editor = window.parent.document.getElementById(self.settings.id);
    editor.parentNode.removeChild(editor);
    callback.call(this);
    self.emit('unload');
    return self;
  }

  /**
   * Will take the markdown and generate a preview view based on the theme
   * @param {string} theme The path to the theme you want to preview in
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.preview = function(theme,live){
    var self = this
    ,   themePath = self.settings.basePath+self.settings.themes.preview;
    if(typeof theme === 'boolean'){
      live = theme;
      theme = themePath
    }
    else{
      theme = theme || themePath
    }

    _replaceClass(self.get('wrapper'),'epiceditor-edit-mode','epiceditor-preview-mode');

    //Check if no CSS theme link exists
    if(!self.iframe.getElementById('theme')){
      _insertCSSLink(theme, self.iframe, 'theme');
    }
    else if(self.iframe.getElementById('theme').name !== theme){
      self.iframe.getElementById('theme').href = theme;
    }
    
    //Add the generated HTML into the previewer
    this.previewer.innerHTML = this.exportHTML();
    
    //Hide the editor and display the previewer
    if(!live){
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
  EpicEditor.prototype.edit = function(){
    var self = this;
    _replaceClass(self.get('wrapper'),'epiceditor-preview-mode','epiceditor-edit-mode');
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
  EpicEditor.prototype.get = function(name){
    var available = {
      document: this.iframe
    , body: this.iframe.body
    , editor: this.editor
    , previewer: this.previewer
    , wrapper: this.iframe.getElementsByClassName('epiceditor-wrapper')[0]
    }
    if(!available[name]){
      return null;
    }
    else{
      return available[name];
    }
  }

  /**
   * Opens a file
   * @param   {string} name The name of the file you want to open
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.open = function(name){
    var self = this;
    name = name || self.settings.file.name;
    if(localStorage && localStorage['epiceditor']){
      var fileObj = JSON.parse(localStorage['epiceditor']).files;
      if(fileObj[name]){
        self.editor.value = fileObj[name];
      }
      else{
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
  EpicEditor.prototype.save = function(file,content){
    var self = this;
    file = file || self.settings.file.name;
    content = content || this.editor.value;
    var s = JSON.parse(localStorage['epiceditor']);
    s.files[file] = content;
    localStorage['epiceditor'] = JSON.stringify(s);
    this.emit('save');
    return this;
  }

  /**
   * Removes a page
   * @param   {string} name The name of the file you want to remove from localStorage
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.remove = function(name){
    var self = this;
    name = name || self.settings.file.name;
    var s = JSON.parse(localStorage['epiceditor']);
    delete s.files[name];
    localStorage['epiceditor'] = JSON.stringify(s);
    this.emit('remove');
    return this;
  };


  /**
   * Imports a MD file instead of having to manual inject content via
   * .get(editor).value = 'the content'
   * @param   {string} name    The name of the file
   * @param   {stirng} content The MD to import
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.import = function(name,content){
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
  EpicEditor.prototype.rename = function(oldName,newName){
    var self = this;
    var s = JSON.parse(localStorage['epiceditor']);
    s.files[newName] = s.files[oldName];
    delete s.files[oldName];
    localStorage['epiceditor'] = JSON.stringify(s);
    self.open(newName);
    return this;
  };

  /**
   * Converts content into HTML from markdown
   * @returns {string} Returns the HTML that was converted from the markdown
   */
  EpicEditor.prototype.exportHTML = function(){
      var c = new Showdown.converter();
      return c.makeHtml(this.editor.value);
  }

  //EVENTS
  //TODO: Support for namespacing events like "preview.foo"
  /**
   * Sets up an event handler for a specified event
   * @param  {string} ev The event name
   * @param  {function} handler The callback to run when the event fires
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.on = function(ev, handler){
    var self = this;
    if (!this.events[ev]){
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
  EpicEditor.prototype.emit = function(ev, data){
    var self = this;
    if (!this.events[ev]){
      return;
    }
    //TODO: Cross browser support!
    this.events[ev].forEach(invokeHandler);
    function invokeHandler(handler) {
      handler.call(self.iframe,data);
    }
    return self;
  };

  /**
   * Will remove any listeners added from EpicEditor.on()
   * @param  {string} ev The event name
   * @param  {function} handler Handler to remove
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.removeListener = function(ev, handler){
    var self = this;
    if(!handler){
      this.events[ev] = [];
      return self;
    }
    if(!this.events[ev]){
      return self;
    }
    //Otherwise a handler and event exist, so take care of it
    this._events[ev].splice(this._events[ev].indexOf(handler), 1);
    return self;
  }


  window.EpicEditor = EpicEditor;
})(window);