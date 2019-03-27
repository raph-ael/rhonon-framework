/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Binder from './binder';

const I18n = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'i18n';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    fallbackLocale: 'en-US',
    locale: 'en-US',
    bind: false,
    data: null,
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class I18n {
    /**
     * Creates an instance of I18n.
     * @param {fallbackLocale: string, locale: string, bind: boolean, data: {[lang: string]: {[key: string]: string}}}
     */
    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      if (typeof this.options.fallbackLocale !== 'string') {
        throw new Error(`${NAME}. The fallback locale is mandatory and must be a string.`);
      }

      if (this.options.data === null) {
        throw new Error(`${NAME}. There is no translation data.`);
      }

      if (typeof this.options.data[this.options.fallbackLocale] !== 'object') {
        throw new Error(`${NAME}. The fallback locale must necessarily have translation data.`);
      }

      this.setLocale(this.options.locale, this.options.bind);
    }

    static get version() {
      return `${NAME}.${VERSION}`;
    }

    getLocale() {
      return this.options.locale;
    }

    getFallbackLocale() {
      return this.options.fallbackLocale;
    }

    /**
     * Set default locale
     * @param {string} locale
     * @param {boolean} [bind=true]
     */
    setLocale(locale, bind = false) {
      if (typeof this.options.data[locale] !== 'object') {
        console.error(`${NAME}. ${locale} has no data, fallback in ${this.options.fallbackLocale}.`);
      } else {
        this.options.locale = locale;
      }

      if (bind) {
        this.updateHtml();
      }
    }

    getLanguages() {
      return Object.keys(this.options.data);
    }

    insertValues(value = null, injectableValues = {}) {
      if (typeof value !== 'string') {
        return undefined;
      }

      const match = value.match(/:([a-zA-Z-_0-9]+)/);
      if (match) {
        value = value.replace(match[0], injectableValues[match[1]]);
      }

      if (value.match(/:([a-zA-Z-_0-9]+)/)) {
        return this.insertValues(value, injectableValues);
      }

      return value;
    }

    translate(keyName = null, inject = {}) {
      let data = this.options.data[this.options.locale];
      if (!data) {
        data = this.options.data[this.options.fallbackLocale];
      }

      if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
        if (Array.isArray(keyName)) {
          const keys = Object.keys(data).filter(key => keyName.indexOf(key) > -1);
          const filteredData = {};
          keys.forEach((key) => {
            filteredData[key] = this.insertValues(data[key], inject);
          });
          data = filteredData;
        }

        const dataMap = {};
        for (const key in data) {
          dataMap[key] = this.insertValues(data[key], inject);
        }

        return dataMap;
      }

      return this.insertValues(data[keyName], inject);
    }

    // alias of t()
    t(keyName = null, inject = {}) {
      return this.translate(keyName, inject);
    }

    /**
     * Updates the HTML views
     * @param {HTMLElement} element
     */
    updateHtml(element = null) {
      let el = element;

      if (!el) {
        el = document.querySelectorAll('[data-t]');
      }

      if (typeof el === 'string') {
        el = document.querySelector(el);
      }

      /* eslint no-new: 0 */
      new Binder(el, this.t());
    }

    // static
    static DOMInterface(options) {
      return new I18n(options);
    }
  }

  return I18n;
})();

export default I18n;
