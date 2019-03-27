/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Modal from './index';
import { getAttributesConfig } from '../componentManager';
import { createJqueryPlugin } from '../../common/utils';

const Prompt = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'prompt';
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

  class Prompt extends Modal {
    constructor(options = {}) {
      const template = ''
      + '<div class="modal" tabindex="-1" role="modal">'
        + '<div class="modal-inner" role="document">'
          + '<div class="modal-content">'
            + '<div class="modal-header">'
              + '<h5 class="modal-title"></h5>'
            + '</div>'
            + '<div class="modal-body">'
              + '<p></p>'
              + '<input class="form-control" type="text" value="">'
            + '</div>'
            + '<div class="modal-footer">'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</div>';

      if (!Array.isArray(options.buttons)) {
        options.buttons = DEFAULT_PROPERTIES.buttons;
      }

      super(options, template);
    }

    /**
     * Shows the prompt
     * @returns {Boolean}
     */
    show() {
      super.show();
      this.attachInputEvent();
    }

    /**
     * Hides the prompt
     * @returns {Boolean}
     */
    hide() {
      super.hide();
      this.detachInputEvent();
    }

    getInput() {
      return this.options.element.querySelector('.form-control');
    }

    attachInputEvent() {
      this.registerElement({ target: this.getInput(), event: 'keyup' });
    }

    detachInputEvent() {
      this.unregisterElement({ target: this.getInput(), event: 'keyup' });
    }

    onElementEvent(event) {
      if (event.target === this.getInput()) {
        return;
      }

      super.onElementEvent(event);
    }

    setInputValue(value = '') {
      this.getInput().value = value;
    }

    getInputValue() {
      return this.getInput().value;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return new Prompt(options);
    }
  }

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
  const components = [];
  const modals = document.querySelectorAll(`.${Modal.identifier()}`);

  if (modals) {
    Array.from(modals).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // prompt
        components.push(new Prompt(config));
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

  return Prompt;
})(window.$ ? window.$ : null);

export default Prompt;
