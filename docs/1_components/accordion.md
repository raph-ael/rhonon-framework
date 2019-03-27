---
title: Accordion
---

## Introduction

An accordion is a component that displays one of the collapsible elements in a limited amout of space.

## Markup

You can use links and buttons to toggle the collapsible elements.

```html
<div class="accordion" id="exampleAccordion" role="tablist">
  <a class="d-block" data-toggle="accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
    Collapsible Group Item #1
  </a>

  <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
    <div class="card-body">
      This is the content of the group item #1.
    </div>
  </div>

  <button class="btn btn-primary" type="button" data-toggle="accordion" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Collapsible Group Item #2</button>

  <div id="collapseTwo" class="collapse" role="tabpane2" aria-labelledby="headingTwo">
    <div class="card-body">
      This is the content of the group item #2.
    </div>
  </div>
</div>
```

## JavaScript

```js
// ES6
import Accordion from 'phonon/dist/js/components/accordion';

const accordion = new Accordion({
  element: '#exampleAccordion',
});

// ES5
const accordion = phonon.accordion({
  element: '#exampleAccordion',
});

// jQuery
const accordion = $('#exampleAccordion').accordion();
```

### Methods

#### show(collapse)

* `collapse` `<HTMLElement>|<string>` - if `collapse` is a String, it is interpreted as a selector. Otherwise, it is expected that it is a HTML element.
* returns: `<boolean>`

```js
accordion.show('#collapseTwo');
```

#### hide(collapse)

* `collapse` `<HTMLElement>|<string>` - if `collapse` is a String, it is interpreted as a selector. Otherwise, it is expected that it is a HTML element.
* returns: `<boolean>`

```js
accordion.hide('#collapseTwo');
```

## Events

The accordion component has events related to the collapse elements.
See events of [collapse](#1_components/collapse) component.

<!-- fix for links -->
<script>document.querySelector('.page #exampleAccordion').addEventListener('click', function (event) { event.preventDefault()});</script>
