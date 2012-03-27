// Copyright Bob Remeika 2011-forever

// This file consists of some host environment bootstrapping and discovery.
foounit = typeof foounit === 'undefined' ?  {} : foounit;

// Appends .hostenv and .mixin to foounit
(function (foounit){

  /**
   * Throws a bootstrapping error
   */
  var _throwError = function (message){
    throw new Error('foounit: bootstrap: ' + message);
  }

  /**
   * Requisite host environment params
   */
  foounit.hostenv = (function (){
    var _type = 'unknown';

    // Host environment is browser-like
    if (typeof window !== 'undefined'){
      _type = 'browser';
      _global = window;
    } else if (typeof global !== 'undefined'){
      _type = 'node';
      _global = global;
    } else {
      _throwError('Unrecognized environment');
    }

    return { type: _type, global: _global };
  })();

  /**
   * Does a shallow copy
   */
  foounit.mixin = function (target, source){
    for (var prop in source){
      if (source.hasOwnProperty(prop)){
        target[prop] = source[prop];
      }
    }
    return target;
  };

  /**
   * Default settings
   */
  foounit.defaults = {
    // Default timeout setting for waitFor keyword
    waitForTimeout: 5000
  };

  // TODO: Make settings configurable
  foounit.settings = {};
  foounit.mixin(foounit.settings, foounit.defaults);

  /**
   * Ressettable wrappers for your pleasure
   */
  foounit.setInterval   = function (func, interval) {
    return foounit.hostenv.global.setInterval(func, interval);
  };
  foounit.clearInterval = function (handle) {
    return foounit.hostenv.global.clearInterval(handle);
  };
  foounit.setTimeout    = function (func, timeout) {
    return foounit.hostenv.global.setTimeout(func, timeout)
  };
  foounit.clearTimeout  = function (handle) {
    return foounit.hostenv.global.clearTimeout(handle);
  };
  foounit.getTime       = function (){ return new Date().getTime(); };

  /**
   * Returns a function bound to a scope
   */
  foounit.bind = function (scope, func){
    return function (){
      return func.apply(scope, arguments);
    }
  }

  /**
   * Gets the test foounit.Suite object.  If the suite has
   * not been set then it creates a new test suite
   */
  var _suite;
  foounit.getSuite = function (){
    _suite = _suite || new foounit.Suite();
    return _suite;
  }

  /**
   * Function used while building up the tests
   */
  var _buildContext;
  foounit.setBuildContext = function (context){
    _buildContext = context;
  }

  foounit.getBuildContext = function (){
    _buildContext = _buildContext || new foounit.BuildContext();
    return _buildContext;
  }

  /**
   * Set the loader strategy
   */
  foounit.setLoaderStrategy = function (strategy){
  }

  /**
   * Mounts a special path for use in foounit.require and foounit.load
   */
  var _mounts = {};
  foounit.mount = function (key, path){
    _mounts[key] = path;
  }

  /**
   * Unmounts a special path to be used by foounit.require and foounit.load
   */
  foounit.unmount = function (key, path){
    delete _mounts[key];
  }

  /**
   * Returns the mount structure
   */
  foounit.getMounts = function (){
    return _mounts;
  }

  /**
   * Translates mounted paths into a physical path
   */
  foounit.translatePath = (function (){
    var regex = /:(\w+)/g;

    return function (path){
      var file = path.replace(regex, function (match, mount){
        return _mounts[mount] ? _mounts[mount] : match;
      });
      return file;
    }
  })();

  /**
   * Adds groups / tests to the root level ExampleGroup
   */
  foounit.add = function (func){
    var context = foounit.getBuildContext();
    context.setCurrentGroup(context.getRoot());
    func.call(context, foounit.keywords);
  }

  /**
   * Builds an array of tests to be run
   */
  foounit.build = function (){
    var befores = [], afters = [], descriptions = [];

    var addExamples = function (group){
      var examples = group.getExamples();
      for (var i = 0, ii = examples.length; i < ii; ++i){
        examples[i].setBefores(befores.concat());
        examples[i].setAfters(afters.concat());
        examples[i].setDescriptions(descriptions.concat());
        runners.push(examples[i]);
      }
    }

    var recurseGroup = function (group){
      befores.push(group.getBefore());
      afters.push(group.getAfter());
      descriptions.push(group.getDescription());

      addExamples(group);

      var groups = group.getGroups();
      for (var i = 0, ii = groups.length; i < ii; ++i){
        recurseGroup(groups[i]);
      }

      befores.pop();
      afters.pop();
      descriptions.pop();
    }

    var runners = [];

    var tic = new Date().getTime();
    recurseGroup(foounit.getBuildContext().getRoot());
    console.log('>> foounit build time: ', new Date().getTime() - tic);

    return runners;
  }

  /**
   * Report the results of a single example.  This is called
   * after an example has finished running and before the next
   * example begins.
   */
  foounit.reportExample = function (example){
    throw new Error('foounit.reportExample is abstract');
  }

  /**
   * Report the results of the entire test suite.
   */
  foounit.report = function (info){
    throw new Error('foounit.report is abstract');
  }

  /**
   * Executes an array of tests
   */
  foounit.execute = function (examples){
    var pending = []
      , passCount = 0, failCount = 0 
      , queue = new foounit.WorkQueue(examples);

    var tic = new Date().getTime();

    queue.onTaskComplete = function (example){
      try {
        if (example.isSuccess()){
          ++passCount;
        } else if (example.isFailure()){
          ++failCount;
        } else if (example.isPending()){
          pending.push(example.getFullDescription());
        }

        foounit.reportExample(example);
      } catch (e) {
        console.log('Error in onTaskComplete: ', e.message);
      }
    };

    queue.onComplete = function (queue){
      try {
        foounit.report({
          passCount:  passCount
        , failCount:  failCount
        , totalCount: passCount + failCount + pending.length
        , pending:    pending
        , runMillis:  new Date().getTime() - tic
        });
      } catch (e){
        console.log('Error in onComplete: ', e);
      }
    };

    queue.run();
  }

  /**
   * Private scope variable for hosting the foounit keywords
   */
  var _kwScope;

  /**
   * foounit keyword context
   */
  foounit.keywords = {};

  /**
   * Adds a keyword and some definition of functionality
   */
  foounit.addKeyword = function (keyword, definition){
    foounit.keywords[keyword] = definition;
    if (_kwScope){ _kwScope[keyword] = definition; }
  }

  /**
   * Removes a keyword from the foounit.keywords object
   * and from the kwScope
   */
  foounit.removeKeyword = function (keyword){
    delete foounit.keywords[keyword];
    if (_kwScope){ delete _kwScope[keyword]; }
  };

  (function (){

    // Return a matcher keyword suffix
    // keyword = haveBeenCalled returns HaveBeenCalled
    var sfix = function (keyword) {
      return keyword.substr(0, 1).toUpperCase() + keyword.substr(1)
    };

    /**
     * Adds a matcher
     */
    foounit.addMatcher = function (matcherKeyword, definition){
      foounit.addKeyword(matcherKeyword, definition);   // Add the keyword to the kw scope

      var suffix = sfix(matcherKeyword)
        , instance = new definition()
        , proto = foounit.Expectation.prototype;
      
      proto['to'    + suffix] = instance.match;
      proto['toNot' + suffix] = instance.notMatch;
    }

    /**
      * Removes a matcher
      */
    foounit.removeMatcher = function (matcherKeyword){
      foounit.removeKeyword(matcherKeyword);            // Remove the keyword from the kw scope

      var suffix = sfix(matcherKeyword)
        , proto = foounit.Expectation.prototype;
      
      delete proto['to'    + suffix];
      delete proto['toNot' + suffix];
    }

  })();

  /**
   * Puts all of the foounit keywords in the global scope
   */
  foounit.globalize = function (){
    return this.scope(this.hostenv.global);
  }

  /**
   * Mixes in all of the foounit keywords into scope object that was passed
   */
  foounit.scope = function (obj){
    _kwScope = obj ? foounit.mixin(obj, foounit.keywords) : obj;
    return this;
  }

  /**
   * Retrieve the object that was set for the keyword scope
   */
  foounit.getScope = function (){
    return _kwScope;
  };


})(foounit);

