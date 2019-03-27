---
title: Selectbox
---

## Introduction

A selectbox is an element to choose a value in a list of selection items.

## Markup

```html
<div class="selectbox" role="button" tabindex="0" data-toggle="selectbox">
  <input type="hidden" name="color">
  <i class="selectbox-icon"></i>
  <div class="default-text">Blue</div>
  <div class="selectbox-menu">
    <div class="item" data-value="blue" data-selected="true">Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item selected" data-value="green">
      <span class="description">Best one!</span>
      <span class="text">Green</span>
    </div>
  </div>
</div>
```

### Selectbox with invalid item

Add the class `disabled` to the item.

```html
<div class="selectbox" role="button" tabindex="0" data-toggle="selectbox">
  <input type="hidden" name="color">
  <i class="selectbox-icon"></i>
  <div class="default-text">Blue</div>
  <div class="selectbox-menu">
    <div class="item" data-value="blue" data-selected="true">Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item disabled">Invalid item</div>
  </div>
</div>
```

### Selectbox with header

```html
<div class="selectbox" role="button" tabindex="0" data-toggle="selectbox">
  <input type="hidden" name="color">
  <i class="selectbox-icon"></i>
  <div class="default-text">Blue</div>
  <div class="selectbox-menu">
    <div class="header">Header</div>
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
  </div>
</div>
```

### Selectbox with divider

```html
<div class="selectbox" role="button" tabindex="0" data-toggle="selectbox">
  <input type="hidden" name="color">
  <i class="selectbox-icon"></i>
  <div class="default-text">Blue</div>
  <div class="selectbox-menu">
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="divider"></div>
    <div class="item" data-value="orange">Orange</div>
    <div class="item" data-value="yellow">Yellow</div>
  </div>
</div>
```

### Selectbox with search input

```html
<div class="selectbox" role="button" tabindex="0" data-search="true" data-toggle="selectbox">
  <input type="hidden" name="color">
  <i class="selectbox-icon"></i>
  <div class="default-text">Blue</div>
  <div class="selectbox-menu">
    <div class="input-search-container">
      <input class="form-control" type="text" name="search">
    </div>
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item" data-value="green">Green</div>
  </div>
</div>
```

For the selected item, add `data-selected`.
For each item, you must add `data-value`.
By default, the module will try to find the text node otherwise, it will check if the attribute `data-text` is present.

### Sizing

Add the class `selectbox-lg` to increase the size.

```html!
<div class="selectbox selectbox-lg" data-toggle="selectbox">
...
</div>
```


Add the class `selectbox-sm` to reduce the size.

```html!
<div class="selectbox selectbox-sm" data-toggle="selectbox">
...
</div>
```

## JavaScript

### Selectbox (list)

```js
// ES6
import Selectbox from 'phonon/dist/js/components/selectbox';

const selectbox = new Selectbox({
  element: '.selectbox',
});

// ES5
const selectbox = phonon.selectbox({
  element: '.selectbox',
});

// jQuery
const selectbox = $('.selectbox').selectbox();
```

### Search selectbox

```js
// ES6
import SelectboxSearch from 'phonon/dist/js/components/selectbox/search';

const searchSelectbox = new SelectboxSearch({
  element: '.selectbox',
});

// ES5
const searchSelectbox = phonon.selectbox({
  element: '.selectbox',
  search: true,
});

// jQuery
const searchSelectbox = $('.selectbox').selectbox({
  search: true,
});
```

### Options

|     Name     |     Description      |     Default value      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|-------------------------------------|
|    selectable      |  Shows and updates the selected value. | true | yes `data-selectable` |
|    search      |  If it is true, it will filter items according to the value of the input. | false | yes `data-search` |
|    filterItems      |  Customer filter function `filterItems(search, item)`. If you use a custom handler, the function must return `true` if the item should be visible to the user or `false` otherwise. | null | no |


<br />

The default implementation of `filterItems` is the following:

```js
function filterItems(search = '', item = {}) {
  return item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1;
}
```

Where:

* `search` (String) - input value of the selectbox.
* `item` (Object{text, value}) - the item to filter. Text is displayed in the selectbox and value is the hidden value.

### Methods

#### getSelected()

* returns: `String`

Returns the selected value.

#### setSelected(value, text)

* `value` - the selected value.
* `text` - the text to display for the given `value`.
* returns: `<undefined>`

Set the current value.

```js
selectbox.setSelected('green');
```

it is possible to display a custom text with the second parameter.

```js
selectbox.setSelected('green', 'Current text');
```

#### show()

* returns: `<boolean>`

Any selectbox can be shown with JavaScript. For this, we call the `show()` method:

```js
selectbox.show();
```

#### hide()

* returns: `<boolean>`

Any selectbox can be hidden with JavaScript. For this, we call the `hide()` method:

```js
selectbox.hide();
```

#### toggle()

* returns: `<boolean>`

Any selectbox can be toggled with JavaScript. For this, we call the `toggle()` method:

```js
selectbox.toggle();
```

## Events

It may be useful to use the events that affect your selectbox.
For this, you can use object and DOM events.

|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the selectbox is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the selectbox is completely hidden (will wait for CSS transitions to complete). |

### Object Events

```js
phonon.selectbox({
  element: '.selectbox',
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
  itemSelected(selected) { // or onItemSelected
    console.log('It works!');
    console.log(selected.item);
    console.log(selected.text);
    console.log(selected.value);
  },
});
```

### DOM Events

```js
document.querySelector('.selectbox').addEventListener('show.ph.selectbox', () => {
  console.log('It works!');
});

document.querySelector('.selectbox').addEventListener('shown.ph.selectbox', () => {
  console.log('It works!');
});

document.querySelector('.selectbox').addEventListener('hide.ph.selectbox', () => {
  console.log('It works!');
});

document.querySelector('.selectbox').addEventListener('hidden.ph.selectbox', () => {
  console.log('It works!');
});
```
