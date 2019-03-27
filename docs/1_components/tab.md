---
title: Tab
---

## Introduction

A tab is made up of 2 elements. One is a clickable button and the other is the content.
It is used to show a fragment of content.

## Markup

```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="news-tab" data-toggle="tab" href="#news" role="tab" aria-controls="news" aria-selected="true">News</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="settings-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="settings" aria-selected="false">Settings</a>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="news" role="tabpanel" aria-labelledby="news-tab">News</div>
  <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">Settings</div>
</div>
```

<!-- fix for links -->
<script>document.querySelector('.page .nav-tabs').addEventListener('click', function (event) { event.preventDefault()});</script>


## JavaScript

```js
// ES6
import Tab from 'phonon/dist/js/components/tab';

const tab = new Tab({
  element: '#settings-tab',
});

// ES5
const tab = phonon.tab({
  element: '#settings-tab',
});

// jQuery
const tab = $('#settings-tab').tab();
```

### Methods

#### show()

* returns: `<boolean>`

Any tab can be shown with JavaScript. For this, we call the `show()` method:

```js
tab.show();
```

#### hide()

* returns: `<boolean>`

Any tab can be hidden with JavaScript. For this, we call the `hide()` method:

```js
tab.hide();
```


## Events

It may be useful to use the events that affect your tab.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the tab is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the tab is completely hidden (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.tab({
  element: '#tab',
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
document.querySelector('.tab').addEventListener('show.ph.tab', () => {
  console.log('It works!');
});

document.querySelector('.tab').addEventListener('shown.ph.tab', () => {
  console.log('It works!');
});

document.querySelector('.tab').addEventListener('hide.ph.tab', () => {
  console.log('It works!');
});

document.querySelector('.tab').addEventListener('hidden.ph.tab', () => {
  console.log('It works!');
});
```