// If this is node then we need to mixin and include
// the node adapter immediately.
if (foounit.hostenv.type == 'node'){
  module.exports = foounit;
}
foounit.Suite = function (){
  this._files = [];
}

foounit.mixin(foounit.Suite.prototype, {
  addPattern: function (){}

  , addFile: function (file){
    this._files.push(file);
  } 

  , run: function (){
    var self = this;

    var files = self._files;
    for (var i = 0; i < files.length; ++i){
      var file = files[i].replace(/\.js$/, '');
      foounit.require(file);
    }
    console.log('>> foounit building...');
    foounit.execute(foounit.build());
  }

  , getFiles: function (){
    return this._files;
  }
});
foounit.BuildContext = function (){
  this,_currentGroup = undefined;
  this._currentExample = undefined;
  this._root = undefined;
};

foounit.mixin(foounit.BuildContext.prototype, {
  getRoot: function (){
    this._root = this._root || new foounit.ExampleGroup('root', function (){});
    return this._root;
  }

  , setCurrentGroup: function (group){
    this._currentGroup = group;
  }

  , getCurrentGroup: function (){
    if (!this._currentGroup){
      this.setCurrentGroup(this.getRoot());
    }
    return this._currentGroup;
  }

  , setCurrentExample: function (example){
    this._currentExample = example;
  }

  , getCurrentExample: function (){
    return this._currentExample;
  }
});
foounit.WorkQueue = function (tasks){
  this._tasks = tasks ? tasks.concat() : [];
}

