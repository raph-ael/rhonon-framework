
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function dispatchWinDocEvent(eventName, moduleName) {
  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var fullEventName = "".concat(eventName, ".ph.").concat(moduleName);
  window.dispatchEvent(new CustomEvent(fullEventName, {
    detail: detail
  }));
  document.dispatchEvent(new CustomEvent(fullEventName, {
    detail: detail
  }));
}
function dispatchElementEvent(domElement, eventName, moduleName) {
  var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var fullEventName = "".concat(eventName, ".ph.").concat(moduleName);
  domElement.dispatchEvent(new CustomEvent(fullEventName, {
    detail: detail
  }));
}

function generateId() {
  return Math.random().toString(36).substr(2, 10);
}
function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target;
    }
  }

  return null;
}

// @todo keep ?
if (typeof window !== 'undefined') {
  window.addEventListener('error', function () {
    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
  });
} // Use available events


var availableEvents = ['mousedown', 'mousemove', 'mouseup'];
var touchScreen = false;

if (typeof window !== 'undefined') {
  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    touchScreen = true;
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
  }
}

var el = document.createElement('div');
var transitions = [{
  name: 'transition',
  start: 'transitionstart',
  end: 'transitionend'
}, {
  name: 'MozTransition',
  start: 'transitionstart',
  end: 'transitionend'
}, {
  name: 'msTransition',
  start: 'msTransitionStart',
  end: 'msTransitionEnd'
}, {
  name: 'WebkitTransition',
  start: 'webkitTransitionStart',
  end: 'webkitTransitionEnd'
}];
var animations = [{
  name: 'animation',
  start: 'animationstart',
  end: 'animationend'
}, {
  name: 'MozAnimation',
  start: 'animationstart',
  end: 'animationend'
}, {
  name: 'msAnimation',
  start: 'msAnimationStart',
  end: 'msAnimationEnd'
}, {
  name: 'WebkitAnimation',
  start: 'webkitAnimationStart',
  end: 'webkitAnimationEnd'
}];
var transitionStart = transitions.find(function (t) {
  return el.style[t.name] !== undefined;
}).start;
var transitionEnd = transitions.find(function (t) {
  return el.style[t.name] !== undefined;
}).end;
var animationStart = animations.find(function (t) {
  return el.style[t.name] !== undefined;
}).start;
var animationEnd = animations.find(function (t) {
  return el.style[t.name] !== undefined;
}).end;
var Event = {
  // touch screen support
  TOUCH_SCREEN: touchScreen,
  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',
  NETWORK_RECONNECTING: 'reconnecting',
  NETWORK_RECONNECTING_SUCCESS: 'reconnect.success',
  NETWORK_RECONNECTING_FAILURE: 'reconnect.failure',
  // user interface states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',
  // hash
  HASH: 'hash',
  // touch, mouse and pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],
  // click
  CLICK: 'click',
  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,
  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,
  // selectbox
  ITEM_SELECTED: 'itemSelected'
};

var getAttribute = function getAttribute(first, second) {
  if (first === '') {
    return "data-".concat(second);
  }

  return "data-".concat(first, "-").concat(second);
};

function setAttributesConfig(element) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attrs = arguments.length > 2 ? arguments[2] : undefined;
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var keys = Object.keys(obj);
  keys.forEach(function (key) {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
      var keyStart = key;

      if (start !== '') {
        keyStart = "".concat(start, "-").concat(key);
      }

      setAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    var attr = getAttribute(start, key);
    element.setAttribute(attr, obj[key]);
  });
}
function getAttributesConfig(element) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attrs = arguments.length > 2 ? arguments[2] : undefined;
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  // copy object
  var newObj = Object.assign({}, obj);
  var keys = Object.keys(obj);
  keys.forEach(function (key) {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (obj[key] !== null && obj[key].constructor === Object) {
      var keyStart = key;

      if (start !== '') {
        keyStart = "".concat(start, "-").concat(key);
      }

      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    } // update value


    var value = obj[key]; // default value

    var type = _typeof(value);

    var attr = getAttribute(start, key);
    var attrValue = element.getAttribute(attr);

    if (attrValue !== null) {
      if (type === 'boolean') {
        // convert string to boolean
        value = attrValue === 'true';
      } else if (/^-{0,1}\d+$/.test(attrValue)) {
        value = parseInt(attrValue, 10);
      } else {
        value = attrValue;
      }
    }

    newObj[key] = value;
  });
  return newObj;
}

