---
title: Screen readers
---

## Introduction

Hide elements from assistive technology such as screen readers to improve web accessibility.

## Class

Use `.sr-only` to hide an element to all devices except screen readers.

```html
<a class="sr-only" href="#content">Skip to main content</a>
```

### Focusable class

Use `.sr-only` and `.sr-only-focusable` to show the element again when it's focused.
Press TAB or another key to test it.

```html
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
```



## Sass mixin

```scss
.skip-navigation {
  @include sr-only;
  @include sr-only-focusable;
}
```


<div class="alert alert-secondary" role="alert">

This documentation "Screen readers" is a derivative of "[Screenreaders](http://getbootstrap.com/docs/4.1/utilities/screenreaders/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Screen readers" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