foounit.mixin(foounit.WorkQueue.prototype, {
  run: function (){
    this._runNext();
  }

  , enqueue: function (task){
    this._tasks.push(task);
  }

  , enqueueAll: function (tasks){
    this._tasks = this._tasks.concat(tasks);
  }

  , dequeue: function (){
    return this._tasks.shift();
  }

  , size: function (){
    return this._tasks.length;
  }

  , peekNext: function (){
    return this._tasks[0];
  }

  , runTask: function (task){
    task.onComplete = foounit.bind(this, this._onTaskComplete);
    task.onFailure = foounit.bind(this, this._onTaskFailure);
    foounit.setTimeout(function (){
      task.run();
    }, 0);
  }

  , stop: function (){
    this._tasks = [];
  }

  // Replace function to receive event
  , onTaskComplete: function (task){}

  // Replace function to receive event
  , onTaskFailure: function (task){}

  // Replace function to receive event
  , onComplete: function (queue){}

  , _onTaskFailure: function (task){
    this.onTaskFailure(task);
  }

  , _onTaskComplete: function (task){
    this.onTaskComplete(task);
    this._runNext();
  }

  , _runNext: function (){
    var task = this.dequeue();
    if (task){
      this.runTask(task);
    } else {
      this.onComplete(this);
    }
  }
});
/**
 *  A queue designed to run blocks but also to look like a task in a queue
 */

foounit.BlockQueue = function (example){
  this._example = example;
  this._tasks = [];
  this._exception = undefined;
}

foounit.mixin(foounit.BlockQueue.prototype, foounit.WorkQueue.prototype);

foounit.mixin(foounit.BlockQueue.prototype, {
  onFailure: function (blockQueue){}
  , onComplete: function (blockQueue){}

  , getException: function (){
    return this._exception;
  }

  , _onTaskFailure: function (task){
    this._exception = task.getException();
    this.stop();
    this.onFailure(this);
  }
});

