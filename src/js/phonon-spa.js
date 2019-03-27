/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// single-page modules
import Pager from './hybrid-apps/pager';
import I18n from './hybrid-apps/i18n';

const api = {};

/**
 * ------------------------------------------------------------------------
 * Pager
 * ------------------------------------------------------------------------
 */
api.pager = (options) => {
  /* eslint no-underscore-dangle: 0 */
  if (typeof api._pager === 'undefined') {
    api._pager = Pager.DOMInterface(options);
  }
  return api._pager;
};

/**
 * ------------------------------------------------------------------------
 * i18n
 * ------------------------------------------------------------------------
 */
api.i18n = I18n.DOMInterface;

if (window.phonon) {
  window.phonon.pager = api.pager;
  window.phonon.i18n = api.i18n;
} else {
  window.phonon = api;
}

export default api;
