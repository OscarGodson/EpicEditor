/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
if (typeof foounit.ui == 'undefined'){
  foounit.ui = {};
}

(function (ui){
  var _body, _index = 0
    , _autoScrolling = window.location.search.indexOf("foounit.ui.autoScroll=true") > -1
    , _logAll = window.location.search.indexOf("foounit.ui.log=all") > -1;

  var _createTitleNode = function (title, index, className){
    var titleDiv = document.createElement('div');
    titleDiv.className = 'example ' + className;
    titleDiv.innerHTML = '<a name="example' + index + '" ' +
      'class="title">' + title + '</a> ' +
      '&nbsp;<a class="topnav" href="#top">top &raquo;</a>';
    return titleDiv;
  }

  /**
   * Creates a failure node for an example
   */
  var _createFailureNode = function (example, index){
    var titleDiv = _createTitleNode(example.getFullDescription(), index, 'failure');

    var stackDiv = document.createElement('div');
    stackDiv.className = 'stack';
    stackDiv.innerHTML = '<pre>' +
      example.getException().message + "\n\n" +
      example.getStack() +
      '</pre>';
    titleDiv.appendChild(stackDiv);

    return titleDiv;
  };

  /**
   * Creates a success node for an example
   */
  var _createSuccessNode = function (example, index){
    return _createTitleNode(example.getFullDescription(), index, 'success');
  };

  /**
   * Creates a pending node for an example
   */
  var _createPendingNode = function (example, index){
    return _createTitleNode(example.getFullDescription(), index, 'pending');
  };

  /**
   * Progress bar
   */
  var _ProgressBar = function (body){
    this._body = body;

    this._node = document.createElement('div');
    this._node.className = 'progress-bar';
    this._body.appendChild(this._node);

    this._progress = document.createElement('div');
    this._progress.className = 'progress';
    this._node.appendChild(this._progress);

    this._log = document.createElement('div');
    this._log.className = 'progress-bar-log';
    this._node.appendChild(this._log);

    this._appendStatus = function (className, display, index){
      var node = document.createElement('a');
      node.href = '#example' + index;
      node.className = className;
      node.innerHTML = display;
      this._progress.appendChild(node);
    }

    this.fail = function (index){
      this._appendStatus('failure', '&#x2717;', index);
    }

    this.success = function (index){
      this._appendStatus('success', '&#x2713;', index);
    }

    this.pending = function (index){
      this._appendStatus('pending', 'P', index);
    }

    this.log = function (message){
      var node = document.createElement('div');
      node.innerHTML = message;
      this._log.appendChild(node);
    }
  }

  var _Scroller = function (){
    var _listen = function (obj, evt){
    };

    // Runs in the constructor
    _listen(window, 'scroll');
    _listen(window, 'click');

    this.cancel = function (){
    }

    this.bottom = function (){
      if (_autoScrolling){
        window.scroll(0, 1000000);
      }
    }

    this.top = function (){
      if (_autoScrolling){
        window.scroll(0, 0);
      }
    }

  }

  /************ Public functions ***********/

  /**
   * Called to initialize the UI
   */
  ui.init = function (){
    _body = document.getElementsByTagName('body')[0];

    var topNode = document.createElement('a');
    topNode.setAttribute('name', 'top');
    _body.appendChild(topNode);

    _progressBar = new _ProgressBar(_body, 'progress');
    _scroller    = new _Scroller();
  };

  /**
   * Called when an the runner runs an example that fails
   */
  ui.onFailure = function (example){
    try {
      _body.appendChild(_createFailureNode(example, _index));
      _progressBar.fail(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onFailure: ' + e.message);
    }
  };

  /**
   * Called when the runner runs an example that succeeds
   */
  ui.onSuccess = function (example){
    try {
      if (_logAll){
        _body.appendChild(_createSuccessNode(example, _index));
      }
      _progressBar.success(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onSuccess: ' + e.message);
    }
  };

  /**
   * Called when the runner runs a pending example
   */
  ui.onPending = function (example){
    try {
      _body.appendChild(_createPendingNode(example, _index));
      _progressBar.pending(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onPending: ' + e.message);
    }
  }

  /**
   * Called when the suite has finished running
   */
  ui.onFinish = function (info){
    try {
      _progressBar.log('>> foounit summary: '   +
        info.failCount      + ' failed, '  +
        info.passCount      + ' passed, '  +
        info.pending.length + ' pending, ' +
        info.totalCount     + ' total');

      _progressBar.log('>> foounit runtime: ' + info.runMillis + 'ms');
      _scroller.top();
    } catch (e){
      alert('foounit.ui.onFinish: ' + e.message);
    }
  };

})(foounit.ui);

// Mostly pulled from node's assert.js library
// Made a few mods to get this working in a browser
// other than chrome. - Bob Remeika

// Licensing included:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// UTILITY
assert = (function (){
  var assert = {};

  var pSlice = Array.prototype.slice;


  // FIXME: This is super hacky
  // AssertionError only works in v8
  if (navigator.userAgent.match(/Chrome/)){
    assert.AssertionError = function AssertionError(options) {
      this.name = 'AssertionError';
      this.message = options.message;
      this.actual = options.actual;
      this.expected = options.expected;
      this.operator = options.operator;
      var stackStartFunction = options.stackStartFunction || fail;

      //if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackStartFunction);
      //}
    };
    foounit.mixin(assert.AssertionError.prototype, Error.prototype);

    assert.AssertionError.prototype.toString = function() {
      if (this.message) {
        return [this.name + ':', this.message].join(' ');
      } else {
        return [this.name + ':',
                JSON.stringify(this.expected),
                this.operator,
                JSON.stringify(this.actual)].join(' ');
      }
    };

    // assert.AssertionError instanceof Error
    assert.AssertionError.__proto__ = Error.prototype;
  }


  function fail(actual, expected, message, operator, stackStartFunction) {
    // FIXME: This is super hacky
    // AssertionError only works in V8
    if (navigator.userAgent.match(/Chrome/)){
      throw new assert.AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
      });
    } else {
      if (message) {
        var msg = ['AssertionError:', message].join(' ');
        throw new Error(msg);
      } else {
        var formatted = ['AssertionError:',
          JSON.stringify(expected),
          operator,
          JSON.stringify(actual)].join(' ');
        throw new Error(formatted);
      }
    }
  }

  // EXTENSION! allows for well behaved errors defined elsewhere.
  assert.fail = fail;

  // 4. Pure assertion tests whether a value is truthy, as determined
  // by !!guard.
  // assert.ok(guard, message_opt);
  // This statement is equivalent to assert.equal(true, guard,
  // message_opt);. To test strictly for the value true, use
  // assert.strictEqual(true, guard, message_opt);.

  assert.ok = function ok(value, message) {
    if (!!!value) fail(value, true, message, '==', assert.ok);
  };

  // 5. The equality assertion tests shallow, coercive equality with
  // ==.
  // assert.equal(actual, expected, message_opt);

  assert.equal = function equal(actual, expected, message) {
    if (actual != expected) fail(actual, expected, message, '==', assert.equal);
  };

  // 6. The non-equality assertion tests for whether two objects are not equal
  // with != assert.notEqual(actual, expected, message_opt);

  assert.notEqual = function notEqual(actual, expected, message) {
    if (actual == expected) {
      fail(actual, expected, message, '!=', assert.notEqual);
    }
  };

  // 7. The equivalence assertion tests a deep equality relation.
  // assert.deepEqual(actual, expected, message_opt);

  assert.deepEqual = function deepEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected)) {
      fail(actual, expected, message, 'deepEqual', assert.deepEqual);
    }
  };

  function _deepEqual(actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  }

  function isUndefinedOrNull(value) {
    return value === null || value === undefined;
  }

  function isArguments(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function getKeys(obj){
    var keys = [];
    try {
      keys = Object.keys(obj);
    } catch (e){
      for (var p in obj){
        keys.push(p);
      }
    }
    return keys;
  }

  function objEquiv(a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical 'prototype' property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return _deepEqual(a, b);
    }
    try {
      var ka = getKeys(a),
          kb = getKeys(b),
          key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!_deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  // 8. The non-equivalence assertion tests for any deep inequality.
  // assert.notDeepEqual(actual, expected, message_opt);

  assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
    if (_deepEqual(actual, expected)) {
      fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
    }
  };

  // 9. The strict equality assertion tests strict equality, as determined by ===.
  // assert.strictEqual(actual, expected, message_opt);

  assert.strictEqual = function strictEqual(actual, expected, message) {
    if (actual !== expected) {
      fail(actual, expected, message, '===', assert.strictEqual);
    }
  };

  // 10. The strict non-equality assertion tests for strict inequality, as
  // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

  assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      fail(actual, expected, message, '!==', assert.notStrictEqual);
    }
  };

  function expectedException(actual, expected) {
    if (!actual || !expected) {
      return false;
    }

    if (expected instanceof RegExp) {
      return expected.test(actual);
    } else if (actual instanceof expected) {
      return true;
    } else if (expected.call({}, actual) === true) {
      return true;
    }

    return false;
  }

  function _throws(shouldThrow, block, expected, message) {
    var actual;

    if (typeof expected === 'string') {
      message = expected;
      expected = null;
    }

    try {
      block();
    } catch (e) {
      actual = e;
    }

    message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
              (message ? ' ' + message : '.');

    if (shouldThrow && !actual) {
      fail('Missing expected exception' + message);
    }

    if (!shouldThrow && expectedException(actual, expected)) {
      fail('Got unwanted exception' + message);
    }

    var actualMessage = actual && (actual.message || actual.toString());
    if ((shouldThrow && actual && expected &&
        !expectedException(actualMessage, expected)) || (!shouldThrow && actual)) {
      throw actual;
    }
  }

  // 11. Expected to throw an error:
  // assert.throws(block, Error_opt, message_opt);

  assert.throws = function(block, /*optional*/error, /*optional*/message) {
    _throws.apply(this, [true].concat(pSlice.call(arguments)));
  };

  // EXTENSION! This is annoying to write outside this module.
  assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
    _throws.apply(this, [false].concat(pSlice.call(arguments)));
  };

  assert.ifError = function(err) { if (err) {throw err;}};

  return assert;
})();
// TODO: Beef this up for crappy browsers
(function (){
  if (typeof console === 'undefined'){ console = {}; }

  var funcs = ['log', 'dir', 'info', 'debug', 'error'];
  for (var i = 0; i < funcs.length; ++i){
    var func = funcs[i];
    if (!console[func]){
      console[func] = function (){ };
    }
  }
})();
if (typeof foounit.browser === 'undefined'){
  foounit.browser = {};
}