// FIXME: This is a little hacky
(function (foounit){
  var origRunTask = foounit.BlockQueue.prototype.runTask;
  foounit.BlockQueue.prototype.runTask = function (task){
    this._example.setCurrentBlockQueue(this); 
    origRunTask.apply(this, arguments);
  };
})(foounit);
foounit.Block = function (func){
  this._func = func;
  this._exception = undefined;
}

foounit.mixin(foounit.Block.prototype, {
  onComplete: function (block){}
  , onFailure: function (block){}
  , getException: function (){ return this._exception; }

  , run: function (){
    var runContext = {};

    try {
      this._func.apply(runContext, []);
      this.onComplete(this);
    } catch (e){
      this._exception = e;
      this.onFailure(this);
    }
  }
});
foounit.PollingBlock = function (func, timeout){
  this._func = func;
  this._tasks = [];
  this._timeout = timeout;
  this._exception = undefined;
  this._pollInterval = 50;
};

foounit.mixin(foounit.PollingBlock.prototype, foounit.BlockQueue.prototype);
foounit.mixin(foounit.PollingBlock.prototype, {
  getTimeout: function (){ return this._timeout; }

  , run: function (){
    var self = this
      , start = foounit.getTime()
      , interval;

    interval = foounit.setInterval(function (){
      try {
        self._func.apply({}, []);
        foounit.clearInterval(interval);
        self.onComplete(self);
      } catch (e){
        if (foounit.getTime() - start >= self._timeout){
          foounit.clearInterval(interval);
          e.message = 'waitFor timeout: ' + e.message;
          self._exception = e;
          self.onFailure(self);
        }
      }
    }, this._pollInterval);
  }
});

foounit.TimeoutBlock = function (func, timeout){
  this._func = func;
  this._tasks = [];
  this._timeout = timeout;
  this._exception = undefined;
  this._pollInterval = 50;
};

foounit.mixin(foounit.TimeoutBlock.prototype, foounit.BlockQueue.prototype);
foounit.mixin(foounit.TimeoutBlock.prototype, {
  getTimeout: function (){ return this._timeout; }

  , run: function (){
    var self = this
      , start = foounit.getTime()
      , passed = true
      , interval;

    interval = foounit.setInterval(function (){
      try {
        self._func.apply({}, []);
        foounit.clearInterval(interval);
        self._exception = new Error('timeout was not reached');
        self.onFailure(self);
      } catch (e){
        if (foounit.getTime() - start > self._timeout){
          foounit.clearInterval(interval);
          self.onComplete(self);
        }
      }
    }, this._pollInterval);
  }
});

foounit.Example = function (description, test, pending){
  this._befores = [];
  this._test = test;
  this._afters  = [];
  this._description = description;
  this._descriptions = [];
  this._currentBlockQueue = undefined;

  this._status = 0;
  this._exception = undefined;

  if (pending === true) {
    this._status = this.PENDING;
  }
}

