/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Event from '../../common/events';
import { findTargetByClass } from '../../common/utils';
import { getAttributesConfig } from '../componentManager';

const Selectbox = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'selectbox';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    selectable: true,
    search: false,
    filterItems: null,
  };
  const DATA_ATTRS_PROPERTIES = [
    'selectable',
    'search',
  ];
  const components = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Selectbox extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);

      const selected = this.options.element.querySelector('[data-selected]');
      const item = this.getItemData(selected);

      this.setSelected(item.value, item.text, false);
    }

    setSelected(value = '', text = null, checkExists = true) {
      if (!this.options.selectable) {
        return false;
      }

      let textDisplay = text;
      this.options.element.querySelector('.default-text').innerHTML = text;
      this.options.element.querySelector('input[type="hidden"]').value = value;

      const items = this.options.element.querySelectorAll('.item') || [];
      let itemFound = false;

      Array.from(items).forEach((item) => {
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

      return { text, value };
    }

    onElementEvent(event) {
      if (event.type === Event.START) {
        const selectbox = findTargetByClass(event.target, 'selectbox');

        /*
         * hide the current selectbox only if the event concerns another selectbox
         * hide also if the user clicks outside a selectbox
         */
        if (!selectbox || selectbox !== this.getElement()) {
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
            const detail = { item, text: itemInfo.text, value: itemInfo.value };
            this.triggerEvent(Event.ITEM_SELECTED, detail);
          }

          this.hide();
          return;
        }

        // don't toggle the selectbox if the event concerns headers, dividers
        const selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');
        if (selectboxMenu) {
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

    /**
     * Shows the selectbox
     * @returns {Boolean}
     */
    show() {
      if (this.options.element.classList.contains('active')) {
        return false;
      }

      this.options.element.classList.add('active');

      const selectboxMenu = this.options.element.querySelector('.selectbox-menu');

      // scroll to top
      selectboxMenu.scrollTop = 0;

      this.triggerEvent(Event.SHOW);
      this.triggerEvent(Event.SHOWN);

      this.registerElement({ target: selectboxMenu, event: 'click' });
      this.registerElement({ target: document.body, event: Event.START });

      return true;
    }

    /**
     * Hides the selectbox
     * @returns {Boolean}
     */
    hide() {
      if (!this.options.element.classList.contains('active')) {
        return false;
      }

      this.options.element.classList.remove('active');

      this.triggerEvent(Event.HIDE);
      this.triggerEvent(Event.HIDDEN);

      this.unregisterElement({ target: this.options.element.querySelector('.selectbox-menu'), event: 'click' });
      this.unregisterElement({ target: document.body, event: Event.START });

      return true;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Selectbox, options, components);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const selectboxes = Array.from(document.querySelectorAll(`.${NAME}`) || []);
  selectboxes.filter(d => !d.classList.contains('nav-item')).forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    if (!config.search) {
      components.push(new Selectbox(config));
    }
  });

  document.addEventListener('click', (event) => {
    const selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');
    if (selectboxMenu) {
      return;
    }

    const selectbox = findTargetByClass(event.target, 'selectbox');

    if (selectbox) {
      const dataToggleAttr = selectbox.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME && selectbox) {
        const component = components.find(c => c.getElement() === selectbox);

        if (!component) {
          return;
        }

        component.toggle();
      }
    }
  });

  return Selectbox;
})();

export default Selectbox;