if (!Array.isArray(document.componentStack)) {
  document.componentStack = [];
}

var ComponentManager = {
  add: function add(component) {
    document.componentStack.push(component);
  },
  remove: function remove(component) {
    var index = document.componentStack.findIndex(function (c) {
      return Object.is(component, c);
    });

    if (index > -1) {
      document.componentStack.splice(index, 1);
    }
  },
  closable: function closable(component) {
    return document.componentStack.length === 0 || Object.is(document.componentStack[document.componentStack.length - 1], component);
  }
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Component =
/*#__PURE__*/
function () {
  function Component(name, version) {
    var _this = this;

    var defaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var optionAttrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var supportDynamicElement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var addToStack = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    _classCallCheck(this, Component);

    this.name = name;
    this.version = version;
    this.options = options;
    this.eventHandlers = [];
    Object.keys(defaultOptions).forEach(function (prop) {
      if (typeof _this.options[prop] === 'undefined') {
        _this.options[prop] = defaultOptions[prop];
      }
    });
    this.optionAttrs = optionAttrs;
    this.supportDynamicElement = supportDynamicElement;
    this.addToStack = addToStack;
    this.id = generateId();
    var checkElement = !this.supportDynamicElement || this.options.element !== null;

    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element);
    }

    if (checkElement && !this.options.element) {
      throw new Error("".concat(this.name, ". The element is not a valid HTMLElement."));
    }

    this.dynamicElement = this.options.element === null;
    this.registeredElements = [];

    if (!this.dynamicElement) {
      /**
       * if the element exists, we read the data attributes config
       * then we overwrite existing config keys defined in JavaScript, so that
       * we keep the following order
       * [1] default JavaScript configuration of the component
       * [2] Data attributes configuration
       * [3] JavaScript configuration
       */
      this.updateConfig(this.options);
    }

    this.addEventsHandler(this.getConfig());

    this.elementListener = function (event) {
      return _this.onBeforeElementEvent(event);
    };
  }

  _createClass(Component, [{
    key: "getConfig",
    value: function getConfig() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      /**
       * If the key isn't specified, we return the full configuration (Object)
       */
      if (!key) {
        return this.options;
      }

      return typeof this.options[key] === 'undefined' ? defaultValue : this.options[key];
    }
  }, {
    key: "updateConfig",
    value: function updateConfig(options) {
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), options)); // then, set the new data attributes to the element

      this.setAttributes();
    }
  }, {
    key: "addEventsHandler",
    value: function addEventsHandler(options) {
      var scope = Object.keys(options).reduce(function (cur, key) {
        if (typeof options[key] === 'function') {
          cur[key] = options[key];
        }

        return cur;
      }, {});

      if (Object.keys(scope).length > 0) {
        this.eventHandlers.push(scope);
      }
    }
  }, {
    key: "assignJsConfig",
    value: function assignJsConfig(attrConfig, jsConfig) {
      var config = attrConfig;
      this.optionAttrs.forEach(function (key) {
        if (typeof jsConfig[key] !== 'undefined') {
          config[key] = jsConfig[key];
        }
      });
      return config;
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return this.version;
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.options.element;
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "registerElements",
    value: function registerElements(elements) {
      var _this2 = this;

      elements.forEach(function (element) {
        return _this2.registerElement(element);
      });
    }
  }, {
    key: "registerElement",
    value: function registerElement(element) {
      element.target.addEventListener(element.event, this.elementListener);
      this.registeredElements.push(element);
    }
  }, {
    key: "unregisterElements",
    value: function unregisterElements() {
      var _this3 = this;

      this.registeredElements.forEach(function (element) {
        _this3.unregisterElement(element);
      });
    }
  }, {
    key: "unregisterElement",
    value: function unregisterElement(element) {
      var registeredElementIndex = this.registeredElements.findIndex(function (el) {
        return el.target === element.target && el.event === element.event;
      });

      if (registeredElementIndex > -1) {
        element.target.removeEventListener(element.event, this.elementListener);
        this.registeredElements.splice(registeredElementIndex, 1);
      } else {
        console.error("Warning! Unknown registered element: ".concat(element.target, " with event: ").concat(element.event, "."));
      }
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent(eventName) {
      var _this4 = this;

      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var objectEventOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (typeof eventName !== 'string') {
        throw new Error('The event name is not valid.');
      }

      if (this.addToStack) {
        if (eventName === Event.SHOW) {
          ComponentManager.add(this);
        } else if (eventName === Event.HIDE) {
          ComponentManager.remove(this);
        }
      } // event names can be with dot notation like reconnecting.success


      var eventNameObject = eventName.split('.').reduce(function (acc, current, index) {
        if (index === 0) {
          return current;
        }

        return acc + current.charAt(0).toUpperCase() + current.slice(1);
      });
      var eventNameAlias = "on".concat(eventNameObject.charAt(0).toUpperCase()).concat(eventNameObject.slice(1)); // object event

      this.eventHandlers.forEach(function (scope) {
        if (typeof scope[eventNameObject] === 'function') {
          scope[eventNameObject].apply(_this4, [detail]);
        }

        if (typeof scope[eventNameAlias] === 'function') {
          _this4.options[eventNameAlias].apply(_this4, [detail]);
        }
      });

      if (objectEventOnly) {
        return;
      } // dom event


      if (this.options.element) {
        dispatchElementEvent(this.options.element, eventName, this.name, detail);
      } else {
        dispatchWinDocEvent(eventName, this.name, detail);
      }
    }
  }, {
    key: "setAttributes",
    value: function setAttributes() {
      if (this.optionAttrs.length > 0) {
        setAttributesConfig(this.options.element, this.options, this.optionAttrs);
      }
    }
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      var options = Object.assign({}, this.options);
      return getAttributesConfig(this.options.element, options, this.optionAttrs);
    }
    /**
     * the preventClosable method manages concurrency between active components.
     * For example, if there is a shown off-canvas and modal, the last
     * shown component gains the processing priority
     */

  }, {
    key: "preventClosable",
    value: function preventClosable() {
      return this.addToStack && !ComponentManager.closable(this);
    }
  }, {
    key: "onBeforeElementEvent",
    value: function onBeforeElementEvent(event) {
      if (this.preventClosable()) {
        return;
      }

      this.onElementEvent(event);
    }
    /**
     * @emits {Event} emit events registered by the component
     * @param {Event} event
     */

  }, {
    key: "onElementEvent",
    value: function onElementEvent() {
      /* eslint class-methods-use-this: 0 */
    }
  }], [{
    key: "identifier",
    value: function identifier() {
      return this.name;
    }
  }, {
    key: "DOMInterface",
    value: function DOMInterface(ComponentClass, options) {
      var currentComponents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var el = typeof options.element === 'string' ? document.querySelector(options.element) : options.element;
      var component = currentComponents.find(function (c) {
        return c.getElement() === el;
      });

      if (component) {
        component.updateConfig(options);
        component.addEventsHandler(options);
        return component;
      }

      return new ComponentClass(options);
    }
  }]);

  return Component;
}();

