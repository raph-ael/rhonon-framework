/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// components
import Alert from './components/alert';
import Modal from './components/modal';
import ModalPrompt from './components/modal/prompt';
import ModalConfirm from './components/modal/confirm';
import ModalLoader from './components/modal/loader';
import Notification from './components/notification';
import Collapse from './components/collapse';
import Accordion from './components/accordion';
import Tab from './components/tab';
import Progress from './components/progress';
import Loader from './components/loader';
import OffCanvas from './components/off-canvas';
import Selectbox from './components/selectbox';
import SelectboxSearch from './components/selectbox/search';
import Dropdown from './components/dropdown';
import Network from './common/network';

const api = {};

/**
 * ------------------------------------------------------------------------
 * Network
 * ------------------------------------------------------------------------
 */
api.network = Network.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Notification
 * ------------------------------------------------------------------------
 */
api.notification = Notification.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Modal
 * ------------------------------------------------------------------------
 */

// generic
api.modal = Modal.DOMInterface;

// prompt modal
api.prompt = ModalPrompt.DOMInterface;
// confirm modal
api.confirm = ModalConfirm.DOMInterface;
// loader modal
api.modalLoader = ModalLoader.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = Collapse.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Alert
 * ------------------------------------------------------------------------
 */
api.alert = Alert.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Accordion
 * ------------------------------------------------------------------------
 */
api.accordion = Accordion.DOMInterface;


/**
 * ------------------------------------------------------------------------
 * Tab
 * ------------------------------------------------------------------------
 */
api.tab = Tab.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Progress
 * ------------------------------------------------------------------------
 */
api.progress = Progress.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Loader
 * ------------------------------------------------------------------------
 */
api.loader = Loader.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Off canvas
 * ------------------------------------------------------------------------
 */
api.offCanvas = OffCanvas.DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Selectbox
 * ------------------------------------------------------------------------
 */
api.selectbox = (options) => {
  if (options.search) {
    // search selectbox
    return SelectboxSearch.DOMInterface(options);
  }

  // generic selectbox
  return Selectbox.DOMInterface(options);
};

/**
 * ------------------------------------------------------------------------
 * Dropdown
 * ------------------------------------------------------------------------
 */
api.dropdown = Dropdown.DOMInterface;


window.phonon = api;

export default api;
