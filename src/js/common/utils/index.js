export function generateId() {
  return Math.random().toString(36).substr(2, 10);
}

export function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target;
    }
  }

  return null;
}

export function findTargetById(target, parentId) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute('id') === parentId) {
      return target;
    }
  }

  return null;
}

export function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target;
    }
  }

  return null;
}

/* eslint no-param-reassign: 0 */
export function createJqueryPlugin($ = null, name, obj) {
  if (!$) {
    return;
  }

  const mainFn = function (options = {}) {
    const opts = options;
    if (this[0]) {
      opts.element = this[0];
    }

    return obj.DOMInterface(opts);
  };

  $.fn[name] = mainFn;
  $.fn[name].Constructor = obj;
  $.fn[name].noConflict = mainFn;
}

export function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
