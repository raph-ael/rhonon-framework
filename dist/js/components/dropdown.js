'use strict';

function dispatchWinDocEvent(eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  window.dispatchEvent(new CustomEvent(fullEventName, {
    detail
  }));
  document.dispatchEvent(new CustomEvent(fullEventName, {
    detail
  }));
}
function dispatchElementEvent(domElement, eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  domElement.dispatchEvent(new CustomEvent(fullEventName, {
    detail
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
  window.addEventListener('error', () => {
    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
  });
} // Use available events


let availableEvents = ['mousedown', 'mousemove', 'mouseup'];
let touchScreen = false;

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

const el = document.createElement('div');
const transitions = [{
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
const animations = [{
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
const transitionStart = transitions.find(t => el.style[t.name] !== undefined).start;
const transitionEnd = transitions.find(t => el.style[t.name] !== undefined).end;
const animationStart = animations.find(t => el.style[t.name] !== undefined).start;
const animationEnd = animations.find(t => el.style[t.name] !== undefined).end;
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
  // dropdown
  ITEM_SELECTED: 'itemSelected'
};

const getAttribute = (first, second) => {
  if (first === '') {
    return `data-${second}`;
  }

  return `data-${first}-${second}`;
};

function setAttributesConfig(element, obj = {}, attrs, start = '') {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      let keyStart = key;

      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      setAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    const attr = getAttribute(start, key);
    element.setAttribute(attr, obj[key]);
  });
}
function getAttributesConfig(element, obj = {}, attrs, start = '') {
  const newObj = Object.assign({}, obj);
  const keys = Object.keys(obj);
  keys.forEach(key => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (obj[key] !== null && obj[key].constructor === Object) {
      let keyStart = key;

      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    } // update value


    let value = obj[key]; // default value

    const type = typeof value;
    const attr = getAttribute(start, key);
    const attrValue = element.getAttribute(attr);

    if (attrValue !== null) {
      if (type === 'boolean') {
        // convert string to boolean
        value = attrValue === 'true';
      } else if (!isNaN(attrValue)) {
        value = parseInt(attrValue, 10);
      } else {
        value = attrValue;
      }
    }

    newObj[key] = value;
  });
  return newObj;
}
const stack = [];
var ComponentManager = {
  add(component) {
    stack.push(component);
  },

  remove(component) {
    const index = stack.findIndex(c => Object.is(component, c));

    if (index > -1) {
      stack.splice(index, 1);
    }
  },

  closable(component) {
    return stack.length === 0 || Object.is(stack[stack.length - 1], component);
  }

};

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Component {
  constructor(name, version, defaultOptions = {}, options = {}, optionAttrs = [], supportDynamicElement = false, addToStack = false) {
    this.name = name;
    this.version = version;
    this.options = options;
    Object.keys(defaultOptions).forEach(prop => {
      if (typeof this.options[prop] === 'undefined') {
        this.options[prop] = defaultOptions[prop];
      }
    });
    this.optionAttrs = optionAttrs;
    this.supportDynamicElement = supportDynamicElement;
    this.addToStack = addToStack;
    this.id = generateId();
    const checkElement = !this.supportDynamicElement || this.options.element !== null;

    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element);
    }

    if (checkElement && !this.options.element) {
      throw new Error(`${this.name}. The element is not a HTMLElement.`);
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
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), this.options)); // then, set the new data attributes to the element

      this.setAttributes();
    }

    this.elementListener = event => this.onBeforeElementEvent(event);
  }

  assignJsConfig(attrConfig, jsConfig) {
    const config = attrConfig;
    this.optionAttrs.forEach(key => {
      if (typeof jsConfig[key] !== 'undefined') {
        config[key] = jsConfig[key];
      }
    });
    return config;
  }

  getVersion() {
    return this.version;
  }

  getElement() {
    return this.options.element;
  }

  getId() {
    return this.id;
  }

  registerElements(elements) {
    elements.forEach(element => this.registerElement(element));
  }

  registerElement(element) {
    element.target.addEventListener(element.event, this.elementListener);
    this.registeredElements.push(element);
  }

  unregisterElements() {
    this.registeredElements.forEach(element => {
      this.unregisterElement(element);
    });
  }

  unregisterElement(element) {
    const registeredElementIndex = this.registeredElements.findIndex(el => el.target === element.target && el.event === element.event);

    if (registeredElementIndex > -1) {
      element.target.removeEventListener(element.event, this.elementListener);
      this.registeredElements.splice(registeredElementIndex, 1);
    } else {
      console.error(`Warning! Unknown registered element: ${element.target} with event: ${element.event}.`);
    }
  }

  triggerEvent(eventName, detail = {}, objectEventOnly = false) {
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


    const eventNameObject = eventName.split('.').reduce((acc, current, index) => {
      if (index === 0) {
        return current;
      }

      return acc + current.charAt(0).toUpperCase() + current.slice(1);
    });
    const eventNameAlias = `on${eventNameObject.charAt(0).toUpperCase()}${eventNameObject.slice(1)}`; // object event

    if (typeof this.options[eventNameObject] === 'function') {
      this.options[eventNameObject].apply(this, [detail]);
    }

    if (typeof this.options[eventNameAlias] === 'function') {
      this.options[eventNameAlias].apply(this, [detail]);
    }

    if (objectEventOnly) {
      return;
    } // dom event


    if (this.options.element) {
      dispatchElementEvent(this.options.element, eventName, this.name, detail);
    } else {
      dispatchWinDocEvent(eventName, this.name, detail);
    }
  }

  setAttributes() {
    if (this.optionAttrs.length > 0) {
      setAttributesConfig(this.options.element, this.options, this.optionAttrs);
    }
  }

  getAttributes() {
    const options = Object.assign({}, this.options);
    return getAttributesConfig(this.options.element, options, this.optionAttrs);
  }
  /**
   * the preventClosable method manages concurrency between active components.
   * For example, if there is a shown off-canvas and modal, the last
   * shown component gains the processing priority
   */


  preventClosable() {
    return this.addToStack && !ComponentManager.closable(this);
  }

  onBeforeElementEvent(event) {
    if (this.preventClosable()) {
      return;
    }

    this.onElementEvent(event);
  }

  onElementEvent(event) {//
  }

  static identifier() {
    return this.name;
  }

  static DOMInterface(ComponentClass, options) {
    return new ComponentClass(options);
  }

}

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NAME = 'dropdown';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    default: true,
    search: false
  };
  const DATA_ATTRS_PROPERTIES = ['default', 'search'];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      const selected = this.options.element.querySelector('[data-selected]');
      const item = this.getItemData(selected);
      this.setSelected(item.value, item.text, false);
    }

    setSelected(value = '', text = null, checkExists = true) {
      if (!this.options.default) {
        return false;
      }

      let textDisplay = text;
      this.options.element.querySelector('.default-text').innerHTML = text;
      this.options.element.querySelector('input[type="hidden"]').value = value;
      const items = this.options.element.querySelectorAll('.item') || [];
      let itemFound = false;
      Array.from(items).forEach(item => {
        if (item.classList.contains('selected')) {
          item.classList.remove('selected');
        }

        const data = this.getItemData(item);

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
        throw new Error(`${NAME}. The value "${value}" does not exist in the list of items.`);
      }

      return true;
    }

    getSelected() {
      return this.options.element.querySelector('input[type="hidden"]').value;
    }

    getItemData(item = null) {
      let text = '';
      let value = '';

      if (item) {
        text = item.getAttribute('data-text') || item.innerHTML;
        const selectedTextNode = item.querySelector('.text');

        if (selectedTextNode) {
          text = selectedTextNode.innerHTML;
        }

        value = item.getAttribute('data-value') || '';
      }

      return {
        text,
        value
      };
    }

    onElementEvent(event) {
      if (event.type === Event.START) {
        const dropdown = findTargetByClass(event.target, 'dropdown');
        /*
         * hide the current dropdown only if the event concerns another dropdown
         * hide also if the user clicks outside a dropdown
         */

        if (!dropdown || dropdown !== this.getElement()) {
          this.hide();
        }
      } else if (event.type === 'click') {
        const item = findTargetByClass(event.target, 'item');

        if (item) {
          if (item.classList.contains('disabled')) {
            return;
          }

          const itemInfo = this.getItemData(item);

          if (this.getSelected() !== itemInfo.value) {
            // the user selected another value, we dispatch the event
            this.setSelected(itemInfo.value, itemInfo.text, false);
            const detail = {
              item,
              text: itemInfo.text,
              value: itemInfo.value
            };
            this.triggerEvent(Event.ITEM_SELECTED, detail);
          }

          this.hide();
          return;
        } // don't toggle the dropdown if the event concerns headers, dividers


        const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu');

        if (dropdownMenu) {
          return;
        }

        this.toggle();
      }
    }

    toggle() {
      if (this.options.element.classList.contains('active')) {
        return this.hide();
      }

      return this.show();
    }

    show() {
      if (this.options.element.classList.contains('active')) {
        return false;
      }

      this.options.element.classList.add('active');
      const dropdownMenu = this.options.element.querySelector('.dropdown-menu'); // scroll to top

      dropdownMenu.scrollTop = 0;
      this.triggerEvent(Event.SHOW);
      this.triggerEvent(Event.SHOWN);
      this.registerElement({
        target: dropdownMenu,
        event: 'click'
      });
      this.registerElement({
        target: document.body,
        event: Event.START
      });
      return true;
    }

    hide() {
      if (!this.options.element.classList.contains('active')) {
        return false;
      }

      this.options.element.classList.remove('active');
      this.triggerEvent(Event.HIDE);
      this.triggerEvent(Event.HIDDEN);
      this.unregisterElement({
        target: this.options.element.querySelector('.dropdown-menu'),
        event: 'click'
      });
      this.unregisterElement({
        target: document.body,
        event: Event.START
      });
      return true;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Dropdown, options);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  const components = [];
  const dropdowns = document.querySelectorAll(`.${NAME}`);

  if (dropdowns) {
    Array.from(dropdowns).forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (!config.search) {
        components.push(new Dropdown(config));
      }
    });
  }

  document.addEventListener('click', event => {
    const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu');

    if (dropdownMenu) {
      return;
    }

    const dropdown = findTargetByClass(event.target, 'dropdown');

    if (dropdown) {
      const dataToggleAttr = dropdown.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
        const component = components.find(c => c.getElement() === dropdown);

        if (!component) {
          return;
        }

        component.toggle();
      }
    }
  });
  return Dropdown;
})();

module.exports = Dropdown;
//# sourceMappingURL=dropdown.js.map
