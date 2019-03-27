---
title: Table
---

## Introduction

A table permits to arrange data into rows and columns of cells.

## Markup

```html
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Invert colors

```html
<table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Head

```html
<table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

```html
<table class="table">
  <thead class="thead-light">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Striped rows

```html
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

Dark striped rows.

```html
<table class="table table-striped table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Borders

```html
<table class="table table-bordered">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

Dark

```html
<table class="table table-bordered table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Borderless

```html
<table class="table table-borderless">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

Dark

```html
<table class="table table-borderless table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Rows with hover

```html
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

Dark

```html
<table class="table table-hover table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Sizing

```html
<table class="table table-sm">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Misko Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Contextual

```html
<!-- On rows -->
<table>
  <tr class="table-active">...</tr>

  <tr class="table-primary">...</tr>
  <tr class="table-secondary">...</tr>
  <tr class="table-success">...</tr>
  <tr class="table-danger">...</tr>
  <tr class="table-warning">...</tr>
  <tr class="table-info">...</tr>
  <tr class="table-light">...</tr>
  <tr class="table-dark">...</tr>

  <!-- On cells (`td` or `th`) -->
  <tr>
    <td class="table-active">...</td>

    <td class="table-primary">...</td>
    <td class="table-secondary">...</td>
    <td class="table-success">...</td>
    <td class="table-danger">...</td>
    <td class="table-warning">...</td>
    <td class="table-info">...</td>
    <td class="table-light">...</td>
    <td class="table-dark">...</td>
  </tr>
</table>
```

## Caption

```html
<table class="table">
  <caption>List of users</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Framework</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Jordan</td>
      <td>Walke</td>
      <td>React</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Evan</td>
      <td>You</td>
      <td>Vue.js</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Misko</td>
      <td>Hevery</td>
      <td>AngularJS</td>
    </tr>
  </tbody>
</table>
```

## Responsive

### Always responsive

Horizontal scrolling.

```html
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First</th>
        <th scope="col">Last</th>
        <th scope="col">Framework</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Jordan</td>
        <td>Walke</td>
        <td>React</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Evan</td>
        <td>You</td>
        <td>Vue.js</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Misko</td>
        <td>Hevery</td>
        <td>AngularJS</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Breakpoint

`.table-responsive{-sm|-md|-lg|-xl}`.

```html!
<div class="table-responsive-sm">
  <table class="table">
    ...
  </table>
</div>
```

<div class="alert alert-secondary" role="alert">

This documentation "Table" is a derivative of "[Tables](http://getbootstrap.com/docs/4.1/content/tables/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Table" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