foounit.browser.XhrLoaderStrategy = function (){

  var xhr = function (){
    if (window.XMLHttpRequest) {
      return new window.XMLHttpRequest;
    } else {
      try {
        return new ActiveXObject("MSXML2.XMLHTTP.3.0");
      } catch(ex) {
        throw new Error('Could not get XmlHttpRequest object');
      }
    }
  };

  var get = function (uri){
    var request = xhr();
    request.open('GET', uri, false);
    request.send(null);
    if (request.status == 200){
      return request.responseText;
    }
    throw new Error('Failed XHR request to: ' + uri);
  };

  var dirname = function (file){
    var parts = file.split('/');
    if (parts.length > 1){
      return parts.slice(parts, parts.length - 2).join('/');
    } else {
      return '.';
    }
  };

  var basename = function (file){
    var parts = file.split('/');
    return parts[parts.length - 1];
  };

  var geval = function (src, hint){
    var g = foounit.hostenv.global;
    src += appendHint(src, hint);
    return (g.execScript) ? g.execScript(src) : g.eval.call(g, src);
  };

  var leval = function (src, hint){
    src = appendHint(src, hint);

    var ret;
    if (document.all){        // IE is slightly different
    eval('ret = ' + src);
    } else {
    ret = eval(src);
    }
    return ret;
  };

  var appendHint = function (src, hint){
    return src + "\r\n////@ sourceURL=" + hint;
  };

  /**
   * Implements lower level require responsible for syncronously getting code
   * and loading the code in CommonJS format with functional scope.
   */
  this.require = function (path){
    var code = get(path)
      , funcString = '(function (foounit, __dirname, __filename){' + code + '});';

    try {
      var func = leval(funcString, path);
      func.call({}, foounit, dirname(path), basename(path));
    } catch (e){
      console.error('Failed to load path: ' + path + ': ' + e.message, e);
    }

  };

  /** 
   * Implements low level require for synchronously running code in a global scope.
   */
  this.load = function (path){
    var code = get(path);
    geval(code, path);
    return true;
  };
};
(function (foounit){
  if (typeof foounit.browser === 'undefined'){
    foounit.browser = {};
  }

  var _loaded = {}
    , _loaderStrategy;

  var _loadCode = function (path, type){
    // FIXME: Kinda hacky
    if (path.match(/foounit$/) || path.match(/foounit-browser$/)){
      return foounit;
    }

    path = foounit.translatePath(path);
    if (!_loaded[path]){
      _loaded[path] = _loaderStrategy[type](path + '.js');
    }
    return _loaded[path];
  };

  /**
   * Set the strategy for synchronous dependency loading in functional scope (ala Node's require)
   */
  foounit.browser.setLoaderStrategy = function (strategy){
    _loaderStrategy = strategy;
  };

  /**
   * Load a javascript file in a functional scope
   */
  foounit.require = function (path){
    return _loadCode(path, 'require');
  };

  /**
   * Load a javascript file in the global scope
   */
  foounit.load = function (path){
    return _loadCode(path, 'load');
  };

  /**
   * Extracts the directory from a loaded script in the DOM
   *
   * @param pattern - A pattern used to locate the script source in the DOM
   */
  foounit.browser.dirname = function (pattern){
    var getDirectoryFromPath = function (path){
      var dir = path.split('/');
      dir.pop();
      return dir.join('/');
    }

    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; ++i){
      var script = scripts[i].src;
      if (script.match(pattern)){
        return getDirectoryFromPath(script);
      }
    }
  };

  /**
   * Reports the final results of the suite
   */
  foounit.report = function (info){
    foounit.ui.onFinish(info);

    // Used by jellyfish in CI environments
    window.testResults = info;
    window.jfComplete  = true;
  };

  /**
   * Report a single example
   */
  foounit.reportExample = (function (){
    var isUiInit = false; 

    return function (example){
      if (!isUiInit){
        foounit.ui.init();
        isUiInit = true;
      }

      try {
        if (example.isSuccess()){
          foounit.ui.onSuccess(example);
        } else if (example.isFailure()){
          foounit.ui.onFailure(example);
        } else if (example.isPending()){
          foounit.ui.onPending(example);
        }
      } catch (e){
        alert('foounit.reportExample: ' + e.message);
      }
    };
  })();

  /**
   * Convenience method for building and executing tests
   */
  foounit.run = function (){
    foounit.execute(foounit.build());
  };

})(foounit);