var Selectbox = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'selectbox';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    selectable: true,
    search: false,
    filterItems: null
  };
  var DATA_ATTRS_PROPERTIES = ['selectable', 'search'];
  var components = [];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Selectbox =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Selectbox, _Component);

    function Selectbox() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Selectbox);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Selectbox).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      var selected = _this.options.element.querySelector('[data-selected]');

      var item = _this.getItemData(selected);

      _this.setSelected(item.value, item.text, false);

      return _this;
    }

    _createClass(Selectbox, [{
      key: "setSelected",
      value: function setSelected() {
        var _this2 = this;

        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var checkExists = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (!this.options.selectable) {
          return false;
        }

        var textDisplay = text;
        this.options.element.querySelector('.default-text').innerHTML = text;
        this.options.element.querySelector('input[type="hidden"]').value = value;
        var items = this.options.element.querySelectorAll('.item') || [];
        var itemFound = false;
        Array.from(items).forEach(function (item) {
          if (item.classList.contains('selected')) {
            item.classList.remove('selected');
          }

          var data = _this2.getItemData(item);

          if (value === data.value) {
            if (!item.classList.contains('selected')) {
              item.classList.add('selected');
            }

            textDisplay = data.text;
            itemFound = true;
          }
        });

        if (checkExists && itemFound) {
          this.options.element.querySelector('.default-text').innerHTML = textDisplay;
        } else if (checkExists && !itemFound) {
          throw new Error("".concat(NAME, ". The value \"").concat(value, "\" does not exist in the list of items."));
        }

        return true;
      }
    }, {
      key: "getSelected",
      value: function getSelected() {
        return this.options.element.querySelector('input[type="hidden"]').value;
      }
    }, {
      key: "getItemData",
      value: function getItemData() {
        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var text = '';
        var value = '';

        if (item) {
          text = item.getAttribute('data-text') || item.innerHTML;
          var selectedTextNode = item.querySelector('.text');

          if (selectedTextNode) {
            text = selectedTextNode.innerHTML;
          }

          value = item.getAttribute('data-value') || '';
        }

        return {
          text: text,
          value: value
        };
      }
    }, {
      key: "onElementEvent",
      value: function onElementEvent(event) {
        if (event.type === Event.START) {
          var selectbox = findTargetByClass(event.target, 'selectbox');
          /*
           * hide the current selectbox only if the event concerns another selectbox
           * hide also if the user clicks outside a selectbox
           */

          if (!selectbox || selectbox !== this.getElement()) {
            this.hide();
          }
        } else if (event.type === 'click') {
          var item = findTargetByClass(event.target, 'item');

          if (item) {
            if (item.classList.contains('disabled')) {
              return;
            }

            var itemInfo = this.getItemData(item);

            if (this.getSelected() !== itemInfo.value) {
              // the user selected another value, we dispatch the event
              this.setSelected(itemInfo.value, itemInfo.text, false);
              var detail = {
                item: item,
                text: itemInfo.text,
                value: itemInfo.value
              };
              this.triggerEvent(Event.ITEM_SELECTED, detail);
            }

            this.hide();
            return;
          } // don't toggle the selectbox if the event concerns headers, dividers


          var selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');

          if (selectboxMenu) {
            return;
          }

          this.toggle();
        }
      }
    }, {
      key: "toggle",
      value: function toggle() {
        if (this.options.element.classList.contains('active')) {
          return this.hide();
        }

        return this.show();
      }
      /**
       * Shows the selectbox
       * @returns {Boolean}
       */

    }, {
      key: "show",
      value: function show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.add('active');
        var selectboxMenu = this.options.element.querySelector('.selectbox-menu'); // scroll to top

        selectboxMenu.scrollTop = 0;
        this.triggerEvent(Event.SHOW);
        this.triggerEvent(Event.SHOWN);
        this.registerElement({
          target: selectboxMenu,
          event: 'click'
        });
        this.registerElement({
          target: document.body,
          event: Event.START
        });
        return true;
      }
      /**
       * Hides the selectbox
       * @returns {Boolean}
       */

    }, {
      key: "hide",
      value: function hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.remove('active');
        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        this.unregisterElement({
          target: this.options.element.querySelector('.selectbox-menu'),
          event: 'click'
        });
        this.unregisterElement({
          target: document.body,
          event: Event.START
        });
        return true;
      }
    }], [{
      key: "identifier",
      value: function identifier() {
        return NAME;
      }
    }, {
      key: "DOMInterface",
      value: function DOMInterface(options) {
        return _get(_getPrototypeOf(Selectbox), "DOMInterface", this).call(this, Selectbox, options, components);
      }
    }]);

    return Selectbox;
  }(Component);
  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var selectboxes = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
  selectboxes.filter(function (d) {
    return !d.classList.contains('nav-item');
  }).forEach(function (element) {
    var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    if (!config.search) {
      components.push(new Selectbox(config));
    }
  });
  document.addEventListener('click', function (event) {
    var selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');

    if (selectboxMenu) {
      return;
    }

    var selectbox = findTargetByClass(event.target, 'selectbox');

    if (selectbox) {
      var dataToggleAttr = selectbox.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME && selectbox) {
        var component = components.find(function (c) {
          return c.getElement() === selectbox;
        });

        if (!component) {
          return;
        }

        component.toggle();
      }
    }
  });
  return Selectbox;
}();

module.exports = Selectbox;
//# sourceMappingURL=selectbox.js.map
