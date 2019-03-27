/*!
    * Phonon v2.0.0-alpha.1 (https://github.com/quark-dev/Phonon-Framework)
    * Copyright 2015-2019 Quarkdev
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    */
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

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.phonon = factory());
}(this, function () { 'use strict';

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

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
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
  function findTargetByAttr(target, attr) {
    for (; target && target !== document; target = target.parentNode) {
      if (target.getAttribute(attr) !== null) {
        return target;
      }
    }

    return null;
  }
  /* eslint no-param-reassign: 0 */

  function createJqueryPlugin() {
    var $ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var name = arguments.length > 1 ? arguments[1] : undefined;
    var obj = arguments.length > 2 ? arguments[2] : undefined;

    if (!$) {
      return;
    }

    var mainFn = function mainFn() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = options;

      if (this[0]) {
        opts.element = this[0];
      }

      return obj.DOMInterface(opts);
    };

    $.fn[name] = mainFn;
    $.fn[name].Constructor = obj;
    $.fn[name].noConflict = mainFn;
  }
  function sleep(timeout) {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeout);
    });
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

  var Alert = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'alert';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      fade: true
    };
    var DATA_ATTRS_PROPERTIES = ['fade'];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Alert =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Alert, _Component);

      function Alert() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Alert);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Alert).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
        _this.onTransition = false;
        return _this;
      }
      /**
       * Shows the alert
       * @returns {Boolean}
       */


      _createClass(Alert, [{
        key: "show",
        value: function show() {
          var _this2 = this;

          if (this.onTransition) {
            return false;
          }

          if (this.options.element.classList.contains('show') && this.getOpacity() !== 0) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.SHOW);

          var onShow = function onShow() {
            _this2.triggerEvent(Event.SHOWN);

            if (_this2.options.element.classList.contains('fade')) {
              _this2.options.element.classList.remove('fade');
            }

            _this2.options.element.removeEventListener(Event.TRANSITION_END, onShow);

            _this2.onTransition = false;
          };

          if (this.options.fade && !this.options.element.classList.contains('fade')) {
            this.options.element.classList.add('fade');
          }

          this.options.element.classList.add('show');
          this.options.element.addEventListener(Event.TRANSITION_END, onShow);

          if (this.options.element.classList.contains('hide')) {
            this.options.element.classList.remove('hide');
          }

          if (!this.options.fade) {
            onShow();
          }

          return true;
        }
      }, {
        key: "getOpacity",
        value: function getOpacity() {
          var _window$getComputedSt = window.getComputedStyle(this.options.element),
              opacity = _window$getComputedSt.opacity;

          return parseFloat(opacity);
        }
        /**
         * Hides the alert
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this3 = this;

          if (this.onTransition) {
            return false;
          }

          if (this.getOpacity() === 0) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.HIDE);

          var onHide = function onHide() {
            _this3.triggerEvent(Event.HIDDEN);

            _this3.options.element.removeEventListener(Event.TRANSITION_END, onHide);

            _this3.onTransition = false;
          };

          if (this.options.fade && !this.options.element.classList.contains('fade')) {
            this.options.element.classList.add('fade');
          }

          this.options.element.addEventListener(Event.TRANSITION_END, onHide);

          if (!this.options.element.classList.contains('hide')) {
            this.options.element.classList.add('hide');
          }

          if (this.options.element.classList.contains('show')) {
            this.options.element.classList.remove('show');
          }

          if (!this.options.fade) {
            onHide();
          }

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
          return _get(_getPrototypeOf(Alert), "DOMInterface", this).call(this, Alert, options, components);
        }
      }]);

      return Alert;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Alert);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var alerts = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    alerts.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Alert.DOMInterface(config));
    });
    document.addEventListener('click', function (event) {
      var target = findTargetByAttr(event.target, 'data-dismiss');

      if (!target) {
        return;
      }

      var dataToggleAttr = target.getAttribute('data-dismiss');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var alert = findTargetByClass(event.target, NAME);
        var id = alert.getAttribute('id');
        var component = components.find(function (c) {
          return c.getElement().getAttribute('id') === id;
        });

        if (!component) {
          return;
        }

        component.hide();
      }
    });
    return Alert;
  }(window.$ ? window.$ : null);

  var Modal = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'modal';
    var VERSION = '2.0.0';
    var BACKDROP_SELECTOR = 'modal-backdrop';
    var DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: null,
      background: null,
      cancelableKeyCodes: [27, // Escape
      13],
      buttons: [{
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    var DATA_ATTRS_PROPERTIES = ['cancelable', 'background'];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Modal =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Modal, _Component);

      function Modal() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Modal);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true));
        _this.template = template || '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (_this.dynamicElement) {
          _this.build();
        }

        _this.setBackgroud();

        return _this;
      }

      _createClass(Modal, [{
        key: "build",
        value: function build() {
          var _this2 = this;

          var builder = document.createElement('div');
          builder.innerHTML = this.template;
          this.options.element = builder.firstChild; // title

          if (this.options.title !== null) {
            this.options.element.querySelector('.modal-title').innerHTML = this.options.title;
          } // message


          if (this.options.message !== null) {
            this.options.element.querySelector('.modal-body').firstChild.innerHTML = this.options.message;
          } else {
            // remove paragraph node
            this.removeTextBody();
          } // buttons


          if (this.options.buttons !== null && Array.isArray(this.options.buttons)) {
            if (this.options.buttons.length > 0) {
              this.options.buttons.forEach(function (button) {
                _this2.options.element.querySelector('.modal-footer').appendChild(_this2.buildButton(button));
              });
            } else {
              this.removeFooter();
            }
          } else {
            this.removeFooter();
          }

          document.body.appendChild(this.options.element);
          this.setAttributes();
        }
      }, {
        key: "setBackgroud",
        value: function setBackgroud() {
          var background = this.getConfig('background');

          if (!background) {
            return;
          }

          if (!this.options.element.classList.contains("modal-".concat(background))) {
            this.options.element.classList.add("modal-".concat(background));
          }

          if (!this.options.element.classList.contains('text-white')) {
            this.options.element.classList.add('text-white');
          }
        }
      }, {
        key: "buildButton",
        value: function buildButton() {
          var buttonInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var button = document.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', buttonInfo.class || 'btn');
          button.setAttribute('data-event', buttonInfo.event);
          button.innerHTML = buttonInfo.text;

          if (buttonInfo.dismiss) {
            button.setAttribute('data-dismiss', NAME);
          }

          return button;
        }
      }, {
        key: "buildBackdrop",
        value: function buildBackdrop() {
          var backdrop = document.createElement('div');
          backdrop.setAttribute('data-id', this.id);
          backdrop.classList.add(BACKDROP_SELECTOR);
          document.body.appendChild(backdrop);
        }
      }, {
        key: "getBackdrop",
        value: function getBackdrop() {
          return document.querySelector(".".concat(BACKDROP_SELECTOR, "[data-id=\"").concat(this.id, "\"]"));
        }
      }, {
        key: "removeTextBody",
        value: function removeTextBody() {
          this.options.element.querySelector('.modal-body').removeChild(this.options.element.querySelector('.modal-body').firstChild);
        }
      }, {
        key: "removeFooter",
        value: function removeFooter() {
          var footer = this.options.element.querySelector('.modal-footer');
          this.options.element.querySelector('.modal-content').removeChild(footer);
        }
      }, {
        key: "center",
        value: function center() {
          var computedStyle = window.getComputedStyle(this.options.element);
          var height = computedStyle.height.slice(0, computedStyle.height.length - 2);
          var top = window.innerHeight / 2 - height / 2;
          this.options.element.style.top = "".concat(top, "px");
        }
        /**
         * Shows the modal
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          var _this3 = this;

          if (this.options.element === null) {
            // build and insert a new DOM element
            this.build();
          }

          if (this.options.element.classList.contains('show')) {
            return false;
          } // add a timeout so that the CSS animation works


          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var onShown;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return sleep(20);

                  case 2:
                    _this3.triggerEvent(Event.SHOW);

                    _this3.buildBackdrop(); // attach event


                    _this3.attachEvents();

                    onShown = function onShown() {
                      _this3.triggerEvent(Event.SHOWN);

                      _this3.options.element.removeEventListener(Event.TRANSITION_END, onShown);
                    };

                    _this3.options.element.addEventListener(Event.TRANSITION_END, onShown);

                    _this3.options.element.classList.add('show');

                    _this3.center();

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }))();

          return true;
        }
      }, {
        key: "onElementEvent",
        value: function onElementEvent(event) {
          // keyboard event (escape and enter)
          if (event.type === 'keyup') {
            if (this.options.cancelableKeyCodes.find(function (k) {
              return k === event.keyCode;
            })) {
              this.hide();
            }

            return;
          } // backdrop event


          if (event.type === Event.START) {
            // hide the modal
            this.hide();
            return;
          } // button event


          if (event.type === 'click') {
            var eventName = event.target.getAttribute('data-event');

            if (eventName) {
              this.triggerEvent(eventName);
            }

            if (event.target.getAttribute('data-dismiss') === NAME) {
              this.hide();
            }
          }
        }
        /**
         * Hides the modal
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this4 = this;

          if (!this.options.element.classList.contains('show')) {
            return false;
          }

          this.triggerEvent(Event.HIDE);
          this.detachEvents();
          this.options.element.classList.add('hide');
          this.options.element.classList.remove('show');
          var backdrop = this.getBackdrop();

          var onHidden = function onHidden() {
            document.body.removeChild(backdrop);

            _this4.options.element.classList.remove('hide');

            _this4.triggerEvent(Event.HIDDEN);

            backdrop.removeEventListener(Event.TRANSITION_END, onHidden); // remove generated modals from the DOM

            if (_this4.dynamicElement) {
              document.body.removeChild(_this4.options.element);
              _this4.options.element = null;
            }
          };

          backdrop.addEventListener(Event.TRANSITION_END, onHidden);
          backdrop.classList.add('fadeout');
          return true;
        }
      }, {
        key: "attachEvents",
        value: function attachEvents() {
          var _this5 = this;

          var buttons = this.options.element.querySelectorAll('[data-dismiss], .modal-footer button');

          if (buttons) {
            Array.from(buttons).forEach(function (button) {
              return _this5.registerElement({
                target: button,
                event: 'click'
              });
            });
          } // add events if the modal is cancelable
          // which means the user can hide the modal
          // by pressing the ESC key or click on the backdrop


          if (this.options.cancelable) {
            var backdrop = this.getBackdrop();
            this.registerElement({
              target: backdrop,
              event: Event.START
            });
            this.registerElement({
              target: document,
              event: 'keyup'
            });
          }
        }
      }, {
        key: "detachEvents",
        value: function detachEvents() {
          var _this6 = this;

          var buttons = this.options.element.querySelectorAll('[data-dismiss], .modal-footer button');

          if (buttons) {
            Array.from(buttons).forEach(function (button) {
              return _this6.unregisterElement({
                target: button,
                event: 'click'
              });
            });
          }

          if (this.options.cancelable) {
            var backdrop = this.getBackdrop();
            this.unregisterElement({
              target: backdrop,
              event: Event.START
            });
            this.unregisterElement({
              target: document,
              event: 'keyup'
            });
          }
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(Modal), "DOMInterface", this).call(this, Modal, options, components);
        }
      }]);

      return Modal;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Modal);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var modals = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    modals.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(new Modal(config));
    });
    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var selector = event.target.getAttribute('data-target');
        var element = document.querySelector(selector);
        var component = components.find(function (c) {
          return c.getElement() === element;
        });

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.show();
      }
    });
    return Modal;
  }(window.$ ? window.$ : null);

  var Prompt = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'prompt';
    var DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: [{
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary'
      }, {
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    var DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Prompt =
    /*#__PURE__*/
    function (_Modal) {
      _inherits(Prompt, _Modal);

      function Prompt() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Prompt);

        var template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '<input class="form-control" type="text" value="">' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(options.buttons)) {
          options.buttons = DEFAULT_PROPERTIES.buttons;
        }

        return _possibleConstructorReturn(this, _getPrototypeOf(Prompt).call(this, options, template));
      }
      /**
       * Shows the prompt
       * @returns {Boolean}
       */


      _createClass(Prompt, [{
        key: "show",
        value: function show() {
          _get(_getPrototypeOf(Prompt.prototype), "show", this).call(this);

          this.attachInputEvent();
        }
        /**
         * Hides the prompt
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          _get(_getPrototypeOf(Prompt.prototype), "hide", this).call(this);

          this.detachInputEvent();
        }
      }, {
        key: "getInput",
        value: function getInput() {
          return this.options.element.querySelector('.form-control');
        }
      }, {
        key: "attachInputEvent",
        value: function attachInputEvent() {
          this.registerElement({
            target: this.getInput(),
            event: 'keyup'
          });
        }
      }, {
        key: "detachInputEvent",
        value: function detachInputEvent() {
          this.unregisterElement({
            target: this.getInput(),
            event: 'keyup'
          });
        }
      }, {
        key: "onElementEvent",
        value: function onElementEvent(event) {
          if (event.target === this.getInput()) {
            return;
          }

          _get(_getPrototypeOf(Prompt.prototype), "onElementEvent", this).call(this, event);
        }
      }, {
        key: "setInputValue",
        value: function setInputValue() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          this.getInput().value = value;
        }
      }, {
        key: "getInputValue",
        value: function getInputValue() {
          return this.getInput().value;
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new Prompt(options);
        }
      }]);

      return Prompt;
    }(Modal);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Prompt);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var components = [];
    var modals = document.querySelectorAll(".".concat(Modal.identifier()));

    if (modals) {
      Array.from(modals).forEach(function (element) {
        var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // prompt
          components.push(new Prompt(config));
        }
      });
    }

    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('data-target');
        var element = document.querySelector(id);
        var component = components.find(function (c) {
          return c.element === element;
        });

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.modal.show();
      }
    });
    return Prompt;
  }(window.$ ? window.$ : null);

  var Confirm = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'confirm';
    var DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: [{
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary'
      }, {
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    var DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Confirm =
    /*#__PURE__*/
    function (_Modal) {
      _inherits(Confirm, _Modal);

      function Confirm() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Confirm);

        var opts = options;
        var template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(opts.buttons)) {
          opts.buttons = DEFAULT_PROPERTIES.buttons;
        }

        return _possibleConstructorReturn(this, _getPrototypeOf(Confirm).call(this, opts, template));
      }

      _createClass(Confirm, null, [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new Confirm(options);
        }
      }]);

      return Confirm;
    }(Modal);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Confirm);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var components = [];
    var modals = document.querySelectorAll(".".concat(Modal.identifier()));

    if (modals) {
      Array.from(modals).forEach(function (element) {
        var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // confirm
          components.push(new Confirm(config));
        }
      });
    }

    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('data-target');
        var element = document.querySelector(id);
        var component = components.find(function (c) {
          return c.element === element;
        });

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.modal.show();
      }
    });
    return Confirm;
  }(window.$ ? window.$ : null);

  var Loader = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'loader';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      color: null,
      size: null
    };
    var DATA_ATTRS_PROPERTIES = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Loader =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Loader, _Component);

      function Loader() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Loader);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Loader).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)); // set color

        var loaderSpinner = _this.getSpinner();

        if (typeof _this.options.color === 'string' && !loaderSpinner.classList.contains("color-".concat(_this.options.color))) {
          loaderSpinner.classList.add("color-".concat(_this.options.color));
        }

        _this.customSize = _this.options.size !== null;
        return _this;
      }

      _createClass(Loader, [{
        key: "getClientSize",
        value: function getClientSize() {
          if (!this.customSize) {
            var size = this.options.element.getBoundingClientRect();
            return size.height;
          }

          return this.options.size;
        }
      }, {
        key: "getSpinner",
        value: function getSpinner() {
          return this.options.element.querySelector('.loader-spinner');
        }
      }, {
        key: "show",
        value: function show() {
          if (this.options.element.classList.contains('hide')) {
            this.options.element.classList.remove('hide');
          }

          this.triggerEvent(Event.SHOW);
          var size = this.getClientSize();
          this.options.size = size;

          if (this.customSize) {
            this.options.element.style.width = "".concat(this.options.size, "px");
            this.options.element.style.height = "".concat(this.options.size, "px");
            var loaderSpinner = this.getSpinner();
            loaderSpinner.style.width = "".concat(this.options.size, "px");
            loaderSpinner.style.height = "".concat(this.options.size, "px");
          }

          this.triggerEvent(Event.SHOWN);
          return true;
        }
      }, {
        key: "animate",
        value: function animate() {
          var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          if (startAnimation) {
            this.show();
          } else {
            this.hide();
          }

          var loaderSpinner = this.getSpinner();

          if (startAnimation && !loaderSpinner.classList.contains('loader-spinner-animated')) {
            loaderSpinner.classList.add('loader-spinner-animated');
            return true;
          }

          if (!startAnimation && loaderSpinner.classList.contains('loader-spinner-animated')) {
            loaderSpinner.classList.remove('loader-spinner-animated');
          }

          return true;
        }
      }, {
        key: "hide",
        value: function hide() {
          if (!this.options.element.classList.contains('hide')) {
            this.options.element.classList.add('hide');
          }

          this.triggerEvent(Event.HIDE);
          this.triggerEvent(Event.HIDDEN);
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
          return _get(_getPrototypeOf(Loader), "DOMInterface", this).call(this, Loader, options);
        }
      }]);

      return Loader;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Loader);
    return Loader;
  }(window.$ ? window.$ : null);

  var Loader$1 = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'loader';
    var DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: []
    };
    var DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Loader$$1 =
    /*#__PURE__*/
    function (_Modal) {
      _inherits(Loader$$1, _Modal);

      function Loader$$1() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Loader$$1);

        var opts = options;
        var template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '<div class="mx-auto text-center">' + '<div class="loader mx-auto d-block">' + '<div class="loader-spinner"></div>' + '</div>' + '</div>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(opts.buttons)) {
          opts.buttons = opts.cancelable ? DEFAULT_PROPERTIES.buttons : [];
        }

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Loader$$1).call(this, opts, template));
        _this.spinner = null;
        return _this;
      }

      _createClass(Loader$$1, [{
        key: "show",
        value: function show() {
          _get(_getPrototypeOf(Loader$$1.prototype), "show", this).call(this);

          this.spinner = new Loader({
            element: this.getElement().querySelector('.loader')
          });
          this.spinner.animate(true);
        }
      }, {
        key: "hide",
        value: function hide() {
          _get(_getPrototypeOf(Loader$$1.prototype), "hide", this).call(this);

          this.spinner.animate(false);
          this.spinner = null;
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new Loader$$1(options);
        }
      }]);

      return Loader$$1;
    }(Modal);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Loader$$1);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var components = [];
    var modals = document.querySelectorAll(".".concat(Modal.identifier()));

    if (modals) {
      Array.from(modals).forEach(function (element) {
        var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // loader
          components.push(new Loader$$1(config));
        }
      });
    }

    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('data-target');
        var element = document.querySelector(id);
        var component = components.find(function (c) {
          return c.element === element;
        });

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.modal.show();
      }
    });
    return Loader$$1;
  }(window.$ ? window.$ : null);

  var Notification = function ($) {
    /**
     * ------------------------------------------------------------------------
    * Constants
    * ------------------------------------------------------------------------
    */
    var NAME = 'notification';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      message: '',
      button: true,
      timeout: null,
      background: 'primary',
      directionX: 'right',
      directionY: 'top',
      offsetX: 0,
      offsetY: 0,
      appendIn: document.body
    };
    var DATA_ATTRS_PROPERTIES = ['message', 'button', 'timeout', 'background'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Notification =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Notification, _Component);

      function Notification() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Notification);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Notification).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));
        _this.template = '' + '<div class="notification">' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '</div>';

        if (_this.dynamicElement) {
          _this.build();
        }

        _this.timeoutCallback = null;
        return _this;
      }

      _createClass(Notification, [{
        key: "build",
        value: function build() {
          var builder = document.createElement('div');
          builder.innerHTML = this.template;
          this.options.element = builder.firstChild; // text message

          this.options.element.querySelector('.message').innerHTML = this.options.message;

          if (!this.options.button) {
            this.options.element.querySelector('button').style.display = 'none';
          }

          this.getConfig('appendIn', DEFAULT_PROPERTIES.appendIn).appendChild(this.options.element);
          this.setAttributes();
        }
      }, {
        key: "setPosition",
        value: function setPosition() {
          var x = this.getConfig('directionX', DEFAULT_PROPERTIES.directionX);
          var y = this.getConfig('directionY', DEFAULT_PROPERTIES.directionY);
          var offsetX = this.getConfig('offsetX', DEFAULT_PROPERTIES.offsetX);
          var offsetY = this.getConfig('offsetY', DEFAULT_PROPERTIES.offsetY);
          var notification = this.options.element;
          var directions = ['top', 'right', 'bottom', 'left'];
          directions.forEach(function (d) {
            if (notification.classList.contains(d)) {
              notification.classList.remove(d);
            }
          });
          notification.style.marginLeft = '0px';
          notification.style.marginRight = '0px';
          notification.classList.add("notification-".concat(x));
          notification.classList.add("notification-".concat(y));
          var activeNotifications = document.querySelectorAll('.notification.show') || [];
          var totalNotifY = 0;
          activeNotifications.forEach(function (n) {
            if (notification !== n) {
              var style = getComputedStyle(n);
              totalNotifY += n.offsetHeight + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
            }
          });
          notification.style.transform = "translateY(".concat(y === 'top' ? '' : '-').concat(totalNotifY, "px)");
          notification.style["margin".concat(x.replace(/^\w/, function (c) {
            return c.toUpperCase();
          }))] = "".concat(offsetX, "px");
          notification.style["margin".concat(y.replace(/^\w/, function (c) {
            return c.toUpperCase();
          }))] = "".concat(offsetY, "px");
        }
        /**
         * Shows the notification
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          var _this2 = this;

          if (this.options.element === null) {
            // build and insert a new DOM element
            this.build();
          }

          if (this.options.element.classList.contains('show')) {
            return false;
          } // reset color


          if (this.options.background) {
            this.options.element.removeAttribute('class');
            this.options.element.setAttribute('class', 'notification');
            this.options.element.classList.add("notification-".concat(this.options.background));
            this.options.element.querySelector('button').classList.add("btn-".concat(this.options.background));
          }

          this.setPosition();
          var buttonElement = this.options.element.querySelector('button[data-dismiss]');

          if (this.options.button && buttonElement) {
            // attach the button handler
            this.registerElement({
              target: buttonElement,
              event: 'click'
            });
          }

          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var onShown;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return sleep(20);

                  case 2:
                    if (Number.isInteger(_this2.options.timeout) && _this2.options.timeout > 0) {
                      // if there is a timeout, auto hide the notification
                      _this2.timeoutCallback = setTimeout(function () {
                        _this2.hide();
                      }, _this2.options.timeout + 1);
                    }

                    _this2.options.element.classList.add('show');

                    _this2.triggerEvent(Event.SHOW);

                    onShown = function onShown() {
                      _this2.triggerEvent(Event.SHOWN);

                      _this2.options.element.removeEventListener(Event.TRANSITION_END, onShown);
                    };

                    _this2.options.element.addEventListener(Event.TRANSITION_END, onShown);

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }))();

          return true;
        }
        /**
         * Hides the notification
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this3 = this;

          /*
          * prevent to close a notification with a timeout
          * if the user has already clicked on the button
          */
          if (this.timeoutCallback) {
            clearTimeout(this.timeoutCallback);
            this.timeoutCallback = null;
          }

          if (!this.options.element.classList.contains('show')) {
            return false;
          }

          this.triggerEvent(Event.HIDE);
          var buttonElement = this.options.element.querySelector('button[data-dismiss]');

          if (this.options.button && buttonElement) {
            this.unregisterElement({
              target: buttonElement,
              event: 'click'
            });
          }

          this.options.element.classList.remove('show');
          this.options.element.classList.add('hide');

          var onHidden = function onHidden() {
            _this3.options.element.removeEventListener(Event.TRANSITION_END, onHidden);

            _this3.options.element.classList.remove('hide');

            _this3.triggerEvent(Event.HIDDEN);

            if (_this3.dynamicElement) {
              document.body.removeChild(_this3.options.element);
              _this3.options.element = null;
            }
          };

          this.options.element.addEventListener(Event.TRANSITION_END, onHidden);
          return true;
        }
      }, {
        key: "onElementEvent",
        value: function onElementEvent() {
          this.hide();
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(Notification), "DOMInterface", this).call(this, Notification, options);
        }
      }]);

      return Notification;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Notification);
    return Notification;
  }(window.$ ? window.$ : null);

  var Collapse = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'collapse';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      toggle: false
    };
    var DATA_ATTRS_PROPERTIES = [];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Collapse =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Collapse, _Component);

      function Collapse() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Collapse);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Collapse).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
        _this.onTransition = false; // toggle directly

        if (_this.options.toggle) {
          _this.show();
        }

        return _this;
      }

      _createClass(Collapse, [{
        key: "getHeight",
        value: function getHeight() {
          return this.options.element.getBoundingClientRect(this.options.element).height;
        }
      }, {
        key: "toggle",
        value: function toggle() {
          if (this.options.element.classList.contains('show')) {
            return this.hide();
          }

          return this.show();
        }
        /**
         * Shows the collapse
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          var _this2 = this;

          if (this.onTransition) {
            return false;
          }

          if (this.options.element.classList.contains('show')) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.SHOW);

          var onCollapsed = function onCollapsed() {
            _this2.triggerEvent(Event.SHOWN);

            _this2.options.element.classList.add('show');

            _this2.options.element.classList.remove('collapsing');

            _this2.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);

            _this2.options.element.setAttribute('aria-expanded', true);

            _this2.onTransition = false; // reset the normal height after the animation

            _this2.options.element.style.height = 'auto';
          };

          if (!this.options.element.classList.contains('collapsing')) {
            this.options.element.classList.add('collapsing');
          }

          this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

          if (!this.isVerticalCollapse()) {
            // expandableElement
            this.options.element.classList.add('slide');
          } else {
            // get real height
            var height = this.getHeight();
            this.options.element.style.height = '0px';
            setTimeout(function () {
              _this2.options.element.style.height = "".concat(height, "px");
            }, 20);
          }

          return true;
        }
        /**
         * Hides the collapse
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this3 = this;

          if (this.onTransition) {
            return false;
          }

          if (!this.options.element.classList.contains('show')) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.HIDE);

          var onCollapsed = function onCollapsed() {
            _this3.triggerEvent(Event.HIDDEN);

            _this3.options.element.classList.remove('collapsing');

            _this3.options.element.style.height = 'auto';

            _this3.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);

            _this3.options.element.setAttribute('aria-expanded', false);

            _this3.onTransition = false;
          };

          if (!this.isVerticalCollapse()) {
            if (this.options.element.classList.contains('slide')) {
              this.options.element.classList.remove('slide');
            }
          } else {
            // transform auto height by real height in px
            this.options.element.style.height = "".concat(this.options.element.offsetHeight, "px");
            setTimeout(function () {
              _this3.options.element.style.height = '0px';
            }, 20);
          }

          this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

          if (!this.options.element.classList.contains('collapsing')) {
            this.options.element.classList.add('collapsing');
          }

          this.options.element.classList.remove('show');
          return true;
        }
      }, {
        key: "isVerticalCollapse",
        value: function isVerticalCollapse() {
          return !this.options.element.classList.contains('collapse-l') && !this.options.element.classList.contains('collapse-r');
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(Collapse), "DOMInterface", this).call(this, Collapse, options, components);
        }
      }]);

      return Collapse;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Collapse);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var collapses = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    collapses.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Collapse.DOMInterface(config));
    });
    document.addEventListener(Event.CLICK, function (event) {
      var target = findTargetByAttr(event.target, 'data-toggle');

      if (!target) {
        return;
      }

      var dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = target.getAttribute('data-target') || target.getAttribute('href');
        id = id.replace('#', '');
        var component = components.find(function (c) {
          return c.getElement().getAttribute('id') === id;
        });

        if (!component) {
          return;
        }

        component.toggle();
      }
    });
    return Collapse;
  }(window.$ ? window.$ : null);

  var Accordion = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'accordion';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null
    };
    var DATA_ATTRS_PROPERTIES = [];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Accordion =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Accordion, _Component);

      function Accordion() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Accordion);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Accordion).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
        _this.collapses = [];

        var toggles = _this.options.element.querySelectorAll("[data-toggle=\"".concat(NAME, "\"]"));

        Array.from(toggles).forEach(function (toggle) {
          var collapseId = toggle.getAttribute('href');
          var collapse = document.querySelector(collapseId);

          if (collapse) {
            _this.addCollapse(collapse);
          }
        });
        return _this;
      }

      _createClass(Accordion, [{
        key: "onElementEvent",
        value: function onElementEvent(event) {
          var id = event.target.getAttribute('href');
          var element = document.querySelector(id);
          this.setCollapses(element);
        }
      }, {
        key: "addCollapse",
        value: function addCollapse(element) {
          var collapse = new Collapse({
            element: element
          });
          this.collapses.push(collapse);
          return collapse;
        }
      }, {
        key: "getCollapse",
        value: function getCollapse(element) {
          var collapse = this.collapses.find(function (c) {
            return c.options.element.getAttribute('id') === element.getAttribute('id');
          });

          if (!collapse) {
            // create a new collapse
            collapse = this.addCollapse();
          }

          return collapse;
        }
      }, {
        key: "getCollapses",
        value: function getCollapses() {
          return this.collapses;
        }
        /**
         * Shows the collapse element and hides the other active collapse elements
         * @param {Element} showCollapse
         * @returns {undefined}
         */

      }, {
        key: "setCollapses",
        value: function setCollapses(showCollapse) {
          var collapse = this.getCollapse(showCollapse);
          this.collapses.forEach(function (c) {
            if (c.options.element.getAttribute('id') !== showCollapse.getAttribute('id')) {
              c.hide();
            } else {
              collapse.toggle();
            }
          });
        }
        /**
         * Shows the collapse element
         * @param {(string|Element)} collapseEl
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show(collapseEl) {
          var collapse = collapseEl;

          if (typeof collapseEl === 'string') {
            collapse = document.querySelector(collapseEl);
          }

          if (!collapse) {
            throw new Error("".concat(NAME, ". The collapsible ").concat(collapseEl, " is an invalid HTMLElement."));
          }

          this.setCollapses(collapse);
          return true;
        }
        /**
         * Hides the collapse element
         * @param {(string|Element)} collapseEl
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide(collapseEl) {
          var collapse = collapseEl;

          if (typeof collapseEl === 'string') {
            collapse = document.querySelector(collapseEl);
          }

          if (!collapse) {
            throw new Error("".concat(NAME, ". The collapsible ").concat(collapseEl, " is an invalid HTMLElement."));
          }

          var collapseObj = this.getCollapse(collapse);
          return collapseObj.hide();
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(Accordion), "DOMInterface", this).call(this, Accordion, options, components);
        }
      }]);

      return Accordion;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Accordion);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var accordions = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    accordions.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Accordion.DOMInterface(config));
    });
    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var collapseId = event.target.getAttribute('data-target') || event.target.getAttribute('href');
        var collapseEl = document.querySelector(collapseId);
        var accordion = findTargetByClass(event.target, 'accordion');

        if (accordion === null) {
          return;
        }

        var accordionId = accordion.getAttribute('id');
        var component = components.find(function (c) {
          return c.getElement().getAttribute('id') === accordionId;
        });

        if (!component) {
          return;
        } // if the collapse has been added programmatically, we add it


        var targetCollapse = component.getCollapses().find(function (c) {
          return c.getElement() === collapseEl;
        });

        if (!targetCollapse) {
          component.addCollapse(collapseEl);
        }

        component.show(collapseId);
      }
    });
    return Accordion;
  }(window.$ ? window.$ : null);

  var Tab = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'tab';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {};
    var DATA_ATTRS_PROPERTIES = [];
    var TAB_CONTENT_SELECTOR = '.tab-pane';
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Tab =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Tab, _Component);

      function Tab() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Tab);

        return _possibleConstructorReturn(this, _getPrototypeOf(Tab).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
      }
      /**
       * Shows the tab
       * @returns {Boolean}
       */


      _createClass(Tab, [{
        key: "show",
        value: function show() {
          var _this = this;

          if (this.options.element.classList.contains('active')) {
            return false;
          }

          var id = this.options.element.getAttribute('href');
          var nav = findTargetByClass(this.options.element, 'nav');
          var navTabs = nav ? nav.querySelectorAll("[data-toggle=\"".concat(NAME, "\"]")) : null;

          if (navTabs) {
            Array.from(navTabs).forEach(function (tab) {
              if (tab.classList.contains('active')) {
                tab.classList.remove('active');
              }

              tab.setAttribute('aria-selected', false);
            });
          }

          this.options.element.classList.add('active');
          this.options.element.setAttribute('aria-selected', true);
          var tabContent = document.querySelector(id);
          var tabContents = tabContent.parentNode.querySelectorAll(TAB_CONTENT_SELECTOR);

          if (tabContents) {
            Array.from(tabContents).forEach(function (tab) {
              if (tab.classList.contains('active')) {
                tab.classList.remove('active');
              }
            });
          }

          tabContent.classList.add('showing');
          this.triggerEvent(Event.SHOW);

          var onShowed = function onShowed() {
            tabContent.classList.remove('animate');
            tabContent.classList.add('active');
            tabContent.classList.remove('showing');

            _this.triggerEvent(Event.SHOWN);

            tabContent.removeEventListener(Event.TRANSITION_END, onShowed);
          };

          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return sleep(20);

                  case 2:
                    tabContent.addEventListener(Event.TRANSITION_END, onShowed);
                    tabContent.classList.add('animate');

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }))();

          return true;
        }
        /**
         * Hides the tab
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          if (!this.options.element.classList.contains('active')) {
            return false;
          }

          if (this.options.element.classList.contains('active')) {
            this.options.element.classList.remove('active');
          }

          this.triggerEvent(Event.HIDE);
          this.options.element.setAttribute('aria-selected', false);
          var id = this.options.element.getAttribute('href');
          var tabContent = document.querySelector(id);

          if (tabContent.classList.contains('active')) {
            tabContent.classList.remove('active');
          }

          this.triggerEvent(Event.HIDDEN);
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
          return _get(_getPrototypeOf(Tab), "DOMInterface", this).call(this, Tab, options, components);
        }
      }]);

      return Tab;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Tab);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var tabs = document.querySelectorAll("[data-toggle=\"".concat(NAME, "\"]"));

    if (tabs) {
      Array.from(tabs).forEach(function (element) {
        // const config = {}
        var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;
        components.push(Tab.DOMInterface(config));
      });
    }

    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('href');
        var component = components.find(function (c) {
          return c.getElement().getAttribute('href') === id;
        });

        if (!component) {
          return;
        }

        component.show();
      }
    });
    return Tab;
  }(window.$ ? window.$ : null);

  var Progress = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'progress';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      height: 5,
      min: 0,
      max: 100,
      label: false,
      striped: false,
      background: null
    };
    var DATA_ATTRS_PROPERTIES = ['height', 'min', 'max', 'label', 'striped', 'background'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Progress =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Progress, _Component);

      function Progress() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Progress);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Progress).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)); // set the wanted height

        _this.options.element.style.height = "".concat(_this.options.height, "px"); // set min and max values

        var progressBar = _this.getProgressBar();

        progressBar.setAttribute('aria-valuemin', "".concat(_this.options.min));
        progressBar.setAttribute('aria-valuemax', "".concat(_this.options.max)); // set striped

        if (_this.options.striped && !progressBar.classList.contains('progress-bar-striped')) {
          progressBar.classList.add('progress-bar-striped');
        } // set background


        if (typeof _this.options.background === 'string' && !progressBar.classList.contains("bg-".concat(_this.options.background))) {
          progressBar.classList.add("bg-".concat(_this.options.background));
        }

        return _this;
      }

      _createClass(Progress, [{
        key: "getProgressBar",
        value: function getProgressBar() {
          return this.options.element.querySelector('.progress-bar');
        }
      }, {
        key: "set",
        value: function set() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var progressBar = this.getProgressBar();
          var progress = Math.round(value / (this.options.min + this.options.max) * 100);

          if (value < this.options.min) {
            console.error("".concat(NAME, ". Warning, ").concat(value, " is under min value."));
            return false;
          }

          if (value > this.options.max) {
            console.error("".concat(NAME, ". Warning, ").concat(value, " is above max value."));
            return false;
          }

          progressBar.setAttribute('aria-valuenow', "".concat(value)); // set label

          if (this.options.label) {
            progressBar.innerHTML = "".concat(progress, "%");
          } // set percentage


          progressBar.style.width = "".concat(progress, "%");
          return true;
        }
      }, {
        key: "animate",
        value: function animate() {
          var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          if (!this.options.striped) {
            console.error("".concat(NAME, ". Animation works only with striped progress."));
            return false;
          }

          var progressBar = this.getProgressBar();

          if (startAnimation && !progressBar.classList.contains('progress-bar-animated')) {
            progressBar.classList.add('progress-bar-animated');
          }

          if (!startAnimation && progressBar.classList.contains('progress-bar-animated')) {
            progressBar.classList.remove('progress-bar-animated');
          }

          return true;
        }
        /**
         * Shows the progress bar
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          this.options.element.style.height = "".concat(this.options.height, "px");
          this.triggerEvent(Event.SHOW);
          this.triggerEvent(Event.SHOWN);
          return true;
        }
        /**
         * Hides the progress bar
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          this.options.element.style.height = '0px';
          this.triggerEvent(Event.HIDE);
          this.triggerEvent(Event.HIDDEN);
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
          return _get(_getPrototypeOf(Progress), "DOMInterface", this).call(this, Progress, options);
        }
      }]);

      return Progress;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Progress);
    return Progress;
  }(window.$ ? window.$ : null);

  var OffCanvas = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'offcanvas';
    var VERSION = '2.0.0';
    var BACKDROP_SELECTOR = 'offcanvas-backdrop';
    var DEFAULT_PROPERTIES = {
      element: null,
      container: document.body,
      toggle: false,
      aside: {
        md: false,
        lg: true,
        xl: true
      }
    };
    var DATA_ATTRS_PROPERTIES = ['aside', 'toggle'];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var OffCanvas =
    /*#__PURE__*/
    function (_Component) {
      _inherits(OffCanvas, _Component);

      function OffCanvas() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OffCanvas);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(OffCanvas).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true));
        _this.currentWidthName = null;
        _this.animate = true;
        _this.showAside = false;
        _this.directions = ['left', 'right'];
        var sm = {
          name: 'sm',
          media: window.matchMedia('(min-width: 1px)')
        };
        var md = {
          name: 'md',
          media: window.matchMedia('(min-width: 768px)')
        };
        var lg = {
          name: 'lg',
          media: window.matchMedia('(min-width: 992px)')
        };
        var xl = {
          name: 'xl',
          media: window.matchMedia('(min-width: 1200px)')
        };
        _this.sizes = [sm, md, lg, xl].reverse();

        _this.checkDirection();

        _this.checkWidth();

        if (_this.options.toggle) {
          _this.toggle();
        }

        window.addEventListener('resize', function () {
          return _this.checkWidth();
        }, false);
        return _this;
      }

      _createClass(OffCanvas, [{
        key: "checkDirection",
        value: function checkDirection() {
          var _this2 = this;

          this.directions.every(function (direction) {
            if (_this2.options.element.classList.contains("offcanvas-".concat(direction))) {
              _this2.direction = direction;
              return false;
            }

            return true;
          });
        }
      }, {
        key: "checkWidth",
        value: function checkWidth() {
          if (!('matchMedia' in window)) {
            return;
          }

          var size = this.sizes.find(function (size) {
            var match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/);
            return match && size.media.matches;
          });

          if (!size) {
            return;
          }

          this.setAside(size.name);
        }
      }, {
        key: "setAside",
        value: function setAside(sizeName) {
          if (this.currentWidthName === sizeName) {
            return;
          }

          this.currentWidthName = sizeName;
          var content = this.getConfig('container', DEFAULT_PROPERTIES.container);
          this.showAside = this.options.aside[sizeName] === true;

          if (this.options.aside[sizeName] === true) {
            if (!content.classList.contains("offcanvas-aside-".concat(this.direction))) {
              content.classList.add("offcanvas-aside-".concat(this.direction));
            } // avoid animation by setting animate to false


            this.animate = false; // remove previous backdrop

            if (this.getBackdrop()) {
              this.removeBackdrop();
            }

            if (this.isVisible() && !content.classList.contains('show')) {
              content.classList.add('show');
            } else if (!this.isVisible() && content.classList.contains('show')) {
              content.classList.remove('show');
            }
          } else {
            if (content.classList.contains("offcanvas-aside-".concat(this.direction))) {
              content.classList.remove("offcanvas-aside-".concat(this.direction));
            }

            this.animate = true; // force hide

            this.hide();
          }
        }
      }, {
        key: "onElementEvent",
        value: function onElementEvent(event) {
          if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
            return;
          } // hide the offcanvas


          this.hide();
        }
      }, {
        key: "isVisible",
        value: function isVisible() {
          return this.options.element.classList.contains('show');
        }
        /**
         * Shows the off-canvas
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          var _this3 = this;

          if (this.options.element.classList.contains('show')) {
            return false;
          }

          this.triggerEvent(Event.SHOW);

          if (!this.showAside) {
            this.createBackdrop();
          } // add a timeout so that the CSS animation works


          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var onShown, container;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return sleep(20);

                  case 2:
                    // attach event
                    _this3.attachEvents();

                    onShown = function onShown() {
                      _this3.triggerEvent(Event.SHOWN);

                      if (_this3.animate) {
                        _this3.options.element.removeEventListener(Event.TRANSITION_END, onShown);

                        _this3.options.element.classList.remove('animate');
                      }
                    };

                    if (_this3.showAside) {
                      container = _this3.getConfig('container', DEFAULT_PROPERTIES.container);

                      if (!container.classList.contains('show')) {
                        container.classList.add('show');
                      }
                    }

                    if (_this3.animate) {
                      _this3.options.element.addEventListener(Event.TRANSITION_END, onShown);

                      _this3.options.element.classList.add('animate');
                    } else {
                      // directly trigger the onShown
                      onShown();
                    }

                    _this3.options.element.classList.add('show');

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }))();

          return true;
        }
        /**
         * Hides the off-canvas
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this4 = this;

          if (!this.options.element.classList.contains('show')) {
            return false;
          }

          this.triggerEvent(Event.HIDE);
          this.detachEvents();

          if (this.animate) {
            this.options.element.classList.add('animate');
          }

          this.options.element.classList.remove('show');

          if (this.showAside) {
            var container = this.getConfig('container', DEFAULT_PROPERTIES.container);

            if (container.classList.contains('show')) {
              container.classList.remove('show');
            }
          }

          if (!this.showAside) {
            var backdrop = this.getBackdrop();

            var onHidden = function onHidden() {
              if (_this4.animate) {
                _this4.options.element.classList.remove('animate');
              }

              backdrop.removeEventListener(Event.TRANSITION_END, onHidden);

              _this4.triggerEvent(Event.HIDDEN);

              _this4.removeBackdrop();
            };

            if (backdrop) {
              backdrop.addEventListener(Event.TRANSITION_END, onHidden);
              backdrop.classList.add('fadeout');
            }
          }

          return true;
        }
      }, {
        key: "toggle",
        value: function toggle() {
          if (this.isVisible()) {
            return this.hide();
          }

          return this.show();
        }
      }, {
        key: "createBackdrop",
        value: function createBackdrop() {
          var backdrop = document.createElement('div');
          backdrop.setAttribute('data-id', this.id);
          backdrop.classList.add(BACKDROP_SELECTOR);
          var content = this.getConfig('container', DEFAULT_PROPERTIES.container);
          content.appendChild(backdrop);
        }
      }, {
        key: "getBackdrop",
        value: function getBackdrop() {
          return document.querySelector(".".concat(BACKDROP_SELECTOR, "[data-id=\"").concat(this.id, "\"]"));
        }
      }, {
        key: "removeBackdrop",
        value: function removeBackdrop() {
          var backdrop = this.getBackdrop();

          if (backdrop) {
            var content = this.getConfig('container', DEFAULT_PROPERTIES.container);
            content.removeChild(backdrop);
          }
        }
      }, {
        key: "attachEvents",
        value: function attachEvents() {
          var _this5 = this;

          Array.from(this.options.element.querySelectorAll('[data-dismiss]') || []).forEach(function (button) {
            return _this5.registerElement({
              target: button,
              event: 'click'
            });
          });
          var backdrop = this.getBackdrop();

          if (!this.showAside && backdrop) {
            this.registerElement({
              target: backdrop,
              event: Event.START
            });
          }

          this.registerElement({
            target: document,
            event: 'keyup'
          });
        }
      }, {
        key: "detachEvents",
        value: function detachEvents() {
          var _this6 = this;

          var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

          if (dismissButtons) {
            Array.from(dismissButtons).forEach(function (button) {
              return _this6.unregisterElement({
                target: button,
                event: 'click'
              });
            });
          }

          var backdrop = this.getBackdrop();

          if (!this.showAside && backdrop) {
            this.unregisterElement({
              target: backdrop,
              event: Event.START
            });
          }

          this.unregisterElement({
            target: document,
            event: 'keyup'
          });
        }
      }], [{
        key: "identifier",
        value: function identifier() {
          return NAME;
        }
      }, {
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(OffCanvas), "DOMInterface", this).call(this, OffCanvas, options, components);
        }
      }]);

      return OffCanvas;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, OffCanvas);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var offCanvas = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    offCanvas.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(new OffCanvas(config));
    });
    document.addEventListener('click', function (event) {
      var target = findTargetByAttr(event.target, 'data-toggle');

      if (!target) {
        return;
      }

      var dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = target.getAttribute('data-target');
        var element = document.querySelector(id);
        var component = components.find(function (c) {
          return c.getElement() === element;
        });

        if (!component) {
          return;
        }

        target.blur();
        component.toggle();
      }
    });
    return OffCanvas;
  }(window.$ ? window.$ : null);

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

  var SelectboxSearch = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = Selectbox.identifier();
    var DEFAULT_PROPERTIES = {
      element: null,
      selectable: true,
      search: true,
      filterItems: null
    };
    var DATA_ATTRS_PROPERTIES = ['selectable', 'search'];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var SelectboxSearch =
    /*#__PURE__*/
    function (_Selectbox) {
      _inherits(SelectboxSearch, _Selectbox);

      function SelectboxSearch() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SelectboxSearch);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectboxSearch).call(this, options));

        _this.filterItemsHandler = function (event) {
          var search = event.target.value;

          if (search === '') {
            _this.showItems();

            return;
          }

          _this.getItems().forEach(function (item) {
            var itemEl = item;
            var fn = typeof _this.options.filterItems === 'function' ? _this.options.filterItems : _this.filterItems;

            if (fn(search, itemEl)) {
              itemEl.element.style.display = 'block';
            } else {
              itemEl.element.style.display = 'none';
            }
          });
        };

        _this.getSearchInput().addEventListener('keyup', _this.filterItemsHandler);

        return _this;
      }

      _createClass(SelectboxSearch, [{
        key: "filterItems",
        value: function filterItems() {
          var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1;
        }
      }, {
        key: "getItems",
        value: function getItems() {
          var _this2 = this;

          var items = Array.from(this.options.element.querySelectorAll('.item') || []);
          items = items.map(function (item) {
            var info = _this2.getItemData(item);

            return {
              text: info.text,
              value: info.value,
              element: item
            };
          });
          return items;
        }
      }, {
        key: "showItems",
        value: function showItems() {
          this.getItems().forEach(function (item) {
            var i = item;
            i.element.style.display = 'block';
          });
        }
      }, {
        key: "getSearchInput",
        value: function getSearchInput() {
          return this.options.element.querySelector('.selectbox-menu input');
        }
        /**
         * Hides the search selectbox
         * @returns {Promise} Promise object represents the completed animation
         */

      }, {
        key: "hide",
        value: function () {
          var _hide = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _get(_getPrototypeOf(SelectboxSearch.prototype), "hide", this).call(this);

                  case 2:
                    // reset the value
                    this.getSearchInput().value = ''; // show all items

                    this.showItems();
                    return _context.abrupt("return", true);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function hide() {
            return _hide.apply(this, arguments);
          }

          return hide;
        }()
      }], [{
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new SelectboxSearch(options, components);
        }
      }]);

      return SelectboxSearch;
    }(Selectbox);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, SelectboxSearch);
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

      if (config.search) {
        // search
        components.push(new SelectboxSearch(config));
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
    return SelectboxSearch;
  }(window.$ ? window.$ : null);

  var Dropdown = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'dropdown';
    var MENU = 'dropdown-menu';
    var MENU_ITEM = 'dropdown-item';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      hover: true
    };
    var DATA_ATTRS_PROPERTIES = ['hover'];
    var components = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Dropdown =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Dropdown, _Component);

      function Dropdown() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Dropdown);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
        _this.onTransition = false;

        if (_this.options.hover) {
          _this.registerElement({
            target: _this.options.element,
            event: 'mouseover'
          });

          _this.registerElement({
            target: _this.options.element,
            event: 'mouseleave'
          });

          _this.options.element.addEventListener('mouseover', function () {
            _this.show();
          });

          _this.options.element.addEventListener('mouseleave', function () {
            _this.hide();
          });
        }

        return _this;
      }

      _createClass(Dropdown, [{
        key: "onElementEvent",
        value: function onElementEvent(event) {
          if (event.type === 'mouseover') {
            this.show();
            return;
          }

          if (event.type === 'mouseleave') {
            this.hide();
          }
        }
        /**
         * Shows the dropdown
         * @returns {Boolean}
         */

      }, {
        key: "show",
        value: function show() {
          var _this2 = this;

          if (this.onTransition) {
            return false;
          }

          if (this.options.element.classList.contains('show')) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.SHOW);

          var onShow = function onShow() {
            // dropdown menu
            _this2.triggerEvent(Event.SHOWN);

            _this2.getMenu().removeEventListener(Event.TRANSITION_END, onShow);

            _this2.onTransition = false;
          }; // dropdown handler


          this.options.element.classList.add('show');
          var dropdownMenu = this.getMenu();
          dropdownMenu.classList.add('show');

          if (dropdownMenu.clientWidth > this.options.element.clientWidth && !dropdownMenu.classList.contains('force-left')) {
            // move the caret to the left
            dropdownMenu.classList.add('force-left');
          } else if (dropdownMenu.clientWidth < this.options.element.clientWidth && dropdownMenu.classList.contains('force-left')) {
            // set default position for the caret
            dropdownMenu.classList.remove('force-left');
          }

          dropdownMenu.addEventListener(Event.TRANSITION_END, onShow);
          setTimeout(function () {
            dropdownMenu.classList.add('animate');
          }, 20);
          return true;
        }
      }, {
        key: "getMenu",
        value: function getMenu() {
          return this.options.element.querySelector(".".concat(MENU));
        }
      }, {
        key: "toggle",
        value: function toggle() {
          if (this.options.element.classList.contains('show')) {
            this.hide();
          } else {
            this.show();
          }
        }
        /**
         * Hides the collapse
         * @returns {Boolean}
         */

      }, {
        key: "hide",
        value: function hide() {
          var _this3 = this;

          if (this.onTransition) {
            return false;
          }

          if (!this.options.element.classList.contains('show')) {
            return false;
          }

          this.onTransition = true;
          this.triggerEvent(Event.HIDE);

          var onHide = function onHide() {
            // dropdown menu
            _this3.getMenu().classList.remove('show');

            _this3.triggerEvent(Event.HIDDEN);

            _this3.getMenu().removeEventListener(Event.TRANSITION_END, onHide);

            _this3.onTransition = false;
          }; // dropdown handler


          this.options.element.classList.remove('show');
          this.getMenu().addEventListener(Event.TRANSITION_END, onHide);
          this.getMenu().classList.remove('animate');
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
          return _get(_getPrototypeOf(Dropdown), "DOMInterface", this).call(this, Dropdown, options, components);
        }
      }]);

      return Dropdown;
    }(Component);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Dropdown);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    var dropdowns = Array.from(document.querySelectorAll(".".concat(NAME)) || []);
    dropdowns.forEach(function (element) {
      var config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Dropdown.DOMInterface(config));
    });
    document.addEventListener('click', function (event) {
      var dropdown = findTargetByClass(event.target, NAME);
      var dropdownMenuItem = findTargetByClass(event.target, MENU_ITEM);

      if (dropdown) {
        var component = components.find(function (c) {
          return c.getElement() === dropdown;
        });

        if (!component) {
          return;
        }

        if (dropdownMenuItem) {
          // click in menu
          component.hide();
          return;
        }

        component.show();
      }
    });
    document.addEventListener(Event.START, function (event) {
      var dropdown = findTargetByClass(event.target, NAME);
      var activeDropdown = document.querySelector('.dropdown.show');

      if (dropdown || !activeDropdown) {
        return;
      }

      var activeComponent = components.find(function (c) {
        return c.getElement() === activeDropdown;
      });
      activeComponent.hide();
    });
    return Dropdown;
  }(window.$ ? window.$ : null);

  var Network = function () {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'network';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      element: null,
      initialDelay: 3000,
      delay: 5000
    };
    var DATA_ATTRS_PROPERTIES = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Network =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Network, _Component);

      /**
       * Creates an instance of Network.
       * @param {{}} [options={}]
       */
      function Network() {
        var _this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Network);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Network).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));
        _this.xhr = null;
        _this.checkInterval = null;

        _this.setStatus(Event.NETWORK_ONLINE);

        setTimeout(function () {
          _this.startCheck();
        }, _this.options.initialDelay);
        return _this;
      }

      _createClass(Network, [{
        key: "getStatus",
        value: function getStatus() {
          return this.status;
        }
      }, {
        key: "setStatus",
        value: function setStatus(status) {
          this.status = status;
        }
      }, {
        key: "startRequest",
        value: function startRequest() {
          var _this2 = this;

          this.xhr = new XMLHttpRequest();
          this.xhr.offline = false;
          var url = "/favicon.ico?_=".concat(new Date().getTime());
          this.triggerEvent(Event.NETWORK_RECONNECTING, {
            date: new Date()
          }, false);
          this.xhr.open('HEAD', url, true);
          this.xhr.timeout = this.options.delay - 1;

          this.xhr.ontimeout = function () {
            _this2.xhr.abort();

            _this2.xhr = null;
          };

          this.xhr.onload = function () {
            _this2.onUp();
          };

          this.xhr.onerror = function () {
            _this2.onDown();
          };

          try {
            this.xhr.send();
          } catch (e) {
            this.onDown();
          }
        }
      }, {
        key: "onUp",
        value: function onUp() {
          this.triggerEvent(Event.NETWORK_RECONNECTING_SUCCESS, {
            date: new Date()
          }, false);

          if (this.getStatus() !== Event.NETWORK_ONLINE) {
            this.triggerEvent(Event.NETWORK_ONLINE, {
              date: new Date()
            }, false);
          }

          this.setStatus(Event.NETWORK_ONLINE);
        }
      }, {
        key: "onDown",
        value: function onDown() {
          this.triggerEvent(Event.NETWORK_RECONNECTING_FAILURE, {
            date: new Date()
          }, false);

          if (this.getStatus() !== Event.NETWORK_OFFLINE) {
            this.triggerEvent(Event.NETWORK_OFFLINE, {
              date: new Date()
            }, false);
          }

          this.setStatus(Event.NETWORK_OFFLINE);
        }
      }, {
        key: "startCheck",
        value: function startCheck() {
          var _this3 = this;

          this.stopCheck();
          this.startRequest();
          this.checkInterval = setInterval(function () {
            _this3.startRequest();
          }, this.options.delay);
        }
      }, {
        key: "stopCheck",
        value: function stopCheck() {
          if (this.checkInterval !== null) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
          }
        }
      }], [{
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return _get(_getPrototypeOf(Network), "DOMInterface", this).call(this, Network, options);
        }
      }]);

      return Network;
    }(Component);

    return Network;
  }();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var api = {};
  /**
   * ------------------------------------------------------------------------
   * Network
   * ------------------------------------------------------------------------
   */

  api.network = Network.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Notification
   * ------------------------------------------------------------------------
   */

  api.notification = Notification.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Modal
   * ------------------------------------------------------------------------
   */
  // generic

  api.modal = Modal.DOMInterface; // prompt modal

  api.prompt = Prompt.DOMInterface; // confirm modal

  api.confirm = Confirm.DOMInterface; // loader modal

  api.modalLoader = Loader$1.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Collapse
   * ------------------------------------------------------------------------
   */

  api.collapse = Collapse.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Alert
   * ------------------------------------------------------------------------
   */

  api.alert = Alert.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Accordion
   * ------------------------------------------------------------------------
   */

  api.accordion = Accordion.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Tab
   * ------------------------------------------------------------------------
   */

  api.tab = Tab.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Progress
   * ------------------------------------------------------------------------
   */

  api.progress = Progress.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Loader
   * ------------------------------------------------------------------------
   */

  api.loader = Loader.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Off canvas
   * ------------------------------------------------------------------------
   */

  api.offCanvas = OffCanvas.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Selectbox
   * ------------------------------------------------------------------------
   */

  api.selectbox = function (options) {
    if (options.search) {
      // search selectbox
      return SelectboxSearch.DOMInterface(options);
    } // generic selectbox


    return Selectbox.DOMInterface(options);
  };
  /**
   * ------------------------------------------------------------------------
   * Dropdown
   * ------------------------------------------------------------------------
   */


  api.dropdown = Dropdown.DOMInterface;
  window.phonon = api;

  return api;

}));
//# sourceMappingURL=phonon.js.map
