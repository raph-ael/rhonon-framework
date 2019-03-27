/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import { dispatchElementEvent, dispatchWinDocEvent } from '../common/events/dispatch';
import { generateId } from '../common/utils/index';
import Event from '../common/events';
import ComponentManager, { setAttributesConfig, getAttributesConfig } from './componentManager';

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

export default class Component {
  constructor(
    name,
    version,
    defaultOptions = {},
    options = {},
    optionAttrs = [],
    supportDynamicElement = false,
    addToStack = false,
  ) {
    this.name = name;
    this.version = version;
    this.options = options;
    this.eventHandlers = [];

    Object.keys(defaultOptions).forEach((prop) => {
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
      throw new Error(`${this.name}. The element is not a valid HTMLElement.`);
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

    this.elementListener = event => this.onBeforeElementEvent(event);
  }

  getConfig(key = null, defaultValue = null) {
    /**
     * If the key isn't specified, we return the full configuration (Object)
     */
    if (!key) {
      return this.options;
    }

    return typeof this.options[key] === 'undefined' ? defaultValue : this.options[key];
  }

  updateConfig(options) {
    this.options = Object.assign(
      this.options,
      this.assignJsConfig(this.getAttributes(), options),
    );

    // then, set the new data attributes to the element
    this.setAttributes();
  }

  addEventsHandler(options) {
    const scope = Object.keys(options).reduce((cur, key) => {
      if (typeof options[key] === 'function') {
        cur[key] = options[key];
      }

      return cur;
    }, {});

    if (Object.keys(scope).length > 0) {
      this.eventHandlers.push(scope);
    }
  }

  assignJsConfig(attrConfig, jsConfig) {
    const config = attrConfig;
    this.optionAttrs.forEach((key) => {
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
    this.registeredElements.forEach((element) => {
      this.unregisterElement(element);
    });
  }

  unregisterElement(element) {
    const registeredElementIndex = this.registeredElements
      .findIndex(el => el.target === element.target && el.event === element.event);

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
    }

    // event names can be with dot notation like reconnecting.success
    const eventNameObject = eventName.split('.').reduce((acc, current, index) => {
      if (index === 0) {
        return current;
      }

      return acc + current.charAt(0).toUpperCase() + current.slice(1);
    });

    const eventNameAlias = `on${eventNameObject.charAt(0).toUpperCase()}${eventNameObject.slice(1)}`;

    // object event
    this.eventHandlers.forEach((scope) => {
      if (typeof scope[eventNameObject] === 'function') {
        scope[eventNameObject].apply(this, [detail]);
      }

      if (typeof scope[eventNameAlias] === 'function') {
        this.options[eventNameAlias].apply(this, [detail]);
      }
    });

    if (objectEventOnly) {
      return;
    }

    // dom event
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

  /**
   * @emits {Event} emit events registered by the component
   * @param {Event} event
   */
  onElementEvent() {
    /* eslint class-methods-use-this: 0 */
  }

  static identifier() {
    return this.name;
  }

  static DOMInterface(ComponentClass, options, currentComponents = []) {
    const el = typeof options.element === 'string' ? document.querySelector(options.element) : options.element;
    const component = currentComponents.find(c => c.getElement() === el);

    if (component) {
      component.updateConfig(options);
      component.addEventsHandler(options);
      return component;
    }

    return new ComponentClass(options);
  }
}
