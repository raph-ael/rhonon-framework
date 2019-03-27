/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/

const Binder = (() => {
  /**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  const NAME = 'i18n-binder';
  const VERSION = '2.0.0';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Binder {
    /**
     * @param {HTMLElement} element
     * @param {Object} data
     */
    constructor(element, data) {
      this.element = element;
      this.data = data;

      if (!this.isElement(this.element)) {
        console.log('Warning, an element is invalid');
        return;
      }

      // array of HTMLElement
      if (this.element.length && this.element.length > 0) {
        this.setNodes(this.element);
      } else {
        // single HTMLElement
        this.setNode(this.element);
      }
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`;
    }

    /**
     * Checks if the given argument is a DOM element
     * @param {Element} the argument to test
     * @returns {boolean} true if the object is a DOM element, false otherwise
     */
    isElement(element) {
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
    setText(element, text) {
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
    setHtml(element, text) {
      element.innerHTML = text;
    }

    /**
     * Binds custom attributes to the given DOM element
     * @param {HTMLElement} element
     * @param {String} attr
     * @param {String} text
     */
    setAttribute(element, attr, text) {
      element.setAttribute(attr, text);
    }

    /**
     * Binds DOM elements
     * @param {HTMLElement} element
     */
    setNode(element) {
      let attr = element.getAttribute('data-t');
      if (!attr) {
        return;
      }

      attr = attr.trim();

      const r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
      let m;

      while (m = r.exec(attr)) {
        const key = m[1].trim();
        const value = m[2].trim().replace(',', '');
        let i18nValue = this.data[value];

        if (!this.data[value]) {
          console.log(`${NAME}. Warning, ${value} does not exist.`);
          i18nValue = value;
        }

        const methodName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;

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
    setNodes(element) {
      Array.from(element).forEach(el => this.setNode(el));
    }
  }

  return Binder;
})();

export default Binder;
