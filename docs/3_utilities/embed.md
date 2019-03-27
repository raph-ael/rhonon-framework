---
title: Embeds
---

## Introduction

Responsive content (video or slideshow) embeds based on a ratio.

### Info

* Rules are applied to `<iframe>`, `<embed>`, `<video>` and `<object>`.
* Use `.embed-responsive` for the parent element.
* Usage of `.embed-responsive-item` is recommended for the child (embed) element.

### Example

```html
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
</div>
```

### Aspects ratios

```html!
<!-- 21:9 aspect ratio -->
<div class="embed-responsive embed-responsive-21by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 4:3 aspect ratio -->
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 1:1 aspect ratio -->
<div class="embed-responsive embed-responsive-1by1">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>
```

<div class="alert alert-secondary" role="alert">

This documentation "Embed" is a derivative of "[Embed](http://getbootstrap.com/docs/4.1/utilities/embed/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Embed" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