foounit.mixin(foounit.Example.prototype, {
  SUCCESS:    1
  , FAILURE:  2
  , PENDING:  3

  , onComplete: function (example){}

  // Key events in the run lifecycle
  , onBeforesComplete: function (){}
  , onBeforesFailure: function (failedAt){}
  , onTestComplete: function (){}
  , onAftersComplete: function (){}

  , setCurrentBlockQueue: function (blockQueue){
    this._currentBlockQueue = blockQueue;
  }

  , getCurrentBlockQueue: function (){
    return this._currentBlockQueue;
  }

  , run: function (){
    foounit.getBuildContext().setCurrentExample(this);

    if (this.isPending()){
      this.onComplete(this);
      return;
    }
    this._status = this.SUCCESS;


    var self = this;

    this.onBeforesComplete = function (failedAt){
      self._runTest();
    };

    this.onBeforesFailure = function (failedAt){
      this._runAfters(failedAt);
    };

    this.onTestComplete = function (){
      self._runAfters();
    };

    this.onAftersComplete = foounit.bind(this, function (){
      foounit.getBuildContext().setCurrentExample(undefined);
      foounit.resetMocks();
      self.onComplete(self);
    });

    this._runBefores();
  }

  , enqueue: function (block){
    this._currentBlockQueue.enqueue(block);
  }

  // TODO: Refactor, before, after and it should all return BlockQueues
  , _enqueueBlocks: function (funcs){
    for (var i = 0; i < funcs.length; ++i){
      var func = funcs[i] || function (){}
        , blockQueue = new foounit.BlockQueue(this)
        , block = new foounit.Block(func);

      blockQueue.enqueue(block);
      this._queue.enqueue(blockQueue);
    }
  }

  , _runBefores: function (){
    var self = this
      , index = 0;

    this._queue = new foounit.WorkQueue();

    this._queue.onComplete = function (){
      self.onBeforesComplete();
    };

    // This index stuff is a little janky
    this._queue.onTaskComplete = function (blockQueue){
      ++index;
    }

    this._queue.onTaskFailure = function (blockQueue){
      self._status = self.FAILURE;
      self._exception = blockQueue.getException();
      self._queue.stop();
      self.onBeforesFailure(index);
    };

    this._enqueueBlocks(this._befores);
    this._queue.run();
  }

  , _runAfters: function (fromIndex){
    var self = this
      , afters = this._afters;

    fromIndex = fromIndex || afters.length;
    afters.reverse();
    afters = afters.slice(afters.length - fromIndex);

    this._queue = new foounit.WorkQueue();

    this._queue.onComplete = function (){
      self.onAftersComplete();
    };

    this._queue.onTaskFailure = function (task){
      if (self._status !== self.FAILURE){
        self._status = self.FAILURE;
        self._exception = task.getException();
      }
      task.onComplete(task);
    }

    this._enqueueBlocks(afters);
    this._queue.run();
  }

  , _runTest: function (){
    var self = this;

    this._queue = new foounit.WorkQueue();

    this._queue.onTaskFailure = function (blockQueue){
      self._status = self.FAILURE;
      self._exception = blockQueue.getException();
      self.onTestComplete();
    };

    this._queue.onComplete = function (){
      self.onTestComplete();
    };

    this._enqueueBlocks([this._test]);
    this._queue.run();
  }

  , getStack: function (){
    var e = this.getException();

    // TODO: We need to do a lot better than this 
    return e.stack || e.stacktrace || e.sourceURL + ':' + e.line;
  }

  , isSuccess: function (){
    return this._status === this.SUCCESS;
  }

  , isFailure: function (){
    return this._status === this.FAILURE;
  }

  , isPending: function (){
    return this._status === this.PENDING;
  }

  , getException: function (){
    return this._exception;
  }

  , setBefores: function (befores){
    this._befores = befores;
  }

  , getDescription: function (){
    return this._description;
  }

  , getFullDescription: function (){
    var descriptions = this._descriptions.concat();
    descriptions.shift();
    descriptions.push(this.getDescription());
    return descriptions.join(' ');
  }

  , getDescriptions: function (){
    return this._descriptions;
  }

  , setDescriptions: function (descriptions){
    this._descriptions = descriptions;
  }

  , getBefores: function (){ return this._befores; }

  , setAfters: function (afters){
    this._afters = afters;
  }

  , getAfters: function (){
    return this._afters;
  }

  , getTest: function (){
    return this._test;
  }

  , setStatus: function (code){
    this._status = code;
  }
});
foounit.ExampleGroup = function (description, builder, pending){
  this._description = description;
  this._builder = builder;
  this._pending = pending;
  this._before = null;
  this._after = null;
  this._examples = [];
  this._groups = [];
}

