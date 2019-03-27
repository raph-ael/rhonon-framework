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
  (global = global || self, global['phonon-spa'] = factory());
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

  function dispatchPageEvent(eventName, pageName) {
    var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var fullEventName = "".concat(pageName, ".").concat(eventName);
    window.dispatchEvent(new CustomEvent(fullEventName, {
      detail: detail
    }));
    document.dispatchEvent(new CustomEvent(fullEventName, {
      detail: detail
    }));
  }

  var Page = function () {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'page';
    var VERSION = '2.0.0';
    var TEMPLATE_SELECTOR = '[data-template]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Page =
    /*#__PURE__*/
    function () {
      /**
       * Creates an instance of Page.
       * @param {string} pageName
       */
      function Page(pageName) {
        _classCallCheck(this, Page);

        this.name = pageName;
        this.events = [];
        this.templatePath = null;
        this.renderFunction = null;
        this.route = "/".concat(pageName);
        this.routeRegex = null;
        this.routeParams = [];
        this.setRoute("/".concat(pageName));
      } // getters


      _createClass(Page, [{
        key: "getEvents",

        /**
         * Get events
         * @returns {Function[]}
         */
        value: function getEvents() {
          return this.events;
        }
        /**
         * Get template
         * @returns {string}
         */

      }, {
        key: "getTemplate",
        value: function getTemplate() {
          return this.template;
        }
        /**
         * Get route
         * @returns {string}
         */

      }, {
        key: "getRoute",
        value: function getRoute() {
          return {
            route: this.route,
            regex: this.routeRegex,
            params: this.routeParams
          };
        }
        /**
         * Set route
         * @returns {undefined}
         */

      }, {
        key: "setRoute",
        value: function setRoute(route) {
          var regParams = /{(.*?)}/g;
          this.route = route;
          this.routeRegex = "".concat(route.replace(/({.*?})/g, '(.*?)'), "$");
          this.routeParams = (route.match(regParams) || []).map(function (e) {
            return e.replace(regParams, '$1');
          });
        }
      }, {
        key: "getRouteLink",
        value: function getRouteLink() {
          var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var reg = /{(.*?)}/g;

          var _this$getRoute = this.getRoute(),
              route = _this$getRoute.route;

          var linkWithParams = (route.match(reg) || []).reduce(function (cur, param) {
            var paramName = param.replace(/{|}/g, '');
            return cur.replace(new RegExp(param), params ? params[paramName] : 'null');
          }, route);
          return linkWithParams;
        }
      }, {
        key: "validHash",
        value: function validHash(hash) {
          var link = this.getRouteLink(this.getParams(hash));
          return link === hash;
        }
      }, {
        key: "getParams",
        value: function getParams(hash) {
          var hashParams = {};

          var _this$getRoute2 = this.getRoute(),
              regex = _this$getRoute2.regex,
              params = _this$getRoute2.params;

          var hashValues = (new RegExp(regex, 'g').exec(hash) || []).slice(1);
          params.forEach(function (p, i) {
            hashParams[p] = hashValues[i];
          });
          return hashParams;
        }
        /**
         * Get render function
         * @returns {Function}
         */

      }, {
        key: "getRenderFunction",
        value: function getRenderFunction() {
          return this.renderFunction;
        }
      }, {
        key: "renderTemplate",
        value: function () {
          var _renderTemplate = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2() {
            var pageElement, render;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    pageElement = document.querySelector("[data-page=\"".concat(this.name, "\"]"));

                    render =
                    /*#__PURE__*/
                    function () {
                      var _ref = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee(DOMPage, template, elements) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                if (elements) {
                                  Array.from(elements).forEach(function (el) {
                                    el.innerHTML = template;
                                  });
                                } else {
                                  DOMPage.innerHTML = template;
                                }

                              case 1:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee, this);
                      }));

                      return function render(_x, _x2, _x3) {
                        return _ref.apply(this, arguments);
                      };
                    }();

                    if (this.getRenderFunction()) {
                      render = this.getRenderFunction();
                    }

                    _context2.next = 5;
                    return render(pageElement, this.getTemplate(), Array.from(pageElement.querySelectorAll(TEMPLATE_SELECTOR) || []));

                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function renderTemplate() {
            return _renderTemplate.apply(this, arguments);
          }

          return renderTemplate;
        }() // public

        /**
         *
         * @param {*} callbackFn
         */

      }, {
        key: "addEvents",
        value: function addEvents(callbackFn) {
          this.events.push(callbackFn);
        }
        /**
         * Use the given template
         *
         * @param {string} template
         * @param {Function} renderFunction
         */

      }, {
        key: "setTemplate",
        value: function setTemplate() {
          var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var renderFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (typeof template !== 'string') {
            throw new Error("The template path must be a string. ".concat(_typeof(template), " is given"));
          }

          this.template = template;

          if (typeof renderFunction === 'function') {
            this.renderFunction = renderFunction;
          }
        }
        /**
         * Add a transition handler
         *
         * @param {Function} fn
         */

      }, {
        key: "preventTransition",
        value: function preventTransition(fn) {
          if (typeof fn !== 'function') {
            throw new Error("".concat(NAME, ": invalid function to handle page transitions"));
          }

          this.preventTransitionFn = fn;
        }
      }, {
        key: "getPreventTransition",
        value: function getPreventTransition() {
          return this.preventTransitionFn;
        }
        /**
         * Trigger scopes
         * @param {string} eventName
         * @param {{}} [eventParams={}]
         */

      }, {
        key: "triggerScopes",
        value: function triggerScopes(eventName) {
          var _this = this;

          var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var eventNameAlias = "on".concat(eventName.charAt(0).toUpperCase()).concat(eventName.slice(1));
          this.events.forEach(function (scope) {
            var scopeEvent = scope[eventName];
            var scopeEventAlias = scope[eventNameAlias];

            if (typeof scopeEvent === 'function') {
              scopeEvent.apply(_this, [eventParams]);
            } // trigger the event alias


            if (typeof scopeEventAlias === 'function') {
              scopeEventAlias.apply(_this, [eventParams]);
            }
          });
          dispatchPageEvent(eventName, this.name, eventParams);
        }
      }], [{
        key: "version",
        get: function get() {
          return "".concat(NAME, ".").concat(VERSION);
        }
      }]);

      return Page;
    }();

    return Page;
  }();

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

  var Pager = function () {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'pager';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      hashPrefix: '#!',
      useHash: true,
      defaultPage: null,
      animatePages: true
    };
    var currentPage;
    var lastHash = null;
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Pager =
    /*#__PURE__*/
    function () {
      /**
       * @constructor
       *
       * @param options {Object}
       */
      function Pager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Pager);

        this.options = Object.assign(DEFAULT_PROPERTIES, options);
        this.pages = [];
        this.started = false; // add global listeners such ash hash change, navigation, etc.

        this.addPagerEvents(); // faster way to init pages before the DOM is ready

        this.onDOMLoaded();
      } // private


      _createClass(Pager, [{
        key: "_",
        value: function _(selector) {
          return document.querySelector(selector);
        }
      }, {
        key: "getRoute",
        value: function getRoute() {
          return window.location.hash.split(this.options.hashPrefix)[1];
        }
      }, {
        key: "getHash",
        value: function getHash() {
          return window.location.hash;
        }
      }, {
        key: "getHashParams",
        value: function getHashParams() {
          var page = this.getPageModel(currentPage);
          return page.getParams(this.getHash());
        }
      }, {
        key: "getPageFromHash",
        value: function getPageFromHash() {
          var hash = this.getHash() || '';
          var page = this.getPages().find(function (p) {
            return hash.match(p.getRoute().regex);
          });
          return page ? page.name : null;
        }
      }, {
        key: "setHash",
        value: function setHash(pageName) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          var page = this.getPageModel(pageName);

          if (!page) {
            throw new Error("Cannot change the route of unknown page ".concat(pageName));
          }

          window.location.hash = "".concat(this.options.hashPrefix).concat(page.getRouteLink(params));
        }
      }, {
        key: "isPageOf",
        value: function isPageOf(pageName1, pageName2) {
          var page1 = this.getPageModel(pageName1);
          var page2 = this.getPageModel(pageName2);
          return page1 && page2 && page1.name === page2.name;
        }
        /**
         * Attaches the main events for tracking hash changes,
         * click on navigation buttons and links and back history
         */

      }, {
        key: "addPagerEvents",
        value: function addPagerEvents() {
          var _this = this;

          document.addEventListener('click', function (event) {
            return _this.onClick(event);
          });
          document.addEventListener('DOMContentLoaded', function (event) {
            return _this.onDOMLoaded(event);
          });

          if (this.options.useHash) {
            window.addEventListener('hashchange', function (event) {
              return _this.onHashChange(event);
            });
          }
        } // getters

      }, {
        key: "preventChangePage",
        value: function () {
          var _preventChangePage = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(oldPageName, pageName, params) {
            var oldPage, preventFn;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    oldPage = this.getPageModel(oldPageName);
                    preventFn = oldPage.getPreventTransition();

                    if (!(typeof preventFn === 'function')) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return", preventFn(oldPageName, pageName, params));

                  case 4:
                    return _context.abrupt("return", false);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function preventChangePage(_x, _x2, _x3) {
            return _preventChangePage.apply(this, arguments);
          }

          return preventChangePage;
        }() // public

      }, {
        key: "showPage",
        value: function () {
          var _showPage = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(pageName) {
            var _this2 = this;

            var params,
                back,
                oldPage,
                oldPageName,
                newPage,
                pageModel,
                hashParams,
                onPageAnimationEnd,
                _args2 = arguments;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    params = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
                    back = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

                    if (!(this.options.useHash && this.getPageFromHash() !== pageName)) {
                      _context2.next = 5;
                      break;
                    }

                    this.setHash(pageName, params);
                    return _context2.abrupt("return");

                  case 5:
                    oldPage = this._('.current');
                    oldPageName = null;

                    if (!oldPage) {
                      _context2.next = 19;
                      break;
                    }

                    oldPageName = oldPage.getAttribute('data-page');

                    if (!this.isPageOf(pageName, oldPageName)) {
                      _context2.next = 11;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 11:
                    _context2.next = 13;
                    return this.preventChangePage(oldPageName, pageName, params);

                  case 13:
                    if (!_context2.sent) {
                      _context2.next = 16;
                      break;
                    }

                    if (this.options.useHash) {
                      window.location.hash = lastHash;
                    }

                    return _context2.abrupt("return");

                  case 16:
                    oldPage.classList.remove('current'); // history

                    window.history.replaceState({
                      page: pageName
                    }, oldPageName);
                    this.triggerPageEvent(oldPageName, Event.HIDE);

                  case 19:
                    currentPage = pageName; // new page

                    newPage = this._("[data-page=\"".concat(currentPage, "\"]"));
                    newPage.classList.add('current'); // render template

                    pageModel = this.getPageModel(currentPage);
                    hashParams = pageModel.getParams(this.getHash());
                    this.triggerPageEvent(currentPage, Event.SHOW, hashParams);

                    if (!(pageModel && pageModel.getTemplate())) {
                      _context2.next = 28;
                      break;
                    }

                    _context2.next = 28;
                    return pageModel.renderTemplate();

                  case 28:
                    if (oldPage) {
                      // use of prototype-oriented language
                      oldPage.back = back;
                      oldPage.previousPageName = oldPageName;

                      onPageAnimationEnd = function onPageAnimationEnd() {
                        if (oldPage.classList.contains('animate')) {
                          oldPage.classList.remove('animate');
                        }

                        oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');

                        _this2.triggerPageEvent(currentPage, Event.SHOWN, hashParams);

                        _this2.triggerPageEvent(oldPage.previousPageName, Event.HIDDEN);

                        oldPage.removeEventListener(Event.ANIMATION_END, onPageAnimationEnd);
                      };

                      if (this.options.animatePages) {
                        oldPage.addEventListener(Event.ANIMATION_END, onPageAnimationEnd);
                        oldPage.classList.add('animate');
                      } else {
                        onPageAnimationEnd();
                      }

                      oldPage.classList.add(back ? 'pop-page' : 'push-page');
                    }

                    lastHash = this.getHash();

                  case 30:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function showPage(_x4) {
            return _showPage.apply(this, arguments);
          }

          return showPage;
        }()
      }, {
        key: "addUniquePageModel",
        value: function addUniquePageModel(pageName) {
          if (!this.getPageModel(pageName)) {
            this.getPages().push(new Page(pageName));
          }
        }
      }, {
        key: "getPageModel",
        value: function getPageModel(pageName) {
          return this.getPages().find(function (page) {
            return page.name === pageName;
          });
        }
      }, {
        key: "triggerPageEvent",
        value: function triggerPageEvent(pageName, eventName) {
          var eventParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
          var pageModel = this.getPageModel(pageName);

          if (pageModel) {
            pageModel.triggerScopes(eventName, eventParams);
          }
        }
      }, {
        key: "onClick",
        value: function onClick(event) {
          var pageName = event.target.getAttribute('data-navigate');
          var backAnimation = event.target.getAttribute('data-pop-page') === 'true';

          if (!pageName) {
            return;
          }

          this.showPage(pageName, null, backAnimation);
        }
      }, {
        key: "onHashChange",
        value: function onHashChange() {
          var params = this.getHashParams();
          var navPage = this.getPageFromHash(); // avoid concurrent pages if prevent page change is defined

          if (navPage === currentPage) {
            this.triggerPageEvent(currentPage, Event.HASH, params);
          }

          if (navPage) {
            this.showPage(navPage, null, false, params);
          }
        }
        /**
         * Queries the page nodes in the DOM
         */

      }, {
        key: "onDOMLoaded",
        value: function onDOMLoaded() {
          var _this3 = this;

          var pages = document.querySelectorAll('[data-page]');

          if (!pages) {
            return;
          }

          pages.forEach(function (page) {
            /*
             * the page name can be given with the attribute data-page
             * or with its node name
             */
            var pageName = page.getAttribute('data-page') || page.nodeName;

            _this3.addUniquePageModel(pageName);
          });
        }
      }, {
        key: "getPage",
        value: function getPage(pageName) {
          var addPageModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

          if (addPageModel) {
            this.addUniquePageModel(pageName);
          }

          return this.getPageModel(pageName);
        }
      }, {
        key: "getPages",
        value: function getPages() {
          return this.pages;
        }
      }, {
        key: "start",
        value: function start() {
          var forceDefaultPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var force = forceDefaultPage; // check if the app has been already started

          if (this.started) {
            throw new Error("".concat(NAME, ". The app has been already started."));
          }

          this.started = true; // force default page on Cordova

          if (window.cordova) {
            force = true;
          }

          var pageName = this.getPageFromHash();

          if (!this.getPageModel(pageName)) {
            pageName = this.options.defaultPage;
          }

          var page = this.getPageModel(pageName);

          if (force && !this.options.defaultPage) {
            throw new Error("".concat(NAME, ". The default page must exist for forcing its launch!"));
          }
          /*
           * if the app is configurated to use hash tracking
           * we add the page dynamically in the url
           */


          if (this.options.useHash) {
            if (!page.validHash(this.getRoute())) {
              this.setHash(pageName);
            }
          }

          this.showPage(force ? this.options.defaultPage : pageName);
        } // static

      }], [{
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new Pager(options);
        }
      }, {
        key: "version",
        get: function get() {
          return "".concat(NAME, ".").concat(VERSION);
        }
      }]);

      return Pager;
    }();

    return Pager;
  }();

  /**
  * --------------------------------------------------------------------------
  * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
  * --------------------------------------------------------------------------
  */
  var Binder = function () {
    /**
    * ------------------------------------------------------------------------
    * Constants
    * ------------------------------------------------------------------------
    */
    var NAME = 'i18n-binder';
    var VERSION = '2.0.0';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Binder =
    /*#__PURE__*/
    function () {
      /**
       * @param {HTMLElement} element
       * @param {Object} data
       */
      function Binder(element, data) {
        _classCallCheck(this, Binder);

        this.element = element;
        this.data = data;

        if (!this.isElement(this.element)) {
          console.log('Warning, an element is invalid');
          return;
        } // array of HTMLElement


        if (this.element.length && this.element.length > 0) {
          this.setNodes(this.element);
        } else {
          // single HTMLElement
          this.setNode(this.element);
        }
      } // getters


      _createClass(Binder, [{
        key: "isElement",

        /**
         * Checks if the given argument is a DOM element
         * @param {Element} the argument to test
         * @returns {boolean} true if the object is a DOM element, false otherwise
         */
        value: function isElement(element) {
          if (element === null) {
            return false;
          }

          return element instanceof Node || element instanceof NodeList;
        }
        /**
        * Binds some text to the given DOM element
        * @param {HTMLElement} element
        * @param {String} text
        */

      }, {
        key: "setText",
        value: function setText(element, text) {
          if (!('textContent' in element)) {
            element.innerText = text;
          } else {
            element.textContent = text;
          }
        }
        /**
         * Binds some html to the given DOM element
         * @param {HTMLElement} element
         * @param {String} text
         */

      }, {
        key: "setHtml",
        value: function setHtml(element, text) {
          element.innerHTML = text;
        }
        /**
         * Binds custom attributes to the given DOM element
         * @param {HTMLElement} element
         * @param {String} attr
         * @param {String} text
         */

      }, {
        key: "setAttribute",
        value: function setAttribute(element, attr, text) {
          element.setAttribute(attr, text);
        }
        /**
         * Binds DOM elements
         * @param {HTMLElement} element
         */

      }, {
        key: "setNode",
        value: function setNode(element) {
          var attr = element.getAttribute('data-t');

          if (!attr) {
            return;
          }

          attr = attr.trim();
          var r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
          var m;

          while (m = r.exec(attr)) {
            var key = m[1].trim();
            var value = m[2].trim().replace(',', '');
            var i18nValue = this.data[value];

            if (!this.data[value]) {
              console.log("".concat(NAME, ". Warning, ").concat(value, " does not exist."));
              i18nValue = value;
            }

            var methodName = "set".concat(key.charAt(0).toUpperCase()).concat(key.slice(1));

            if (this[methodName]) {
              this[methodName](element, i18nValue);
            } else {
              this.setAttribute(element, key, i18nValue);
            }
          }
        }
        /**
         * Binds DOM elements
         * @param {HTMLElement} element
         */

      }, {
        key: "setNodes",
        value: function setNodes(element) {
          var _this = this;

          Array.from(element).forEach(function (el) {
            return _this.setNode(el);
          });
        }
      }], [{
        key: "version",
        get: function get() {
          return "".concat(NAME, ".").concat(VERSION);
        }
      }]);

      return Binder;
    }();

    return Binder;
  }();

  var I18n = function () {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'i18n';
    var VERSION = '2.0.0';
    var DEFAULT_PROPERTIES = {
      fallbackLocale: 'en-US',
      locale: 'en-US',
      bind: false,
      data: null
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var I18n =
    /*#__PURE__*/
    function () {
      /**
       * Creates an instance of I18n.
       * @param {fallbackLocale: string, locale: string, bind: boolean, data: {[lang: string]: {[key: string]: string}}}
       */
      function I18n() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, I18n);

        this.options = Object.assign(DEFAULT_PROPERTIES, options);

        if (typeof this.options.fallbackLocale !== 'string') {
          throw new Error("".concat(NAME, ". The fallback locale is mandatory and must be a string."));
        }

        if (this.options.data === null) {
          throw new Error("".concat(NAME, ". There is no translation data."));
        }

        if (_typeof(this.options.data[this.options.fallbackLocale]) !== 'object') {
          throw new Error("".concat(NAME, ". The fallback locale must necessarily have translation data."));
        }

        this.setLocale(this.options.locale, this.options.bind);
      }

      _createClass(I18n, [{
        key: "getLocale",
        value: function getLocale() {
          return this.options.locale;
        }
      }, {
        key: "getFallbackLocale",
        value: function getFallbackLocale() {
          return this.options.fallbackLocale;
        }
        /**
         * Set default locale
         * @param {string} locale
         * @param {boolean} [bind=true]
         */

      }, {
        key: "setLocale",
        value: function setLocale(locale) {
          var bind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          if (_typeof(this.options.data[locale]) !== 'object') {
            console.error("".concat(NAME, ". ").concat(locale, " has no data, fallback in ").concat(this.options.fallbackLocale, "."));
          } else {
            this.options.locale = locale;
          }

          if (bind) {
            this.updateHtml();
          }
        }
      }, {
        key: "getLanguages",
        value: function getLanguages() {
          return Object.keys(this.options.data);
        }
      }, {
        key: "insertValues",
        value: function insertValues() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var injectableValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if (typeof value !== 'string') {
            return undefined;
          }

          var match = value.match(/:([a-zA-Z-_0-9]+)/);

          if (match) {
            value = value.replace(match[0], injectableValues[match[1]]);
          }

          if (value.match(/:([a-zA-Z-_0-9]+)/)) {
            return this.insertValues(value, injectableValues);
          }

          return value;
        }
      }, {
        key: "translate",
        value: function translate() {
          var _this = this;

          var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var data = this.options.data[this.options.locale];

          if (!data) {
            data = this.options.data[this.options.fallbackLocale];
          }

          if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
            if (Array.isArray(keyName)) {
              var keys = Object.keys(data).filter(function (key) {
                return keyName.indexOf(key) > -1;
              });
              var filteredData = {};
              keys.forEach(function (key) {
                filteredData[key] = _this.insertValues(data[key], inject);
              });
              data = filteredData;
            }

            var dataMap = {};

            for (var key in data) {
              dataMap[key] = this.insertValues(data[key], inject);
            }

            return dataMap;
          }

          return this.insertValues(data[keyName], inject);
        } // alias of t()

      }, {
        key: "t",
        value: function t() {
          var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return this.translate(keyName, inject);
        }
        /**
         * Updates the HTML views
         * @param {HTMLElement} element
         */

      }, {
        key: "updateHtml",
        value: function updateHtml() {
          var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var el = element;

          if (!el) {
            el = document.querySelectorAll('[data-t]');
          }

          if (typeof el === 'string') {
            el = document.querySelector(el);
          }
          /* eslint no-new: 0 */


          new Binder(el, this.t());
        } // static

      }], [{
        key: "DOMInterface",
        value: function DOMInterface(options) {
          return new I18n(options);
        }
      }, {
        key: "version",
        get: function get() {
          return "".concat(NAME, ".").concat(VERSION);
        }
      }]);

      return I18n;
    }();

    return I18n;
  }();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var api = {};
  /**
   * ------------------------------------------------------------------------
   * Pager
   * ------------------------------------------------------------------------
   */

  api.pager = function (options) {
    /* eslint no-underscore-dangle: 0 */
    if (typeof api._pager === 'undefined') {
      api._pager = Pager.DOMInterface(options);
    }

    return api._pager;
  };
  /**
   * ------------------------------------------------------------------------
   * i18n
   * ------------------------------------------------------------------------
   */


  api.i18n = I18n.DOMInterface;

  if (window.phonon) {
    window.phonon.pager = api.pager;
    window.phonon.i18n = api.i18n;
  } else {
    window.phonon = api;
  }

  return api;

}));
//# sourceMappingURL=phonon-spa.js.map
