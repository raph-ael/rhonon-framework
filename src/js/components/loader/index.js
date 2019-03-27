/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import { createJqueryPlugin } from '../../common/utils';
import Event from '../../common/events';

const Loader = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'loader';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    color: null,
    size: null,
  };
  const DATA_ATTRS_PROPERTIES = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Loader extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);

      // set color
      const loaderSpinner = this.getSpinner();
      if (typeof this.options.color === 'string'
        && !loaderSpinner.classList.contains(`color-${this.options.color}`)) {
        loaderSpinner.classList.add(`color-${this.options.color}`);
      }

      this.customSize = this.options.size !== null;
    }

    getClientSize() {
      if (!this.customSize) {
        const size = this.options.element.getBoundingClientRect();
        return size.height;
      }

      return this.options.size;
    }

    getSpinner() {
      return this.options.element.querySelector('.loader-spinner');
    }

    show() {
      if (this.options.element.classList.contains('hide')) {
        this.options.element.classList.remove('hide');
      }

      this.triggerEvent(Event.SHOW);

      const size = this.getClientSize();
      this.options.size = size;

      if (this.customSize) {
        this.options.element.style.width = `${this.options.size}px`;
        this.options.element.style.height = `${this.options.size}px`;

        const loaderSpinner = this.getSpinner();
        loaderSpinner.style.width = `${this.options.size}px`;
        loaderSpinner.style.height = `${this.options.size}px`;
      }

      this.triggerEvent(Event.SHOWN);

      return true;
    }

    animate(startAnimation = true) {
      if (startAnimation) {
        this.show();
      } else {
        this.hide();
      }

      const loaderSpinner = this.getSpinner();

      if (startAnimation
        && !loaderSpinner.classList.contains('loader-spinner-animated')) {
        loaderSpinner.classList.add('loader-spinner-animated');
        return true;
      }

      if (!startAnimation
        && loaderSpinner.classList.contains('loader-spinner-animated')) {
        loaderSpinner.classList.remove('loader-spinner-animated');
      }

      return true;
    }

    hide() {
      if (!this.options.element.classList.contains('hide')) {
        this.options.element.classList.add('hide');
      }

      this.triggerEvent(Event.HIDE);

      this.triggerEvent(Event.HIDDEN);

      return true;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Loader, options);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Loader);

  return Loader;
})(window.$ ? window.$ : null);

export default Loader;
