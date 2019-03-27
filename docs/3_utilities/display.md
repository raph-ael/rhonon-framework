---
title: Display
---

## Introduction

Responsive utility classes.

## Notation

`.d-{value}` for `xs`.

`.d-{breakpoint}-{value}` for `sm`, `md`, `lg`, and `xl`.

Where `value`

none
inline
inline-block
block
table
table-cell
table-row
flex
inline-flex


### Examples


```html
<div class="d-inline p-2 bg-primary text-white">d-inline</div>
<div class="d-inline p-2 bg-dark text-white">d-inline</div>

<span class="d-block mt-2 p-2 bg-primary text-white">d-block</span>
<span class="d-block mt-2 p-2 bg-dark text-white">d-block</span>
```

### Responsive examples

```html
<div class="d-lg-none">hide on screens wider than lg</div>
<div class="d-none d-lg-block">hide on screens smaller than lg</div>
```

|     Screen Size     |     Class      |
|--------------------|----------------------|
| Hidden on all      |	`.d-none` |
| Hidden only on xs  |	`.d-none` `.d-sm-block` |
| Hidden only on sm  |	`.d-sm-none` `.d-md-block` |
| Hidden only on md  |	`.d-md-none` `.d-lg-block` |
| Hidden only on lg  |	`.d-lg-none` `.d-xl-block` |
| Hidden only on xl  |	`.d-xl-none` |
| Visible on all     |	`.d-block` |
| Visible only on xs |	`.d-block` `.d-sm-none` |
| Visible only on sm |	`.d-none` `.d-sm-block` `.d-md-none` |
| Visible only on md |	`.d-none` `.d-md-block` `.d-lg-none` |
| Visible only on lg |	`.d-none` `.d-lg-block` `.d-xl-none` |
| Visible only on xl |	`.d-none` `.d-xl-block` |


### Display in print

* `.d-print-none`
* `.d-print-inline`
* `.d-print-inline-block`
* `.d-print-block`
* `.d-print-table`
* `.d-print-table-row`
* `.d-print-table-cell`
* `.d-print-flex`
* `.d-print-inline-flex`

Example

```html
<div class="d-print-none">Screen Only (Hide on print only)</div>
<div class="d-none d-print-block">Print Only (Hide on screen only)</div>
<div class="d-none d-lg-block d-print-block">Hide up to large on screen, but always show on print</div>
```

<div class="alert alert-secondary" role="alert">

This documentation "Display" is a derivative of "[Display](http://getbootstrap.com/docs/4.1/utilities/display/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Display" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
