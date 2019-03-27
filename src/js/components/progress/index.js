/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Event from '../../common/events';
import { createJqueryPlugin } from '../../common/utils';

const Progress = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'progress';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    height: 5,
    min: 0,
    max: 100,
    label: false,
    striped: false,
    background: null,
  };
  const DATA_ATTRS_PROPERTIES = [
    'height',
    'min',
    'max',
    'label',
    'striped',
    'background',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Progress extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);

      // set the wanted height
      this.options.element.style.height = `${this.options.height}px`;

      // set min and max values
      const progressBar = this.getProgressBar();
      progressBar.setAttribute('aria-valuemin', `${this.options.min}`);
      progressBar.setAttribute('aria-valuemax', `${this.options.max}`);

      // set striped
      if (this.options.striped
        && !progressBar.classList.contains('progress-bar-striped')) {
        progressBar.classList.add('progress-bar-striped');
      }

      // set background
      if (typeof this.options.background === 'string'
        && !progressBar.classList.contains(`bg-${this.options.background}`)) {
        progressBar.classList.add(`bg-${this.options.background}`);
      }
    }

    getProgressBar() {
      return this.options.element.querySelector('.progress-bar');
    }

    set(value = 0) {
      const progressBar = this.getProgressBar();
      const progress = Math.round((value / (this.options.min + this.options.max)) * 100);

      if (value < this.options.min) {
        console.error(`${NAME}. Warning, ${value} is under min value.`);
        return false;
      }

      if (value > this.options.max) {
        console.error(`${NAME}. Warning, ${value} is above max value.`);
        return false;
      }

      progressBar.setAttribute('aria-valuenow', `${value}`);

      // set label
      if (this.options.label) {
        progressBar.innerHTML = `${progress}%`;
      }

      // set percentage
      progressBar.style.width = `${progress}%`;

      return true;
    }

    animate(startAnimation = true) {
      if (!this.options.striped) {
        console.error(`${NAME}. Animation works only with striped progress.`);
        return false;
      }

      const progressBar = this.getProgressBar();

      if (startAnimation
        && !progressBar.classList.contains('progress-bar-animated')) {
        progressBar.classList.add('progress-bar-animated');
      }

      if (!startAnimation
        && progressBar.classList.contains('progress-bar-animated')) {
        progressBar.classList.remove('progress-bar-animated');
      }

      return true;
    }

    /**
     * Shows the progress bar
     * @returns {Boolean}
     */
    show() {
      this.options.element.style.height = `${this.options.height}px`;
      this.triggerEvent(Event.SHOW);
      this.triggerEvent(Event.SHOWN);

      return true;
    }

    /**
     * Hides the progress bar
     * @returns {Boolean}
     */
    hide() {
      this.options.element.style.height = '0px';
      this.triggerEvent(Event.HIDE);
      this.triggerEvent(Event.HIDDEN);

      return true;
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Progress, options);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Progress);

  return Progress;
})(window.$ ? window.$ : null);

export default Progress;
