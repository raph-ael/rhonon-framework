/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import { getAttributesConfig } from '../componentManager';
import Event from '../../common/events';
import {
  findTargetByClass, createJqueryPlugin,
} from '../../common/utils';

const Dropdown = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'dropdown';
  const MENU = 'dropdown-menu';
  const MENU_ITEM = 'dropdown-item';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    hover: true,
  };
  const DATA_ATTRS_PROPERTIES = [
    'hover',
  ];
  const components = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      this.onTransition = false;


      if (this.options.hover) {
        this.registerElement({ target: this.options.element, event: 'mouseover' });
        this.registerElement({ target: this.options.element, event: 'mouseleave' });

        this.options.element.addEventListener('mouseover', () => {
          this.show();
        });

        this.options.element.addEventListener('mouseleave', () => {
          this.hide();
        });
      }
    }

    onElementEvent(event) {
      if (event.type === 'mouseover') {
        this.show();
        return;
      }

      if (event.type === 'mouseleave') {
        this.hide();
      }
    }

    /**
     * Shows the dropdown
     * @returns {Boolean}
     */
    show() {
      if (this.onTransition) {
        return false;
      }

      if (this.options.element.classList.contains('show')) {
        return false;
      }

      this.onTransition = true;

      this.triggerEvent(Event.SHOW);

      const onShow = () => {
        // dropdown menu
        this.triggerEvent(Event.SHOWN);

        this.getMenu().removeEventListener(Event.TRANSITION_END, onShow);
        this.onTransition = false;
      };

      // dropdown handler
      this.options.element.classList.add('show');

      const dropdownMenu = this.getMenu();

      dropdownMenu.classList.add('show');

      if (dropdownMenu.clientWidth > this.options.element.clientWidth
        && !dropdownMenu.classList.contains('force-left')) {
        // move the caret to the left
        dropdownMenu.classList.add('force-left');
      } else if (dropdownMenu.clientWidth < this.options.element.clientWidth
        && dropdownMenu.classList.contains('force-left')) {
        // set default position for the caret
        dropdownMenu.classList.remove('force-left');
      }

      dropdownMenu.addEventListener(Event.TRANSITION_END, onShow);

      setTimeout(() => {
        dropdownMenu.classList.add('animate');
      }, 20);

      return true;
    }

    getMenu() {
      return this.options.element.querySelector(`.${MENU}`);
    }

    toggle() {
      if (this.options.element.classList.contains('show')) {
        this.hide();
      } else {
        this.show();
      }
    }

    /**
     * Hides the collapse
     * @returns {Boolean}
     */
    hide() {
      if (this.onTransition) {
        return false;
      }

      if (!this.options.element.classList.contains('show')) {
        return false;
      }

      this.onTransition = true;
      this.triggerEvent(Event.HIDE);

      const onHide = () => {
        // dropdown menu
        this.getMenu().classList.remove('show');

        this.triggerEvent(Event.HIDDEN);
        this.getMenu().removeEventListener(Event.TRANSITION_END, onHide);
        this.onTransition = false;
      };

      // dropdown handler
      this.options.element.classList.remove('show');

      this.getMenu().addEventListener(Event.TRANSITION_END, onHide);

      this.getMenu().classList.remove('animate');

      return true;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Dropdown, options, components);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Dropdown);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const dropdowns = Array.from(document.querySelectorAll(`.${NAME}`) || []);

  dropdowns.forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    components.push(Dropdown.DOMInterface(config));
  });

  document.addEventListener('click', (event) => {
    const dropdown = findTargetByClass(event.target, NAME);
    const dropdownMenuItem = findTargetByClass(event.target, MENU_ITEM);

    if (dropdown) {
      const component = components.find(c => c.getElement() === dropdown);

      if (!component) {
        return;
      }

      if (dropdownMenuItem) {
        // click in menu
        component.hide();
        return;
      }

      component.show();
    }
  });

  document.addEventListener(Event.START, (event) => {
    const dropdown = findTargetByClass(event.target, NAME);
    const activeDropdown = document.querySelector('.dropdown.show');

    if (dropdown || !activeDropdown) {
      return;
    }

    const activeComponent = components.find(c => c.getElement() === activeDropdown);

    activeComponent.hide();
  });

  return Dropdown;
})(window.$ ? window.$ : null);

export default Dropdown;