foounit.mixin(foounit.ExampleGroup.prototype, {
  build: function (){
    this._builder();
  }

  , getExamples: function (){
    return this._examples;
  }

  , addExample: function (example){
    if (this.isPending()){
      example.setStatus(foounit.Example.prototype.PENDING);
    }
    this._examples.push(example);
  }

  , addGroup: function (group){
    if (this.isPending()){
      group.setPending(true);
    }
    this._groups.push(group);
  }

  , setAfter: function (func){
    this._after = func;
  }

  , getAfter: function (){
    return this._after;
  }

  , setBefore: function (func){
    this._before = func;
  }

  , getBefore: function (){
    return this._before;
  }

  , getGroups: function (){
    return this._groups;
  }

  , getDescription: function (){
    return this._description;
  }

  , isPending: function (){
    return this._pending;
  }

  , setPending: function (bool){
    this._pending = bool;
  }
});
foounit.Expectation = function (actual){
  this._actual = actual;
}

foounit.mixin(foounit.Expectation.prototype, {
  to: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.match(this._actual, expected);
  }

  , toNot: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.notMatch(this._actual, expected);
  }
});
/**
 * Creates an example to be added to the current group in the BuildContext
 */
foounit.addKeyword('it', function (description, test){
  var example = new foounit.Example(description, test);
  foounit
    .getBuildContext()
    .getCurrentGroup()
    .addExample(example);
  return example;
});

/**
 * Creates a pending example
 */
foounit.addKeyword('xit', function (description, test){
  var example = new foounit.Example(description, test, true);
  foounit
    .getBuildContext()
    .getCurrentGroup()
    .addExample(example);
  return example;
});

/** Alias for xit **/
foounit.addKeyword('fuckit', foounit.keywords.xit);

/**
 * Defines a before function in the context of the current group
 */
foounit.addKeyword('before', function (func){
  var group = foounit.getBuildContext().getCurrentGroup();
  group.setBefore(func);
});

/**
 * Defines an after function in the context of the current group
 */
foounit.addKeyword('after', function (func){
  var group = foounit.getBuildContext().getCurrentGroup();
  group.setAfter(func);
});

/**
 * Defines a group in the BuildContext
 */
foounit.addKeyword('describe', function (description, builder){
  var context = foounit.getBuildContext()
    , parentGroup = context.getCurrentGroup()
    , group = new foounit.ExampleGroup(description, builder);

  parentGroup.addGroup(group);

  context.setCurrentGroup(group);
  group.build();
  context.setCurrentGroup(parentGroup);
});

/*
 * Defines a pending group in the BuildContext.
 * All examples and nested groups within this group will
 * be marked as pending.
 */
foounit.addKeyword('xdescribe', function (description, builder){
  var context = foounit.getBuildContext()
    , parentGroup = context.getCurrentGroup()
    , group = new foounit.ExampleGroup(description, builder, true);

  parentGroup.addGroup(group);

  context.setCurrentGroup(group);
  group.build();
  context.setCurrentGroup(parentGroup);
  return group;
});

/**
 * Creates a foounit.Expectation
 */
foounit.addKeyword('expect', function (actual){
  return new foounit.Expectation(actual);
});

/**
 * Adds a polling block to the current block queue
 */
foounit.addKeyword('waitFor', function (func, timeout){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.PollingBlock(func, timeout || foounit.settings.waitForTimeout);
  
  example.enqueue(block);
  return block;
});

/**
 * Adds a TimeoutBlock to the current block queue
 */
foounit.addKeyword('waitForTimeout', function (func, timeout){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.TimeoutBlock(func, timeout || foounit.settings.waitForTimeout);

  example.enqueue(block);
  return block;
});


/**
 * Adds a RunBlock to the current block queue that fails the test if it throws
 */
foounit.addKeyword('run', function (func){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.Block(func);

  example.enqueue(block);
  return block;
});
if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

/**
 * Asserts that a function throws an error
 */
foounit.addMatcher('throwError', function (){
  this.match = function (actual, expected){
    // actual == block
    // expected == error
    assert.throws(actual, expected);
  }

  this.notMatch = function (actual, expected){
    // actual == block
    // expected == error
    assert.doesNotThrow(actual, expected);
  }
});

/**
 * Asserts type and object
 */
