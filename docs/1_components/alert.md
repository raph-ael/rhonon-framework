---
title: Alert
---

## Introduction

An alert displays a box with a specified message.

## Markup

```html
<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>
<div class="alert alert-secondary" role="alert">
  A simple secondary alert—check it out!
</div>
<div class="alert alert-success" role="alert">
  A simple success alert—check it out!
</div>
<div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
</div>
<div class="alert alert-warning" role="alert">
  A simple warning alert—check it out!
</div>
<div class="alert alert-info" role="alert">
  A simple info alert—check it out!
</div>
<div class="alert alert-light" role="alert">
  A simple light alert—check it out!
</div>
<div class="alert alert-dark" role="alert">
  A simple dark alert—check it out!
</div>
```

### Link color

```html
<div class="alert alert-primary" role="alert">
  A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-secondary" role="alert">
  A simple secondary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-success" role="alert">
  A simple success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-danger" role="alert">
  A simple danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-warning" role="alert">
  A simple warning alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-info" role="alert">
  A simple info alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-light" role="alert">
  A simple light alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
<div class="alert alert-dark" role="alert">
  A simple dark alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
```

### Dismissable


```html
<div class="alert alert-warning" id="exampleAlert" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
```

## JavaScript

```js
// ES6
import Alert from 'phonon/dist/js/components/alert';

const alert = new Alert({
  element: '#exampleAlert',
  fade: true,
});

// ES5
const alert = phonon.alert({
  element: '#exampleAlert',
  fade: true,
});

// jQuery
const alert = $('#exampleAlert').alert({
  fade: true,
});
```

### Options

|     Name     |     Description      |     Default value      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|-------------------------------------|
|    fade      |  if `fade` is set to true, it will add a fade animation. Otherwise, it will toggle the display property when showing or hidding this element. | true | yes `data-fade` |


### Methods

#### show()

* returns: `<boolean>`

```js
alert.show();
```

#### hide()

* returns: `<boolean>`

```js
alert.hide();
```

## Events

It may be useful to use the events that affect your alert.
For this, you can use object and DOM events.

|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the alert is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the alert is completely hidden (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.alert({
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

### DOM Events

```js
document.querySelector('.alert').addEventListener('show.ph.alert', () => {
  console.log('It works!');
});

document.querySelector('.alert').addEventListener('shown.ph.alert', () => {
  console.log('It works!');
});

document.querySelector('.alert').addEventListener('hide.ph.alert', () => {
  console.log('It works!');
});

document.querySelector('.alert').addEventListener('hidden.ph.alert', () => {
  console.log('It works!');
});
```

<div class="alert alert-secondary" role="alert">

This documentation "Alert" is a derivative of "[Alerts](http://getbootstrap.com/docs/4.1/components/alerts/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Alert" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
