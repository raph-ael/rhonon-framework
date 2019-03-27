/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Selectbox from './index';
import { findTargetByClass, createJqueryPlugin } from '../../common/utils';
import { getAttributesConfig } from '../componentManager';

const SelectboxSearch = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = Selectbox.identifier();
  const DEFAULT_PROPERTIES = {
    element: null,
    selectable: true,
    search: true,
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

  class SelectboxSearch extends Selectbox {
    constructor(options = {}) {
      super(options);

      this.filterItemsHandler = (event) => {
        const search = event.target.value;

        if (search === '') {
          this.showItems();
          return;
        }


        this.getItems().forEach((item) => {
          const itemEl = item;
          const fn = typeof this.options.filterItems === 'function' ? this.options.filterItems : this.filterItems;

          if (fn(search, itemEl)) {
            itemEl.element.style.display = 'block';
          } else {
            itemEl.element.style.display = 'none';
          }
        });
      };

      this.getSearchInput().addEventListener('keyup', this.filterItemsHandler);
    }

    filterItems(search = '', item = {}) {
      return item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1;
    }

    getItems() {
      let items = Array.from(this.options.element.querySelectorAll('.item') || []);
      items = items.map((item) => {
        const info = this.getItemData(item);
        return { text: info.text, value: info.value, element: item };
      });

      return items;
    }

    showItems() {
      this.getItems().forEach((item) => {
        const i = item;
        i.element.style.display = 'block';
      });
    }

    getSearchInput() {
      return this.options.element.querySelector('.selectbox-menu input');
    }

    /**
     * Hides the search selectbox
     * @returns {Promise} Promise object represents the completed animation
     */
    async hide() {
      await super.hide();

      // reset the value
      this.getSearchInput().value = '';

      // show all items
      this.showItems();

      return true;
    }

    static DOMInterface(options) {
      return new SelectboxSearch(options, components);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, SelectboxSearch);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const selectboxes = Array.from(document.querySelectorAll(`.${NAME}`) || []);

  selectboxes.filter(d => !d.classList.contains('nav-item')).forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    if (config.search) {
      // search
      components.push(new SelectboxSearch(config));
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

  return SelectboxSearch;
})(window.$ ? window.$ : null);

export default SelectboxSearch;
