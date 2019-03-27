---
title: Off-Canvas
---

## Introduction

An off-canvas is a sidebar visible from the left or the right.

## Live example

Click on the different screen sizes to see the offcanvas in action.

By default, for `sm` and `md` screen sizes, the offcanvas will float on top of the page.

On larger screens such as `lg` and `xl`, the offcanvas will push the content to be placed side by side.

<div class="iframe-container">
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-sm btn-secondary" data-size="sm">sm</button>
    <button type="button" class="btn btn-sm btn-secondary" data-size="md">md</button>
    <button type="button" class="btn btn-sm btn-secondary" data-size="lg">lg</button>
  </div>
  <iframe class="iframe-example" src="./examples/offcanvas/index.html"></iframe>
</div>

## Markup

Use `.offcanvas-left` or `.offcanvas-right` to determine the direction of the offcanvas.

```html!
<!-- Button trigger offcanvas -->
<button class="btn btn-primary" data-toggle="offcanvas" data-target="#exampleOffCanvas">Launch demo offcanvas</button>

<!-- offcanvas, left direction -->
<div class="offcanvas offcanvas-left" id="exampleOffCanvas" role="navigation" aria-hidden="true" aria-labelledby="exampleOffCanvasTitle">
  <div class="offcanvas-inner">
    <div class="offcanvas-content">
      <div class="offcanvas-header">
        <h1 class="offcanvas-title">Title</h1>
        <button type="button" class="close" data-dismiss="offcanvas" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="offcanvas-body">
        <p>Content</p>
      </div>
      <div class="offcanvas-footer">
        <p>Footer</p>
      </div>
    </div>
  </div>
</div>
```

## Floating and static off-canvas

By default, the off-canvas menu is displayed at the top of the page (floating) if the screen size is `md` or `sm`.
If the screen size is `lg` or `xl`, the menu will push the container to display next to it.


## JavaScript

```js
// ES6
import OffCanvas from 'phonon/dist/js/components/off-canvas';

const offcanvas = new OffCanvas({
  element: '#exampleOffCanvas',
  container: document.body,
  toggle: false,
  aside: {
    md: false,
    lg: true,
    xl: true,
  },
});

// ES5
const offcanvas = phonon.offCanvas({
  element: '#exampleOffCanvas',
  container: document.body,
  toggle: false,
  aside: {
    md: false,
    lg: true,
    xl: true,
  },
});

// jQuery
const offcanvas = $('#exampleOffCanvas').offCanvas({
  container: document.body,
  toggle: false,
  aside: {
    md: false,
    lg: true,
    xl: true,
  },
});
```

### Options

|     Name     |     Description      |     Default value      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|-------------------------------------|
|    aside.md      |  Displays the off-canvas menu next to the container when the screen size is `md` size. | false | yes `data-aside-md` |
|    aside.lg      |  Displays the off-canvas menu next to the container when the screen size is `lg` size. | true | yes `data-aside-lg` |
|    aside.xl      |  Displays the off-canvas menu next to the container when the screen size is `xl` size. | true | yes `data-aside-xl` |
|    toggle      |  Toggles the off-canvas menu when it is initialized. | false | yes `data-toggle` |
|    container      |  The container that will be moved to the right or left if the off-canvas menu is displayed in aside mode. | body | no |
|    closableKeyCodes   |  Array of keys that allow to hide the off-canvas. Default key is escape. | [27] | no |

### Methods

#### show()

* returns: `<boolean>`

Any off canvas can be shown with JavaScript. For this, we call the `show()` method:

```js
offcanvas.show();
```


#### hide()

* returns: `<boolean>`

Any off canvas can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
offcanvas.hide();
```


### Events

It may be useful to use the events that affect your off-canvas.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the off-canvas is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the off-canvas is completely hidden (will wait for CSS transitions to complete).    |



#### Object Events

```js
phonon.offCanvas({
  element: '#exampleOffCanvas',
  show: () => { // or onShow
    console.log('It works!');
  },
  shown: () => { // or onShown
    console.log('It works!');
  },
  hide: () => { // or onHide
    console.log('It works!');
  },
  hidden: () => { // or onHidden
    console.log('It works!');
  },
});
```

#### DOM Events

```js
document.querySelector('.offcanvas').addEventListener('show.ph.offcanvas', () => {
  console.log('It works!');
});

document.querySelector('.offcanvas').addEventListener('shown.ph.offcanvas', () => {
  console.log('It works!');
});

document.querySelector('.offcanvas').addEventListener('hide.ph.offcanvas', () => {
  console.log('It works!');
});

document.querySelector('.offcanvas').addEventListener('hidden.ph.offcanvas', () => {
  console.log('It works!');
});
```
