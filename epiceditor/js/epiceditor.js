/**
 * Copyright (c) 2011 Oscar Godson http://oscargodson.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (window, undefined) {//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//        A A L
//        T C A
//        T K B
//
//   <http://www.attacklab.net/>
//
// **************************************************
// GitHub Flavored Markdown modifications by Tekkub
// http://github.github.com/github-flavored-markdown/
//
// Modifications are tagged with "GFM"
// **************************************************
// **************************************************
// Node.JS port by Isaac Z. Schlueter
//
// Modifications are tagged with "isaacs"
// **************************************************
!({});var Showdown={};typeof exports=="object"&&(Showdown=exports,Showdown.parse=function(a,b){var c=new Showdown.converter;return c.makeHtml(a,b)});var GitHub;Showdown.converter=function(){var a,b,c,d=0;this.makeHtml=function(d,h){return typeof h!="undefined"&&(typeof h=="string"&&(h={nameWithOwner:h}),GitHub=h),a=new Array,b=new Array,c=new Array,d=d.replace(/~/g,"~T"),d=d.replace(/\$/g,"~D"),d=d.replace(/\r\n/g,"\n"),d=d.replace(/\r/g,"\n"),d="\n\n"+d+"\n\n",d=G(d),d=d.replace(/^[ \t]+$/mg,""),d=g(d),d=f(d),d=i(d),d=E(d),d=d.replace(/~D/g,"$$"),d=d.replace(/~T/g,"~"),d=d.replace(/https?\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!]/g,function(a,b){var c=d.slice(0,b),e=d.slice(b);return c.match(/<[^>]+$/)&&e.match(/^[^>]*>/)?a:"<a target='blank' href='"+a+"'>"+a+"</a>"}),d=d.replace(/[a-z0-9_\-+=.]+@[a-z0-9\-]+(\.[a-z0-9-]+)+/ig,function(a){return"<a href='mailto:"+a+"'>"+a+"</a>"}),d=d.replace(/[a-f0-9]{40}/ig,function(a,b){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var c=d.slice(0,b),e=d.slice(b);return c.match(/@$/)||c.match(/<[^>]+$/)&&e.match(/^[^>]*>/)?a:"<a target='blank' href='http://github.com/"+GitHub.nameWithOwner+"/commit/"+a+"'>"+a.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);return g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/)?a:"<a target='blank' href='http://github.com/"+b+"/"+GitHub.repoName+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c){return"<a target='blank' href='http://github.com/"+b+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/#([0-9]+)/ig,function(a,b,c){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var e=d.slice(0,c),f=d.slice(c);return e==""||e.match(/[a-z0-9_\-+=.]$/)||e.match(/<[^>]+$/)&&f.match(/^[^>]*>/)?a:"<a target='blank' href='http://github.com/"+GitHub.nameWithOwner+"/issues/#issue/"+b+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);return g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/)?a:"<a target='blank' href='http://github.com/"+b+"/"+GitHub.repoName+"/issues/#issue/"+c+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c){return"<a target='blank' href='http://github.com/"+b+"/issues/#issue/"+c+"'>"+a+"</a>"}),d};var e=function(){return GitHub.nameWithOwner.match(/^.+\/(.+)$/)[1]},f=function(c){var c=c.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(c,d,e,f,g){return d=d.toLowerCase(),a[d]=A(e),f?f+g:(g&&(b[d]=g.replace(/"/g,"&quot;")),"")});return c},g=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";return a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,h),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,h),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/\n\n/g,"\n"),a},h=function(a,b){var d=b;return d=d.replace(/\n\n/g,"\n"),d=d.replace(/^\n/,""),d=d.replace(/\n+$/g,""),d="\n\n~K"+(c.push(d)-1)+"K\n\n",d},i=function(a){a=p(a);var b=u("<hr />");return a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=r(a),a=t(a),a=s(a),a=y(a),a=g(a),a=z(a),a},j=function(a){return a=v(a),a=k(a),a=B(a),a=n(a),a=l(a),a=C(a),a=A(a),a=x(a),a=a.replace(/  +\n/g," <br />\n"),a},k=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;return a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return b=H(b,"\\`*_"),b}),a},l=function(a){return a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,m),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,m),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,m),a},m=function(c,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else{if(!(k.search(/\(\s*\)$/m)>-1))return k;n=""}}n=H(n,"*_");var p="<a target='blank' href=\""+n+'"';return o!=""&&(o=o.replace(/"/g,"&quot;"),o=H(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>",p},n=function(a){return a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,o),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,o),a},o=function(c,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]==undefined)return k;n=a[m],b[m]!=undefined&&(o=b[m])}l=l.replace(/"/g,"&quot;"),n=H(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';return o=o.replace(/"/g,"&quot;"),o=H(o,"*_"),p+=' title="'+o+'"',p+=" />",p},p=function(a){return a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,b){return u("<h1>"+j(b)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,b){return u("<h2>"+j(b)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,b,c){var d=b.length;return u("<h"+d+">"+j(c)+"</h"+d+">")}),a},q,r=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;return d?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=q(d);return f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n",f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=q(f);return h=e+"<"+g+">\n"+h+"</"+g+">\n",h})),a=a.replace(/~0/,""),a};q=function(a){return d++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,h=c;return g||f.search(/\n{2,}/)>-1?f=i(F(f)):(f=r(F(f)),f=f.replace(/\n$/,""),f=j(f)),"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),d--,a};var s=function(a){return a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;return d=w(F(d)),d=G(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>",u(d)+e}),a=a.replace(/~0/,""),a},t=function(a){return a=a.replace(/`{3}(?:(.*$)\n)?([\s\S]*?)`{3}/gm,function(a,b,c){var d='<div class="highlight"><pre lang="'+b+'">'+c+"</pre></div>";return d}),a},u=function(a){return a=a.replace(/(^\n+|\n+$)/g,""),"\n\n~K"+(c.push(a)-1)+"K\n\n"},v=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;return f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=w(f),b+"<code>"+f+"</code>"}),a},w=function(a){return a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=H(a,"*_{}[]\\",!1),a},x=function(a){return a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\w)_(\w)/g,"$1~E95E$2"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>"),a},y=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;return c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=i(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;return c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,""),c}),u("<blockquote>\n"+c+"\n</blockquote>")}),a},z=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),d=new Array,e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?d.push(g):g.search(/\S/)>=0&&(g=j(g),g=g.replace(/\n/g,"<br />"),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",d.push(g))}e=d.length;for(var f=0;f<e;f++)while(d[f].search(/~K(\d+)K/)>=0){var h=c[RegExp.$1];h=h.replace(/\$/g,"$$$$"),d[f]=d[f].replace(/~K\d+K/,h)}return d.join("\n\n")},A=function(a){return a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;"),a},B=function(a){return a=a.replace(/\\(\\)/g,I),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,I),a},C=function(a){return a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a target='blank' href=\"$1\">$1</a>"),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return D(E(b))}),a},D=function(a){function b(a){var b="0123456789ABCDEF",c=a.charCodeAt(0);return b.charAt(c>>4)+b.charAt(c&15)}var c=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+b(a)+";"},function(a){return a}];return a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=c[Math.floor(Math.random()*2)](a);else if(a!=":"){var b=Math.random();a=b>.9?c[2](a):b>.45?c[1](a):c[0](a)}return a}),a="<a target='blank' href=\""+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">'),a},E=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)}),a},F=function(a){return a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,""),a},G=function(a){return a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,""),a},H=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");return a=a.replace(e,I),a},I=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}};  //Fullscreen API wrapper ( http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/ )
  (function () {
    var a
      , b
      , c = {
        supportsFullScreen: !1,
        isFullScreen: function () {
          return !1;
        },
        requestFullScreen: function () {},
        cancelFullScreen: function () {},
        fullScreenEventName: "",
        prefix: ""
      }
    , d = "webkit moz o ms khtml".split(" ")

    if ("undefined" !== typeof document.cancelFullScreen) c.supportsFullScreen = !0; else for (a = 0, b = d.length; a < b; a++) if (c.prefix = d[a], "undefined" !== typeof document[c.prefix + "CancelFullScreen"]) {
      c.supportsFullScreen = !0;
      break;
    }
    c.supportsFullScreen && (c.fullScreenEventName = c.prefix + "fullscreenchange", c.isFullScreen = function () {
      switch (this.prefix) {
       case "":
        return document.fullScreen;
       case "webkit":
        return document.webkitIsFullScreen;
       default:
        return document[this.prefix + "FullScreen"];
      }
    }, c.requestFullScreen = function (a) {
      return "" === this.prefix ? a.requestFullScreen() : a[this.prefix + "RequestFullScreen"]();
    }, c.cancelFullScreen = function () {
      return "" === this.prefix ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]();
    }), "undefined" !== typeof jQuery && (jQuery.fn.requestFullScreen = function () {
      return this.each(function () {
        c.supportsFullScreen && c.requestFullScreen(this);
      });
    }), window.fullScreenApi = c;
  })();  /*global fullScreenApi:false, Showdown:false */

  /**
   * Applies attributes to a DOM object
   * @param  {object} context The DOM obj you want to apply the attributes to
   * @param  {object} attrs A key/value pair of attributes you want to apply
   * @returns {undefined}
   */
  function _applyAttrs(context, attrs) {
    var attr
  
    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
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
  function _getStyle(el, styleProp) {
      var x = el
        , y = null

      if (window.getComputedStyle) {
        y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
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
    var headID = context.getElementsByTagName('head')[0]
      , cssNode = context.createElement('link')

    id = id || '';
    _applyAttrs(cssNode, {
        type: 'text/css'
      , id: id
      , rel: 'stylesheet'
      , href: path + '?' + new Date().getTime()
      , name: path
      , media: 'screen'
      }
    );

    cssNode.media = 'screen';
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
      re  = /MSIE ([0-9]{1,}[\.0-9]{0,})/;
      if (re.exec(ua) !== null) {
        rv = parseFloat(RegExp.$1);
      }
    }
    return rv;
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

    function isFunction(functionToCheck) {
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }
    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      options = arguments[i]
      if (options !== null && options !== undefined) {
        // Extend the base object
        for (name in options) {
          if (options.hasOwnProperty(name)) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target === copy) {
              continue;
            }
            // Recurse if we're merging object values
            if (deep && copy && typeof copy === "object" && !copy.nodeType) {
              target[name] = _mergeObjs(deep
                // Never move original objects, clone them
                // @OscarGodson I'm not sure if this wants null + undefined or specifically null
                , src || (copy.length !== null && copy.length !== undefined ? [] : {})
                , copy
              );
            } else if (copy !== undefined) {
              // Don't bring in undefined values
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
   * @param {object} e A DOM object for the editor to be placed in
   * @returns {object} EpicEditor will be returned
   */
  function EpicEditor(e) {
    var uId = 'epiceditor-' + Math.round(Math.random() * 100000)
      , fileName = e.id
      , defaultStorage

    //TODO: Check for data-filename as well
    if (!fileName) { //If there is no id on the element to use, just use "default"
      fileName = 'default';
    }

    //Default settings (will be overwritten if .options() is called with parameters)
    this.settings = {
      basePath: 'epiceditor'
    , themes: {
        preview: '/themes/preview/preview-dark.css'
      , editor: '/themes/editor/epic-dark.css'
      }
    , file: {
        name: fileName //Use the DOM element's ID for an unique persistent file name
      , defaultContent: ''
      }
      //Because there might be multiple editors, we create a random id
    , id: uId
    , focusOnLoad: false
    , shortcuts: {
        modifier: 18 // alt keycode
      , fullscreen: 70 // f keycode
      , preview: 80 // p keycode
      , edit: 79 // o keycode
      }
    };

    //Setup local storage of files
    if (localStorage) {
      if (!localStorage['epiceditor']) {
        //TODO: Needs a dynamic file name!
        defaultStorage = {files: {}};
        defaultStorage.files[this.settings.file.name] = this.settings.file.defaultContent;
        defaultStorage = JSON.stringify(defaultStorage);
        localStorage['epiceditor'] = defaultStorage;
      }
      else if (!JSON.parse(localStorage['epiceditor']).files[this.settings.file.name]) {
        JSON.parse(localStorage['epiceditor']).files[this.settings.file.name] = this.settings.file.defaultContent;
      }
      else {
        this.content = this.settings.file.defaultContent;
      }
    }
    //Now that it exists, allow binding of events if it doesn't exist yet
    if (!this.events) {
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
  EpicEditor.prototype.options = function (options) {
    var self = this;
    self.settings = _mergeObjs(true, this.settings, options);
    return self;
  }

  /**
   * Inserts the EpicEditor into the DOM via an iframe and gets it ready for editing and previewing
   * @returns {object} EpicEditor will be returned
   */
  EpicEditor.prototype.load = function (callback) {
    var self = this
      , _HtmlTemplate
      , iframeElement
      , iframeBody
      , widthDiff
      , heightDiff
      , fsElement
      , fsBtns
      , currentStyleState
      , styleState
      , revertBackTo
      , utilBar
      , utilBarTimer
      , mousePos
      , isMod
      , fullscreenLivePreview

    callback = callback || function () {};

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
    _insertCSSLink(self.settings.basePath + self.settings.themes.editor, self.iframe);
    
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
    _insertCSSLink(self.settings.basePath + self.settings.themes.preview, self.iframe, 'theme');

    //If there is a file to be opened with that filename and it has content...
    this.open(self.settings.file.name);

    if (this.settings.focusOnLoad) {
      this.editor.focus();
    }

    //Sets up the onclick event on the previewer/editor toggle button
    //TODO: Should use EE's state object rather than classes
    self.iframe.getElementsByClassName('epiceditor-toggle-btn')[0].addEventListener('click', function () {
      //If it was in edit mode...
      if (self.get('wrapper').className.indexOf('epiceditor-edit-mode') > -1) {
        self.preview();
      }
      //If it was in preview mode...
      else {
        self.edit();
      }
    });

    //Sets up the fullscreen editor/previewer
    //TODO: Deal with the fact Firefox doesn't really support fullscreen and don't browser sniff
    if (fullScreenApi.supportsFullScreen && document.body.webkitRequestFullScreen) {
      fsElement = document.getElementById(self.settings.id);
      fsBtns = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];

      //A simple helper to save the state of the styles on an element to make reverting easier
      currentStyleState = [];
      styleState = function (e, t) {
        var x
        
        t = t || 'load';
        if (t === 'save') {
          currentStyleState[e] = {
            width: _getStyle(e, 'width')
          , height: _getStyle(e, 'height')
          // Should float be quoted just for clarity
          , float: _getStyle(e, 'float')
          , display: _getStyle(e, 'display')
          }
        }
        else {
          for (x in currentStyleState[e]) {
            if (currentStyleState[e].hasOwnProperty(x)) {
              e.style[x] = currentStyleState[e][x];
            }
          }
        }
      }

      styleState(self.editor, 'save');
      styleState(self.previewer, 'save');

      revertBackTo = self.editor;

      self.iframe.getElementsByClassName('epiceditor-fullscreen-btn')[0].addEventListener('click', function () {
        if (_getStyle(self.previewer, 'display') === 'block') {
          revertBackTo = self.previewer;
        }
        fullScreenApi.requestFullScreen(fsElement);
      });
      fsElement.addEventListener(fullScreenApi.fullScreenEventName, function () {
        if (fullScreenApi.isFullScreen()) {
          fsBtns.style.visibility = 'hidden';

          //Editor styles
          self.editor.style.height  = window.outerHeight + 'px';
          self.editor.style.width   = window.outerWidth / 2 + 'px'; //Half of the screen
          self.editor.style.float   = 'left';
          self.editor.style.display = 'block';

          //Previewer styles
          self.previewer.style.height  = window.outerHeight + 'px'
          self.previewer.style.width   = (window.outerWidth - _outerWidth(self.editor)) + 'px'; //Fill in the remaining space
          self.previewer.style.float   = 'right';
          self.previewer.style.display = 'block';

          self.preview(true);

          fullscreenLivePreview = self.editor.addEventListener('keyup', function () {
            self.preview(true);
          });

        } else {
          fsBtns.style.visibility = 'visible';
          styleState(self.editor);
          styleState(self.previewer);
          if (revertBackTo === self.editor) {
            self.edit();
          } else {
            self.preview();
          }
        }
      }, true);
    } else {
      //TODO: homebrew support by position:fixed and width/height 100% of document size
      self.iframe.getElementsByClassName('epiceditor-fullscreen-btn')[0].style.display = 'none';
    }

    utilBar = self.iframe.getElementsByClassName('epiceditor-utilbar')[0];
    
    //Hide it at first until they move their mouse
    utilBar.style.display = 'none';

    //Hide and show the util bar based on mouse movements
    mousePos = { y: -1, x: -1 };
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

    //Make sure, on window resize, if the containing element changes size keep it fitting inside
    window.addEventListener('resize', function () {
      var widthDiff = _outerWidth(self.element) - self.element.offsetWidth;
      iframeElement.style.width  = self.element.offsetWidth - widthDiff + 'px';
    });

    //TODO: This should have a timer to save on performance
    //TODO: The save file shoudl be dynamic, not just default
    //On keyup, save the content to the proper file for offline use
    self.editor.addEventListener('keyup', function () {
      self.content = this.value;
      self.save(self.settings.file.name, this.value);
    });

    //Add keyboard shortcuts for convenience.
    isMod = false;
    self.iframe.addEventListener('keyup', function (e) {
      if (e.keyCode === self.settings.shortcuts.modifier) { isMod = false }
    });
    self.iframe.addEventListener('keydown', function (e) {
      if (e.keyCode === self.settings.shortcuts.modifier) { isMod = true } //check for modifier press(default is alt key), save to var

      //Check for alt+p and make sure were not in fullscreen - default shortcut to switch to preview
      if (isMod === true && e.keyCode === self.settings.shortcuts.preview && !fullScreenApi.isFullScreen()) {
        e.preventDefault();
        self.preview();
      }
      //Check for alt+o - default shortcut to switch back to the editor
      if (isMod === true && e.keyCode === self.settings.shortcuts.edit) {
        e.preventDefault();
        if (!fullScreenApi.isFullScreen()) {
          self.edit();
        }
      }
      //Check for alt+f - default shortcut to make editor fullscreen
      if (isMod === true && e.keyCode === self.settings.shortcuts.fullscreen) {
        e.preventDefault();
        //TODO remove this once issue #32 is fixed, but don't until #32 or else FF will error out
        if (document.body.webkitRequestFullScreen) {
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
  EpicEditor.prototype.unload = function (callback) {
    var self = this
      , editor = window.parent.document.getElementById(self.settings.id)

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
  EpicEditor.prototype.preview = function (theme, live) {
    var self = this
      , themePath = self.settings.basePath + self.settings.themes.preview

    if (typeof theme === 'boolean') {
      live = theme;
      theme = themePath
    } else {
      theme = theme || themePath
    }

    _replaceClass(self.get('wrapper'), 'epiceditor-edit-mode', 'epiceditor-preview-mode');

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
    var self = this

    _replaceClass(self.get('wrapper'), 'epiceditor-preview-mode', 'epiceditor-edit-mode');
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
    var available = {
        document: this.iframe
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
    if (localStorage && localStorage['epiceditor']) {
      fileObj = JSON.parse(localStorage['epiceditor']).files;
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
    s = JSON.parse(localStorage['epiceditor']);
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
  EpicEditor.prototype.remove = function (name) {
    var self = this
      , s

    name = name || self.settings.file.name;
    s = JSON.parse(localStorage['epiceditor']);
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
  EpicEditor.prototype.import = function (name, content) {
    var self = this
    
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
      , s = JSON.parse(localStorage['epiceditor'])
      
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
  EpicEditor.prototype.exportHTML = function () {
    var c = new Showdown.converter()
      
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
  EpicEditor.prototype.on = function (ev, handler) {
    var self = this
    
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
    var self = this
    
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
    var self = this
    
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