---
title: Modal
---

## Introduction

A modal is a flexible window that is visible on top of the main window.

<div style="position:relative;padding: 8px;background: #eee;">
  <div class="modal show" tabindex="-1" role="modal" style="position:relative;width: 350px;">
    <div class="modal-inner" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <div class="btn-group float-right" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal show modal-primary" tabindex="-1" role="modal" style="position:relative;width: 350px;">
    <div class="modal-inner" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <div class="btn-group float-right" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal show modal-danger" tabindex="-1" role="modal" style="position:relative;width: 350px;">
    <div class="modal-inner" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <div class="btn-group float-right" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Live example

<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Launch demo modal</button>

<script>document.querySelector('.page [data-target="#exampleModal"]').addEventListener('click', function () {phonon.modal({title: 'Modal title', message: 'Modal body text goes here.'}).show();});</script>


```html!
<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Launch demo modal</button>

<!-- Modal -->
<div class="modal" id="exampleModal" tabindex="-1" role="modal">
  <div class="modal-inner" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <div class="btn-group float-right" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## JavaScript control

### Modal with markup

Use `element` to specify the target modal.

```js
// ES6
const Modal = require('phonon/dist/js/components/modal');

const modal = new Modal({
  element: '#exampleModal',
});

// ES5
const modal = phonon.modal({
  element: '#exampleModal',
});

// jQuery
const modal = $('#exampleModal').modal();
```

### Modal without markup

By not using the `element` property, it will create a modal's HTMLElement dynamically.
This is particularly useful if you want to set up a modal without worrying about its HTML code.

```js
// ES6
const Modal = require('phonon/dist/js/components/modal');

const modal = new Modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});

// ES5
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});

// jQuery
const modal = $().modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});
```

### Prompt modal

<button class="btn btn-primary" id="tryPromptModal">Try it</button>

<script>
document.querySelector('#tryPromptModal').addEventListener('click', function () {
  phonon.prompt({
    title: 'Modal title',
    message: 'Modal body text goes here.',
  }).show();
});
</script>

```js
// ES6
const ModalPrompt = require('phonon/dist/js/components/modal/prompt');

const prompt = new ModalPrompt({
  title: 'Prompt title',
  message: 'Prompt body text goes here.',
});

// ES5
const prompt = phonon.prompt({
  title: 'Prompt title',
  message: 'Prompt body text goes here.',
});

// jQuery
const prompt = $().prompt({
  title: 'Prompt title',
  message: 'Prompt body text goes here.',
});

prompt.setInputValue() // only available with prompt objects
prompt.getInputValue() // only available with prompt objects
```

### Confirm modal

<button class="btn btn-primary" id="tryConfirmModal">Try it</button>

<script>
document.querySelector('#tryConfirmModal').addEventListener('click', function () {
  phonon.confirm({
    title: 'Quit',
    message: 'Are you sure you want to quit?',
  }).show();
});
</script>

```js
// ES6
const ModalConfirm = require('phonon/dist/js/components/modal/confirm');

const confirm = new ModalConfirm({
  title: 'Confirm title',
  message: 'Confirm body text goes here.',
});

// ES5
const confirm = phonon.confirm({
  title: 'Confirm title',
  message: 'Confirm body text goes here.',
});

// jQuery
const confirm = $().confirm({
  title: 'Confirm title',
  message: 'Confirm body text goes here.',
});
```

### Loader modal

<button class="btn btn-primary" id="tryLoaderModal">Try it</button>

<script>
document.querySelector('#tryLoaderModal').addEventListener('click', function () {
  var loader = phonon.modalLoader({
    title: 'Loading',
    message: 'Please wait 3 seconds.',
    cancelable: false,
  })

  loader.show();

  setTimeout(function () {
    loader.hide();
  }, 3000);
});
</script>

```js
// ES6
const ModalLoader = require('phonon/dist/js/components/modal/loader');

const modalLoader = new ModalLoader({
  title: 'Loader title',
  message: 'Loader body text goes here.',
});

// ES5
const modalLoader = phonon.modalLoader({
  title: 'Loader title',
  message: 'Loader body text goes here.',
});

// jQuery
const modalLoader = $().modalLoader({
  title: 'Loader title',
  message: 'Loader body text goes here.',
});
```

### Modal with custom buttons

Each modal type (normal, prompt, confirm and prompt) supports custom buttons.
Note that the event of the button **must be unique**.
The click event of a button will fire the associated callback automatically.

<button class="btn btn-primary" id="tryCustomButtons">Try it</button>

<script>
document.querySelector('#tryCustomButtons').addEventListener('click', function () {
  phonon.modal({
    title: 'Modal title',
    message: 'Modal body text goes here.',
    buttons: [
      { event: 'cancel', text: 'Cancel', dismiss: true, class: 'btn btn-secondary' },
      { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
    ],
    onCancel: () => {
      phonon.modal({ title: 'Event', message: 'Cancel' }).show();
    },
    onConfirm: () => {
      phonon.modal({ title: 'Event', message: 'Confirm' }).show();
    },
  }).show();
});
</script>

```js
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
  buttons: [
    { event: 'cancel', text: 'Cancel', dismiss: true, class: 'btn btn-secondary' },
    { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
  ],
  onCancel: () => { // or cancel
    console.log('Cancel')
  },
  onConfirm: () => { // or confirm
    console.log('Confirm')
  },
});
```

You can also define your own event names.
In the following example, we trigger the event called `neutralAnswer` when we click on the button.

```js
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
  buttons: [
    { event: 'neutralAnswer', text: 'Custom button', dismiss: true, class: 'btn btn-primary' },
  ],
  neutralAnswer: () => { // or onNeutralAnswer
    console.log('Well we close it!')
  },
});
```

## Options

|     Name     |     Description      |     Default value      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|-------------------------------------|
|    title      |  The modal title. | null | no |
|    message      |  The modal message. | null | no |
|    cancelable      |  Determines if a modal is cancelable or not cancelable by pressing a key or by clicking outside of the modal. | true | yes `data-cancelable` |
|    cancelableKeyCodes   |  Array of keys that allow to hide the modal. Default keys are escape and enter. | [27, 13] | no |
|    background      | The background color such as `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light` and `dark`. | null | yes `data-background` |


## Methods

### show()

* returns: `<boolean>`

Any modal can be shown with JavaScript. For this, we call the `show()` method:

```js
modal.show();
```


### hide()

* returns: `<boolean>`

Any modal can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
modal.hide();
```

### getInputValue()

* returns: `String`

It is possible to retrieve the text field value of any prompt type.

```js
const value = modal.getInputValue();
```

### setInputValue(value)

* `value` (String) - the input value.

It is possible to set the text field value of any prompt type.

```js
modal.setInputValue('Hello World');
```

## Events

It may be useful to use the events that affect your modal.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the modal is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the modal is completely hidden (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
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
document.querySelector('.modal').addEventListener('show.ph.modal', () => {
  console.log('It works!');
});

document.querySelector('.modal').addEventListener('shown.ph.modal', () => {
  console.log('It works!');
});

document.querySelector('.modal').addEventListener('hide.ph.modal', () => {
  console.log('It works!');
});

document.querySelector('.modal').addEventListener('hidden.ph.modal', () => {
  console.log('It works!');
});
```
