---
title: Pager
---

## Introduction

The pager is Phonon's main module for designing a single-page application (SPA). It connects pages together by providing **page navigation** and allows you to listen to **page events**.
It also offers a light and simple **router** for recovering parameters with the `hash` event.

If your website or web application will not be designed in SPA mode, the pager will only be useful for its router.

<div class="iframe-container">
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-sm btn-secondary" data-size="sm">sm</button>
    <button type="button" class="btn btn-sm btn-secondary" data-size="md">md</button>
    <button type="button" class="btn btn-sm btn-secondary" data-size="lg">lg</button>
  </div>
  <iframe class="iframe-example" src="../examples/standalone/index.html"></iframe>
</div>

## Configuration

```js
const pager = phonon.pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'myPage',
  animatePages: true,
});

pager.start();
```

## Options

|      Name      |     Description      |     Default value      |
|----------------|----------------------|-------------------------|
|    hashPrefix      |  The default hash prefix. | #! |
|    useHash      |  Determines if pager listens to hash events and update the current page in the hash. | true |
|    defaultPage      | The default page. | null |
|    animatePages   |  Determines if pager animates page transitions. | true |


## Markup

A SPA page is defined by setting up the `app-page` class and a unique data-page attribute.

```html!
<div class="app-pages">
  <div class="app-page" data-page="myPage"></div>
  <div class="app-page" data-page="mySecondPage"></div>
  <div class="app-page" data-page="myThirdPage"></div>
</div>
```

## Page navigation

Page navigation works with the attribute `data-navigate`.

```html!
<button class="btn btn-primary" data-navigate="myPage">Go to page</button>
```

If you want to force the back animation, you can use the attribute `data-pop-page`.

```html!
<button class="btn btn-primary" data-navigate="home" data-pop-page="true">Back to home</button>
```

## Page selector

To work with pages, it is essential to use the `getPage()` method.

```js
pager.getPage('myPage');
```

Once you selected pages programatically, you can **use a template**, **listen to events** and set a **route**.

## Page route

By default, the router will create a route with the page name.
For example, the default route of myPage would be `/myPage`.

You can define routes with or without named parameters.

```js
// no parametes
pager.getPage('home').setRoute('/home_sweet_home');

// parameter "newsId"
pager.getPage('myPage').setRoute('/myRoute/{newsId}');
```

## Page template

Pager will use the template and set it where the attribute `data-template` is present
in the HTML view.

```js
pager.getPage('myPage').setTemplate('<div>This is my template</div>')
```

The page template will be injected as a node child where the attribute `data-push-template` is.

```html
<div data-push-template>
  <!-- The template will be injected here -->
</div>
```

You may want to use a template engine or change the default behavior of Pager. In this case, the second argument of `setTemplate()` is useful.

```js
pager.getPage('myPage').setTemplate('<div>This is my template</div>'), async (page, template, elements) => {
  const template = await yourTask();
  page.querySelector('[data-template]').innerHTML = template;
});
```

## Prevent page transition

Cancel the page transition if the function returns true.
If the trigger event is a hash change, Pager will force to show the previous page.

```js
pager.getPage('myPage').preventTransition(async function (prev, next, params) {
  return next === 'private';
});
```

You can use async functions. For example, below we delay the page transition:

```js
async function delayTransition() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

pager.getPage('myPage').preventTransition(async function (prev, next, params) {
  return delayTransition();
});
```

## Methods

### showPage(pageName, params, backAnimation)

* `pageName` (String) - the page name.
* `params` (Object) - the hash parameters. If the route is `/myPage/{newsId}`, you can pass `{newsId: 2}` and the result would be `/myPage/2`.
* `backAnimation` (Boolean) - if `backAnimation` is set to true, it will animate the page with a previous page transition. Otherwise, it will animate the page with a next page transition.
* returns: `<Promise<Boolean>>`

Shows the page `pageName`.

```js
pager.showPage('myPage');

// with parameters (hash will be: #!/myPage/2)
pager.showPage('myPage', { newsId: 2 });

// with a back animation for the page transition
pager.showPage('myPage', null, true);
```

### getHash()

* returns: `String`

Returns the current hash.

Example: `#!/news/2`

### getRoute()

* returns: `String`

Returns the current route with parameters.

Example: `/news/2`

### getHashParams()

* returns: `Object`

Returns the current hash parameters. For example, if the route is `/news/{id}`, `getHashParams()` would return:

```js
{ id: 2 }
```

## getPage(pageName)

* `pageName` (String) - the page name.
* returns: `<Object<Page>>`

Returns the page object of `pageName`.

## getPages()

* returns: `Array`

Returns all the pages.

## Events

|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the dialog has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the dialog has finished being hidden from the user (will wait for CSS transitions to complete).    |
|  hash  |   This event is fired when the hash has changed.    |


### Object Events

```js
pager.getPage('myPage').addEvents({
  show: (params) => {
    console.log('It works!');
  },
  shown: (params) => {
    console.log('It works!');
  },
  hide: () => {
    console.log('It works!');
  },
  hidden: () => {
    console.log('It works!');
  },
  hash: (params) => {
    console.log('It works!');
  },
});
```

### DOM Events

For DOM events, you must specify the name of the page followed by a dot and then the event in question.
Note that DOM events are dispatched in both `window` and `document`.

```js
window.addEventListener('myPage.show', (event) => {
  console.log('It works!');
  const params = event.detail;
});

window.addEventListener('myPage.shown', (event) => {
  console.log('It works!');
  const params = event.detail;
});

window.addEventListener('myPage.hide', () => {
  console.log('It works!');
});

window.addEventListener('myPage.hidden', () => {
  console.log('It works!');
});

window.addEventListener('myPage.hash', (event) => {
  console.log('It works!');
  const params = event.detail;
});
```
