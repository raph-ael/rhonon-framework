/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Modal from './index';
import { getAttributesConfig } from '../componentManager';
import { createJqueryPlugin } from '../../common/utils';

const Confirm = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'confirm';
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [
      {
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary',
      },
      {
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary',
      },
    ],
  };
  const DATA_ATTRS_PROPERTIES = [
    'cancelable',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Confirm extends Modal {
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
            + '</div>'
            + '<div class="modal-footer">'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</div>';

      if (!Array.isArray(opts.buttons)) {
        opts.buttons = DEFAULT_PROPERTIES.buttons;
      }

      super(opts, template);
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return new Confirm(options);
    }
  }

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
  const components = [];
  const modals = document.querySelectorAll(`.${Modal.identifier()}`);

  if (modals) {
    Array.from(modals).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // confirm
        components.push(new Confirm(config));
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

  return Confirm;
})(window.$ ? window.$ : null);

export default Confirm;
