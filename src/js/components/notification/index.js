/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/
import Event from '../../common/events';
import Component from '../component';
import { createJqueryPlugin, sleep } from '../../common/utils';

const Notification = (($) => {
  /**
   * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  const NAME = 'notification';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    message: '',
    button: true,
    timeout: null,
    background: 'primary',
    directionX: 'right',
    directionY: 'top',
    offsetX: 0,
    offsetY: 0,
    appendIn: document.body,
  };
  const DATA_ATTRS_PROPERTIES = [
    'message',
    'button',
    'timeout',
    'background',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Notification extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false);

      this.template = ''
      + '<div class="notification">'
        + '<div class="notification-inner">'
          + '<div class="message"></div>'
          + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">'
            + '<span aria-hidden="true">&times;</span>'
          + '</button>'
        + '</div>'
      + '</div>';

      if (this.dynamicElement) {
        this.build();
      }

      this.timeoutCallback = null;
    }

    build() {
      const builder = document.createElement('div');

      builder.innerHTML = this.template;

      this.options.element = builder.firstChild;

      // text message
      this.options.element.querySelector('.message').innerHTML = this.options.message;

      if (!this.options.button) {
        this.options.element.querySelector('button').style.display = 'none';
      }

      this.getConfig('appendIn', DEFAULT_PROPERTIES.appendIn).appendChild(this.options.element);
      this.setAttributes();
    }

    setPosition() {
      const x = this.getConfig('directionX', DEFAULT_PROPERTIES.directionX);
      const y = this.getConfig('directionY', DEFAULT_PROPERTIES.directionY);
      const offsetX = this.getConfig('offsetX', DEFAULT_PROPERTIES.offsetX);
      const offsetY = this.getConfig('offsetY', DEFAULT_PROPERTIES.offsetY);

      const notification = this.options.element;
      const directions = ['top', 'right', 'bottom', 'left'];

      directions.forEach((d) => {
        if (notification.classList.contains(d)) {
          notification.classList.remove(d);
        }
      });

      notification.style.marginLeft = '0px';
      notification.style.marginRight = '0px';

      notification.classList.add(`notification-${x}`);
      notification.classList.add(`notification-${y}`);

      const activeNotifications = document.querySelectorAll('.notification.show') || [];
      let totalNotifY = 0;
      activeNotifications.forEach((n) => {
        if (notification !== n) {
          const style = getComputedStyle(n);
          totalNotifY += n.offsetHeight
            + parseInt(style.marginTop, 10)
            + parseInt(style.marginBottom, 10);
        }
      });

      notification.style.transform = `translateY(${y === 'top' ? '' : '-'}${totalNotifY}px)`;

      notification.style[`margin${x.replace(/^\w/, c => c.toUpperCase())}`] = `${offsetX}px`;
      notification.style[`margin${y.replace(/^\w/, c => c.toUpperCase())}`] = `${offsetY}px`;
    }

    /**
     * Shows the notification
     * @returns {Boolean}
     */
    show() {
      if (this.options.element === null) {
        // build and insert a new DOM element
        this.build();
      }

      if (this.options.element.classList.contains('show')) {
        return false;
      }

      // reset color
      if (this.options.background) {
        this.options.element.removeAttribute('class');
        this.options.element.setAttribute('class', 'notification');

        this.options.element.classList.add(`notification-${this.options.background}`);
        this.options.element.querySelector('button').classList.add(`btn-${this.options.background}`);
      }

      this.setPosition();

      const buttonElement = this.options.element.querySelector('button[data-dismiss]');

      if (this.options.button && buttonElement) {
        // attach the button handler
        this.registerElement({ target: buttonElement, event: 'click' });
      }

      (async () => {
        await sleep(20);

        if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
          // if there is a timeout, auto hide the notification
          this.timeoutCallback = setTimeout(() => {
            this.hide();
          }, this.options.timeout + 1);
        }

        this.options.element.classList.add('show');

        this.triggerEvent(Event.SHOW);

        const onShown = () => {
          this.triggerEvent(Event.SHOWN);
          this.options.element.removeEventListener(Event.TRANSITION_END, onShown);
        };

        this.options.element.addEventListener(Event.TRANSITION_END, onShown);
      })();

      return true;
    }

    /**
     * Hides the notification
     * @returns {Boolean}
     */
    hide() {
      /*
      * prevent to close a notification with a timeout
      * if the user has already clicked on the button
      */
      if (this.timeoutCallback) {
        clearTimeout(this.timeoutCallback);
        this.timeoutCallback = null;
      }

      if (!this.options.element.classList.contains('show')) {
        return false;
      }

      this.triggerEvent(Event.HIDE);

      const buttonElement = this.options.element.querySelector('button[data-dismiss]');

      if (this.options.button && buttonElement) {
        this.unregisterElement({ target: buttonElement, event: 'click' });
      }

      this.options.element.classList.remove('show');
      this.options.element.classList.add('hide');

      const onHidden = () => {
        this.options.element.removeEventListener(Event.TRANSITION_END, onHidden);
        this.options.element.classList.remove('hide');

        this.triggerEvent(Event.HIDDEN);

        if (this.dynamicElement) {
          document.body.removeChild(this.options.element);
          this.options.element = null;
        }
      };

      this.options.element.addEventListener(Event.TRANSITION_END, onHidden);

      return true;
    }

    onElementEvent() {
      this.hide();
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Notification, options);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Notification);


  return Notification;
})(window.$ ? window.$ : null);

export default Notification;