foounit.addMatcher('be', function (){
  this.match = function (actual, expected){
    assert.strictEqual(actual, expected);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, expected);
  }
});

/**
 * Asserts that actual === null
 */
foounit.addMatcher('beNull', function (){
  this.match = function (actual){
    assert.strictEqual(actual, null);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, null);
  }
});

/**
 * Asserts that actual === undefined
 */
foounit.addMatcher('beUndefined', function (){
  this.match = function (actual){
    assert.strictEqual(actual, undefined);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, undefined);
  }
});

/**
 * Assert that actual is greater than expected
 */
foounit.addMatcher('beGt', function (){
  this.match = function (actual, expected){
    if (actual > expected){ return; }
    assert.fail(actual, expected, null, '>');
  }

  this.notMatch = function (actual, expected){
    if (actual <= expected){ return; }
    assert.fail(actual, expected, null, '<=');
  }
});

/**
 * Assert that actual is less than expected
 */
foounit.addMatcher('beLt', function (){
  this.match = function (actual, expected){
    if (actual < expected){ return; }
    assert.fail(actual, expected, null, '<');
  }

  this.notMatch = function (actual, expected){
    if (actual >= expected){ return };
    assert.fail(actual, expected, null, '>=');
  }
});

/**
 * Asserts true === actual
 */
foounit.addMatcher('beTrue', function (){
  // expected is unused
  this.notMatch = function (actual){
    assert.notStrictEqual(actual, true);
  }

  // expected is unused
  this.match = function (actual){
    assert.strictEqual(actual, true);
  }
});

/**
 * Asserts that actual is truthy
 */
foounit.addMatcher('beTruthy', function (){
  this.notMatch = function (actual){
    if (!actual){ return };
    assert.fail('Expected "' + actual + '" to NOT be truthy');
  }

  this.match = function (actual){
    if (actual){ return; }
    assert.fail('Expected "' + actual + '" to be truthy');
  }
});

/**
 * Asserts true === actual
 */
foounit.addMatcher('beFalse', function (){
  // expected is unused
  this.notMatch = function (actual){
    assert.notStrictEqual(actual, false);
  }

  // expected is unused
  this.match = function (actual){
    assert.strictEqual(actual, false);
  }
});

/**
 * Asserts that actual is falsy
 */
foounit.addMatcher('beFalsy', function (){
  this.notMatch = function (actual){
    if (actual){ return; }
    assert.fail('Expected "' + actual + '" to NOT be falsy');
  }

  this.match = function (actual){
    if (!actual){ return; }
    assert.fail('Expected "' + actual + '" to be falsy');
  }
});

/**
 * Asserts deep equality
 */
foounit.addMatcher('equal', function (){
  var pSlice = Array.prototype.slice;

  var isArguments = function (value){
    return value && !!value.callee;
  }

  var exec = function (actual, expected, not){
    if (isArguments(actual)){
      actual = pSlice.call(actual);
    }

    if (isArguments(expected)){
      expected = pSlice.call(expected);
    }

    var deepEqualFunc = not ? 'notDeepEqual' : 'deepEqual';
    assert[deepEqualFunc](expected, actual);
  }

  this.match = function (actual, expected){
    exec(actual, expected, false);
  }

  this.notMatch = function (actual, expected){
    exec(actual, expected, true);
  }
});

/**
 * Asserts that actual has an element that === expected
 */
