---
title: Progress
---

## Introduction

A progress indicates the completion status of a task or of a process with a horizontal bar.

## Markup

```html
<div class="progress" id="myProgress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

You can specify the height and the value of the progress in HTML if you don't want to use JavaScript:

```html
<div class="progress" id="myProgress" style="height: 8px">
  <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

## JavaScript

```js
// ES6
import Progress from 'phonon/dist/js/components/progress';

const progress = new Progress({
  element: '#myProgress',
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
});

// ES5
const progress = phonon.progress({
  element: '#myProgress',
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
});

// jQuery
$('#myProgress').progress({
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
});
```

### Options

|     Name     |     Description      |     Default value      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|-------------------------------------|
|    height      |  Height of the progress bar. | 5 | yes `data-height`
|    min      |  Minimum value of the progress bar. | 0 | yes `data-min`
|    max      |  Maximum value of the progress bar. | 100 | yes `data-max`
|    label      |  Display of the current value of the progress bar. | false | yes `data-label`
|    striped      |  Progress bar with the striped style. | false | yes `data-striped`
|    background      |  Background of the progress bar. | null | yes `data-background`


### Methods

#### set(value)

* `value` (Number) - the value of the progress bar.
* returns: `<undefined>`

Updates the current value of the progress bar.

#### animate(startAnimation)

* `startAnimation` (Boolean) - if `startAnimation` is set to true, it will start the stripe animation. Otherwise, it will stop the animation.
* returns: `<undefined>`

Animates the striped progress. The `striped` option must be set to true otherwise it won't work.

#### show()

* returns: `<boolean>`

Any progress can be shown with JavaScript. For this, we call the `show()` method:

```js
progress.show();
```

#### hide()

* returns: `<boolean>`

Any progress can be hidden with JavaScript. For this, we call the `hide()` method:

```js
progress.hide();
```

## Events

It may be useful to use the events that affect your progress.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the progress is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the progress is completely hidden (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.progress({
  element: '#exampleProgress',
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
document.querySelector('.progress').addEventListener('show.ph.progress', () => {
  console.log('It works!');
});

document.querySelector('.progress').addEventListener('shown.ph.progress', () => {
  console.log('It works!');
});

document.querySelector('.progress').addEventListener('hide.ph.progress', () => {
  console.log('It works!');
});

document.querySelector('.progress').addEventListener('hidden.ph.progress', () => {
  console.log('It works!');
});
```

<div class="alert alert-secondary" role="alert">

This documentation "Progress" is a derivative of "[Progress](http://getbootstrap.com/docs/4.1/components/progress/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Progress" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
