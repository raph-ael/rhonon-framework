/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Page from './page';
import Event from '../../common/events';

const Pager = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'pager';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    hashPrefix: '#!',
    useHash: true,
    defaultPage: null,
    animatePages: true,
  };

  let currentPage;
  let lastHash = null;

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Pager {
    /**
     * @constructor
     *
     * @param options {Object}
     */
    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      this.pages = [];
      this.started = false;

      // add global listeners such ash hash change, navigation, etc.
      this.addPagerEvents();

      // faster way to init pages before the DOM is ready
      this.onDOMLoaded();
    }

    // private
    _(selector) {
      return document.querySelector(selector);
    }

    getRoute() {
      return window.location.hash.split(this.options.hashPrefix)[1];
    }

    getHash() {
      return window.location.hash;
    }

    getHashParams() {
      const page = this.getPageModel(currentPage);
      return page.getParams(this.getHash());
    }

    getPageFromHash() {
      const hash = this.getHash() || '';
      const page = this.getPages().find(p => hash.match(p.getRoute().regex));

      return page ? page.name : null;
    }

    setHash(pageName, params = null) {
      const page = this.getPageModel(pageName);
      if (!page) {
        throw new Error(`Cannot change the route of unknown page ${pageName}`);
      }

      window.location.hash = `${this.options.hashPrefix}${page.getRouteLink(params)}`;
    }

    isPageOf(pageName1, pageName2) {
      const page1 = this.getPageModel(pageName1);
      const page2 = this.getPageModel(pageName2);
      return page1 && page2 && page1.name === page2.name;
    }

    /**
     * Attaches the main events for tracking hash changes,
     * click on navigation buttons and links and back history
     */
    addPagerEvents() {
      document.addEventListener('click', event => this.onClick(event));
      document.addEventListener('DOMContentLoaded', event => this.onDOMLoaded(event));
      if (this.options.useHash) {
        window.addEventListener('hashchange', event => this.onHashChange(event));
      }
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`;
    }

    async preventChangePage(oldPageName, pageName, params) {
      const oldPage = this.getPageModel(oldPageName);
      const preventFn = oldPage.getPreventTransition();

      if (typeof preventFn === 'function') {
        return preventFn(oldPageName, pageName, params);
      }

      return false;
    }

    // public

    async showPage(pageName, params = null, back = false) {
      /*
       * If we he use the hash as trigger,
       * we change it dynamically so that the hashchange event is called
       * Otherwise, we show the page
       */
      if (this.options.useHash && this.getPageFromHash() !== pageName) {
        this.setHash(pageName, params);
        return;
      }

      const oldPage = this._('.current');
      let oldPageName = null;

      if (oldPage) {
        oldPageName = oldPage.getAttribute('data-page');

        if (this.isPageOf(pageName, oldPageName)) {
          return;
        }

        if (await this.preventChangePage(oldPageName, pageName, params)) {
          if (this.options.useHash) {
            window.location.hash = lastHash;
          }

          return;
        }

        oldPage.classList.remove('current');

        // history
        window.history.replaceState({ page: pageName }, oldPageName);

        this.triggerPageEvent(oldPageName, Event.HIDE);
      }

      currentPage = pageName;

      // new page
      const newPage = this._(`[data-page="${currentPage}"]`);

      newPage.classList.add('current');

      // render template
      const pageModel = this.getPageModel(currentPage);

      const hashParams = pageModel.getParams(this.getHash());

      this.triggerPageEvent(currentPage, Event.SHOW, hashParams);


      if (pageModel && pageModel.getTemplate()) {
        await pageModel.renderTemplate();
      }

      if (oldPage) {
        // use of prototype-oriented language
        oldPage.back = back;
        oldPage.previousPageName = oldPageName;

        const onPageAnimationEnd = () => {
          if (oldPage.classList.contains('animate')) {
            oldPage.classList.remove('animate');
          }

          oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');

          this.triggerPageEvent(currentPage, Event.SHOWN, hashParams);
          this.triggerPageEvent(oldPage.previousPageName, Event.HIDDEN);

          oldPage.removeEventListener(Event.ANIMATION_END, onPageAnimationEnd);
        };

        if (this.options.animatePages) {
          oldPage.addEventListener(Event.ANIMATION_END, onPageAnimationEnd);
          oldPage.classList.add('animate');
        } else {
          onPageAnimationEnd();
        }

        oldPage.classList.add(back ? 'pop-page' : 'push-page');
      }

      lastHash = this.getHash();
    }

    addUniquePageModel(pageName) {
      if (!this.getPageModel(pageName)) {
        this.getPages().push(new Page(pageName));
      }
    }

    getPageModel(pageName) {
      return this.getPages().find(page => page.name === pageName);
    }

    triggerPageEvent(pageName, eventName, eventParams = null) {
      const pageModel = this.getPageModel(pageName);
      if (pageModel) {
        pageModel.triggerScopes(eventName, eventParams);
      }
    }

    onClick(event) {
      const pageName = event.target.getAttribute('data-navigate');
      const backAnimation = event.target.getAttribute('data-pop-page') === 'true';

      if (!pageName) {
        return;
      }

      this.showPage(pageName, null, backAnimation);
    }

    onHashChange() {
      const params = this.getHashParams();
      const navPage = this.getPageFromHash();

      // avoid concurrent pages if prevent page change is defined
      if (navPage === currentPage) {
        this.triggerPageEvent(currentPage, Event.HASH, params);
      }


      if (navPage) {
        this.showPage(navPage, null, false, params);
      }
    }

    /**
     * Queries the page nodes in the DOM
     */
    onDOMLoaded() {
      const pages = document.querySelectorAll('[data-page]');

      if (!pages) {
        return;
      }

      pages.forEach((page) => {
        /*
         * the page name can be given with the attribute data-page
         * or with its node name
         */
        const pageName = page.getAttribute('data-page') || page.nodeName;

        this.addUniquePageModel(pageName);
      });
    }

    getPage(pageName, addPageModel = true) {
      if (addPageModel) {
        this.addUniquePageModel(pageName);
      }

      return this.getPageModel(pageName);
    }

    getPages() {
      return this.pages;
    }

    start(forceDefaultPage = false) {
      let force = forceDefaultPage;

      // check if the app has been already started
      if (this.started) {
        throw new Error(`${NAME}. The app has been already started.`);
      }

      this.started = true;

      // force default page on Cordova
      if (window.cordova) {
        force = true;
      }

      let pageName = this.getPageFromHash();

      if (!this.getPageModel(pageName)) {
        pageName = this.options.defaultPage;
      }

      const page = this.getPageModel(pageName);

      if (force && !this.options.defaultPage) {
        throw new Error(`${NAME}. The default page must exist for forcing its launch!`);
      }

      /*
       * if the app is configurated to use hash tracking
       * we add the page dynamically in the url
       */
      if (this.options.useHash) {
        if (!page.validHash(this.getRoute())) {
          this.setHash(pageName);
        }
      }

      this.showPage(force ? this.options.defaultPage : pageName);
    }

    // static
    static DOMInterface(options) {
      return new Pager(options);
    }
  }

  return Pager;
})();

export default Pager;
