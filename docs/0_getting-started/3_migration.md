---
title: Migration
---

# Upgrade guide

Upgrading to 2.0 from 1.x.

**Estimated time**: 4 hours.

**Prepare a coffee** and start it right now!

## Table of contents

* Core features
* phonon.options()
* Page events
* Page templates
* Navigation between pages
* Ajax
* Internationalisation (i18n)
* Components
* Utility

## Core features

### phonon.options() <i>Removed</i>

Options are now passed in:

```js
const pager = phonon.pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'one',
  animatePages: false,
});
```

### Markup page structure

`.app-pages` is a wrapper of `.app-page` pages.

```html!
<div class="app-pages">
  <div class="app-page" data-page="one">...</div>
  <div class="app-page" data-page="myPage2">...</div>
</div>
```

### Page events <i>Changed</i>

For a given page `myPage` for example.
Assuming this page is present in the DOM like the following:

```html!
<div class="app-page" data-page="myPage"></div>
```

Page events are now used with `.getPage()`.

```js
pager.getPage('myPage').addEvents({
  show: function () {
    console.log('myPage: show');;
  },
  shown: function () {
    console.log('myPage: shown');
  },
  hide: function () {
    console.log('myPage: hide');
  },
  hidden: function () {
    console.log('myPage: hidden');
  },
  hash: function () {
    console.log('myPage: hash');
  },
});
```

In some situations, it may be useful to listen to certain events that affect **all pages**.
For this, we use the `*` selector.

```js
pager.getPage('*').addEvents({
  show: function () {
    console.log('global: show');
  },
  shown: function () {
    console.log('global: shown');
  },
  hide: function () {
    console.log('global: hide');
  },
  hidden: function () {
    console.log('global: hidden');
  },
  hash: function () {
    console.log('global: hash');
  },
});
```

Page events are also dispatched in the DOM.

```js
window.addEventListener('myPage.show', () => {
  console.log('myPage: show (DOM event)');
});
```

Finally, page events have their own aliases.
Instead of using the event name called `show` for example, you can use `onShow`:

```js
pager.getPage('myPage').addEvents({
  show: () => {
    console.log('myPage: show');
  },
  onShow: () => {
    console.log('myPage: show (alias)');
  },
});
```

### Page templates <i>Changed</i>

You need to use `setTemplate()`.
The first argument is the path to the template file.

```js
pager.getPage('myPage').setTemplate('<div>This is my template</div>');
```

The page template will be injected as a node child where the attribute `data-push-template` is.

```html!
<div data-push-template>
  <!-- The template will be injected here -->
</div>
```

It is now possible to use custom template renderers.
This feature is interesting if you want to use a template engine such as [Mustache](https://mustache.github.io).
Note that async functions are now supported.

```js
pager.getPage('myPage').setTemplate('<div>This is my template</div>'), async (page, template, elements) => {
  const template = await fetchTemplate();
  page.querySelector('[data-template]').innerHTML = template;
});
```

### Navigation between pages

Replace `data-navigation` by `data-navigate`.
Note: `data-navigate="$back"` still works.
Use `data-pop-page` for back animation if you want to force it.

### Ajax <i>removed</i>

Please, use a HTTP client such as [axios](https://github.com/axios/axios).

### Internationalisation (i18n) <i>Changed</i>

For the internationalisation, there are many changes.
Now, you need to pass all the data directly.

```js
phonon.i18n({
  fallbackLocale: 'en',
  locale: 'en',
  data: {
    en: {
      welcome: 'Hello (default)',
      welcomePerson: 'Hello :name',
    },
    en_US: {
      welcome: 'Hello (US)',
      welcomePerson: 'Hello :name',
    },
    fr: {
      welcome: 'Bonjour',
      welcomePerson: 'Bonjour :name',
    },
  },
});
```

It is no longer possible to load JSON by doing Ajax requests.
If you need to keep this feature, you can load JSON language files and then
pass everything as the second argument.

```js
axios.get('/locales')
  .then((response) => {
    const config = {
      fallbackLocale: 'en',
      locale: 'en',
      data: response.data,
    };

    phonon.i18n(config);
  });
});
```

## Components

### Utility

#### Padding and margin

Please, see [spacing utilities](#2_utilities/spacing).

Replace **.padded-full** by **.p-1**.

Replace **.padded-top** by **.pt-1**.

Replace **.padded-left** by **.pl-1**.

Replace **.padded-right** by **.pr-1**.

Replace **.padded-bottom** by **.pb-1**.

#### Text alignment

More information can be found here: [text utilities](#3_utilities/text)

Replace **.padded-full** by **.p-1**.

Replace **.padded-top** by **.pt-1**.

Replace **.padded-left** by **.pl-1**.

Replace **.padded-right** by **.pr-1**.

Replace **.padded-bottom** by **.pb-1**.

#### Float

Replace **.pull-left** by **.float-left**.

Replace **.pull-right** by **.float-right**.

#### Fit parent width

Replace **.fit-parent** by **.w-100**.

#### Unselectable

To make an element unselectable use the class **.unselectable**.