foounit.addMatcher('include', function (){
  var find = function (actual, expected){
    if (!expected || (expected.constructor != Array && !expected.callee)){
      expected = [expected];
    }

    for (var i = 0; i < expected.length; ++i){
      var found = false;
      for (var j = 0; j < actual.length; ++j){
        if (expected[i] === actual[j]){
          found = true;
          break;
        }
      }
      if (!found){ return false; }
    }

    return true;
  }

  this.notMatch = function (actual, expected){
    if (!find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is included in');
  }

  this.match = function (actual, expected){
    if (find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is not included in');
  }
});

foounit.addMatcher('match', function (){
  this.notMatch = function (actual, expected){
    if (!expected.exec(actual)){ return; }
    assert.fail(actual, expected, null, expected + ' matches');
  }

  this.match = function (actual, expected){
    if (expected.exec(actual)){ return; }
    assert.fail(actual, expected, null, expected + ' does not match');
  }
});

if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

(function (foounit){
  var pSlice = Array.prototype.slice;

  var MockRepository = function (){
    this._mocks = [];

    this.add = function (obj, funcStr){
      this._mocks.push([ obj, funcStr, obj[funcStr] ]);
    };

    this.reset = function (){
      var mocks = this._mocks;
      for (var i = mocks.length - 1; i >= 0; --i){
        var mock = mocks[i];
        // reset to original function
        mock[0][mock[1]] = mock[2];
      }
    };
  }

  var repo = new MockRepository();
  
  foounit.addKeyword('mock', function (obj, funcStr, stubFunc){
    if (arguments.length == 1 && typeof obj == 'function'){
      obj = { callback: obj };
      funcStr = 'callback';
      stubFunc = obj.callback;
    }

    if (!obj[funcStr]){
      throw new Error('"' + funcStr + '" is not a function that can be mocked');
    }

    repo.add(obj, funcStr);

    obj[funcStr] = function (){
      var f = obj[funcStr];
      f.totalCalls = f.totalCalls !== undefined ? ++f.totalCalls : 1;
      f.callArgs   = f.callArgs || [];

      var args = pSlice.call(arguments, 0);
      f.callArgs.push(args.concat());
      f.mostRecentArgs = args.concat();

      if (stubFunc){
        return stubFunc.apply(this, arguments);
      }
    }

    obj[funcStr].isMocked = true;

    return obj[funcStr];
  });

  foounit.addKeyword('haveBeenCalled', function (){
    var equalMatcher = new foounit.keywords.equal();

    function format(actualCount, expectedCount, not){
      var notStr = not ? ' not' : '';
      actualCount = actualCount || 0;
      return 'mock was called ' + actualCount +
        ' times, but was' + notStr + ' expected ' + expectedCount + ' times';
    };

    function assertMocked(func){
      if (func.isMocked){ return; }
      throw new Error('Function has not been mocked');
    }

    function wasCalledWithArgs(callArgs, expectedArgs){
      if (!callArgs){ return; }

      for (var i = 0; i < callArgs.length; ++i){
        try {
          equalMatcher.match(callArgs[i], expectedArgs);
          return true;
        } catch (e){}
      }
      return false;
    };

    this.match = function (mockedFunc, countOrArgs){
      assertMocked(mockedFunc);

      countOrArgs = countOrArgs || 1;

      if (countOrArgs.length !== undefined){
        if (wasCalledWithArgs(mockedFunc.callArgs, countOrArgs)){ return; }
        throw new Error('Function was not called with arguments: ' + countOrArgs);
      } else {
        assert.strictEqual(
         mockedFunc.totalCalls 
          , countOrArgs
          , format(mockedFunc.totalCalls, countOrArgs)
        );
      }
    }

    this.notMatch = function (mockedFunc, countOrArgs){
      assertMocked(mockedFunc);

      countOrArgs = countOrArgs || 1;

      if (countOrArgs.length !== undefined){
        if (!wasCalledWithArgs(mockedFunc.callArgs, countOrArgs)){ return; }
        throw new Error('Function was called with arguments: ' + countOrArgs);
      } else {
        assert.notStrictEqual(
         mockedFunc.totalCalls 
          , countOrArgs
          , format(mockedFunc.totalCalls, countOrArgs, true)
        );
      }
    }
  });

  foounit.addKeyword('withArgs', function (){
    return Array.prototype.slice.call(arguments, 0);
  });

  foounit.addKeyword('once',   1);
  foounit.addKeyword('twice',  2); 
  foounit.addKeyword('thrice', 3);

  foounit.resetMocks = function (){
    repo.reset();
  };
})(foounit);
