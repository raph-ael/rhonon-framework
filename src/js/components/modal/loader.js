/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Modal from './index';
import Spinner from '../loader/index';
import { getAttributesConfig } from '../componentManager';
import { createJqueryPlugin } from '../../common/utils';

const Loader = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'loader';
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [],
  };
  const DATA_ATTRS_PROPERTIES = [
    'cancelable',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Loader extends Modal {
    constructor(options = {}) {
      const opts = options;
      const template = ''
      + '<div class="modal" tabindex="-1" role="modal">'
        + '<div class="modal-inner" role="document">'
          + '<div class="modal-content">'
            + '<div class="modal-header">'
              + '<h5 class="modal-title"></h5>'
            + '</div>'
            + '<div class="modal-body">'
              + '<p></p>'
              + '<div class="mx-auto text-center">'
                + '<div class="loader mx-auto d-block">'
                  + '<div class="loader-spinner"></div>'
                + '</div>'
              + '</div>'
            + '</div>'
            + '<div class="modal-footer">'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</div>';

      if (!Array.isArray(opts.buttons)) {
        opts.buttons = opts.cancelable ? DEFAULT_PROPERTIES.buttons : [];
      }

      super(opts, template);

      this.spinner = null;
    }

    show() {
      super.show();

      this.spinner = new Spinner({ element: this.getElement().querySelector('.loader') });
      this.spinner.animate(true);
    }

    hide() {
      super.hide();

      this.spinner.animate(false);
      this.spinner = null;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return new Loader(options);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Loader);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = [];
  const modals = document.querySelectorAll(`.${Modal.identifier()}`);

  if (modals) {
    Array.from(modals).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // loader
        components.push(new Loader(config));
      }
    });
  }

  document.addEventListener('click', (event) => {
    const dataToggleAttr = event.target.getAttribute('data-toggle');
    if (dataToggleAttr && dataToggleAttr === NAME) {
      const id = event.target.getAttribute('data-target');
      const element = document.querySelector(id);

      const component = components.find(c => c.element === element);

      if (!component) {
        return;
      }

      // remove the focus state of the trigger
      event.target.blur();

      component.modal.show();
    }
  });

  return Loader;
})(window.$ ? window.$ : null);

export default Loader;
