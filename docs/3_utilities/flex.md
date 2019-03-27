---
title: Flex
---

## Introduction

Flex utility classes.

## Flex container

### Flex

```html
<div class="d-flex p-2 bg-primary">I'm a flexbox container!</div>
```

### Inline flex

```html
<div class="d-inline-flex p-2 bg-primary">I'm an inline flexbox container!</div>
```

### Responsive flex container

* `.d-flex`
* `.d-inline-flex`
* `.d-sm-flex`
* `.d-sm-inline-flex`
* `.d-md-flex`
* `.d-md-inline-flex`
* `.d-lg-flex`
* `.d-lg-inline-flex`
* `.d-xl-flex`
* `.d-xl-inline-flex`

## Direction

### Horizontal

`.flex-row`

`.flex-row-reverse`

```html
<div class="d-flex flex-row bg-primary mb-3">
  <div class="p-2 bg-primary">Flex item 1</div>
  <div class="p-2 bg-primary">Flex item 2</div>
  <div class="p-2 bg-primary">Flex item 3</div>
</div>
<div class="d-flex flex-row-reverse bg-primary">
  <div class="p-2 bg-primary">Flex item 1</div>
  <div class="p-2 bg-primary">Flex item 2</div>
  <div class="p-2 bg-primary">Flex item 3</div>
</div>
```

### Columns

Use `.flex-column` or `.flex-column-reverse`

```html
<div class="d-flex flex-column bg-primary mb-3">
  <div class="p-2 bg-primary">Flex item 1</div>
  <div class="p-2 bg-primary">Flex item 2</div>
  <div class="p-2 bg-primary">Flex item 3</div>
</div>
<div class="d-flex flex-column-reverse bg-primary">
  <div class="p-2 bg-primary">Flex item 1</div>
  <div class="p-2 bg-primary">Flex item 2</div>
  <div class="p-2 bg-primary">Flex item 3</div>
</div>
```

### Responsive directions

* `.flex-row`
* `.flex-row-reverse`
* `.flex-column`
* `.flex-column-reverse`
* `.flex-sm-row`
* `.flex-sm-row-reverse`
* `.flex-sm-column`
* `.flex-sm-column-reverse`
* `.flex-md-row`
* `.flex-md-row-reverse`
* `.flex-md-column`
* `.flex-md-column-reverse`
* `.flex-lg-row`
* `.flex-lg-row-reverse`
* `.flex-lg-column`
* `.flex-lg-column-reverse`
* `.flex-xl-row`
* `.flex-xl-row-reverse`
* `.flex-xl-column`
* `.flex-xl-column-reverse`


## Justify content

### Start

```html
<div class="d-flex justify-content-start bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### End

```html
<div class="d-flex justify-content-end bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Center

```html
<div class="d-flex justify-content-center bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Between

```html
<div class="d-flex justify-content-between bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Around

```html
<div class="d-flex justify-content-around bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Responsive justify content

* `.justify-content-start`
* `.justify-content-end`
* `.justify-content-center`
* `.justify-content-between`
* `.justify-content-around`
* `.justify-content-sm-start`
* `.justify-content-sm-end`
* `.justify-content-sm-center`
* `.justify-content-sm-between`
* `.justify-content-sm-around`
* `.justify-content-md-start`
* `.justify-content-md-end`
* `.justify-content-md-center`
* `.justify-content-md-between`
* `.justify-content-md-around`
* `.justify-content-lg-start`
* `.justify-content-lg-end`
* `.justify-content-lg-center`
* `.justify-content-lg-between`
* `.justify-content-lg-around`
* `.justify-content-xl-start`
* `.justify-content-xl-end`
* `.justify-content-xl-center`
* `.justify-content-xl-between`
* `.justify-content-xl-around`


## Align items

### Start

```html
<div class="d-flex align-items-start bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### End

```html
<div class="d-flex align-items-end bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Center

```html
<div class="d-flex align-items-center bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Baseline

```html
<div class="d-flex align-items-baseline bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Stretch

```html
<div class="d-flex align-items-stretch bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Responsive align items

* `.align-items-start`
* `.align-items-end`
* `.align-items-center`
* `.align-items-baseline`
* `.align-items-stretch`
* `.align-items-sm-start`
* `.align-items-sm-end`
* `.align-items-sm-center`
* `.align-items-sm-baseline`
* `.align-items-sm-stretch`
* `.align-items-md-start`
* `.align-items-md-end`
* `.align-items-md-center`
* `.align-items-md-baseline`
* `.align-items-md-stretch`
* `.align-items-lg-start`
* `.align-items-lg-end`
* `.align-items-lg-center`
* `.align-items-lg-baseline`
* `.align-items-lg-stretch`
* `.align-items-xl-start`
* `.align-items-xl-end`
* `.align-items-xl-center`
* `.align-items-xl-baseline`
* `.align-items-xl-stretch`

## Align self

### Start

```html
<div class="d-flex bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary align-self-start">Aligned flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### End

```html
<div class="d-flex bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary align-self-end">Aligned flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Center

```html
<div class="d-flex bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary align-self-center">Aligned flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Baseline

```html
<div class="d-flex bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary align-self-baseline">Aligned flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

### Stretch

```html
<div class="d-flex bg-primary" style="height: 120px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary align-self-stretch">Aligned flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```


### Responsive align self

* `.align-self-start`
* `.align-self-end`
* `.align-self-center`
* `.align-self-baseline`
* `.align-self-stretch`
* `.align-self-sm-start`
* `.align-self-sm-end`
* `.align-self-sm-center`
* `.align-self-sm-baseline`
* `.align-self-sm-stretch`
* `.align-self-md-start`
* `.align-self-md-end`
* `.align-self-md-center`
* `.align-self-md-baseline`
* `.align-self-md-stretch`
* `.align-self-lg-start`
* `.align-self-lg-end`
* `.align-self-lg-center`
* `.align-self-lg-baseline`
* `.align-self-lg-stretch`
* `.align-self-xl-start`
* `.align-self-xl-end`
* `.align-self-xl-center`
* `.align-self-xl-baseline`
* `.align-self-xl-stretch`

## Fill

```html
<div class="d-flex bg-primary">
  <div class="p-2 flex-fill bg-primary">Flex item</div>
  <div class="p-2 flex-fill bg-primary">Flex item</div>
  <div class="p-2 flex-fill bg-primary">Flex item</div>
</div>
```

### Responsive fill

* `.flex-fill`
* `.flex-sm-fill`
* `.flex-md-fill`
* `.flex-lg-fill`
* `.flex-xl-fill`

## Grow

```html
<div class="d-flex bg-primary">
  <div class="p-2 flex-grow-1 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Third flex item</div>
</div>
```

### Responsive grow

* `.flex-grow-0`
* `.flex-grow-1`
* `.flex-sm-grow-0`
* `.flex-sm-grow-1`
* `.flex-md-grow-0`
* `.flex-md-grow-1`
* `.flex-lg-grow-0`
* `.flex-lg-grow-1`
* `.flex-xl-grow-0`
* `.flex-xl-grow-1`

## Shrink

```html
<div class="d-flex bg-primary">
  <div class="p-2 w-100 bg-primary">Flex item</div>
  <div class="p-2 flex-shrink-1 bg-primary">Flex item</div>
</div>
```

### Responsive shrink

* `.flex-shrink-0`
* `.flex-shrink-1`
* `.flex-sm-shrink-0`
* `.flex-sm-shrink-1`
* `.flex-md-shrink-0`
* `.flex-md-shrink-1`
* `.flex-lg-shrink-0`
* `.flex-lg-shrink-1`
* `.flex-xl-shrink-0`
* `.flex-xl-shrink-1`

## Auto margin

```html
<div class="d-flex bg-primary mb-3">
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
</div>

<div class="d-flex bg-primary mb-3">
  <div class="mr-auto p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
</div>

<div class="d-flex bg-primary mb-3">
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="ml-auto p-2 bg-primary">Flex item</div>
</div>
```

### Auto margin with align-items

```html
<div class="d-flex align-items-start flex-column bg-primary mb-3" style="height: 200px">
  <div class="mb-auto p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
</div>

<div class="d-flex align-items-end flex-column bg-primary mb-3" style="height: 200px">
  <div class="p-2 bg-primary">Flex item</div>
  <div class="p-2 bg-primary">Flex item</div>
  <div class="mt-auto p-2 bg-primary">Flex item</div>
</div>
```

## Wrap

### No wrap

```html
<div class="d-flex flex-nowrap bg-primary" style="width: 100px;">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive no wrap

* `.flex-nowrap`
* `.flex-sm-nowrap`
* `.flex-md-nowrap`
* `.flex-lg-nowrap`
* `.flex-xl-nowrap`

### Wrap

```html
<div class="d-flex flex-wrap bg-primary">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive wrap

* `.flex-wrap`
* `.flex-sm-wrap`
* `.flex-md-wrap`
* `.flex-lg-wrap`
* `.flex-xl-wrap`


### Reverse wrap

```html
<div class="d-flex flex-wrap-reverse bg-primary">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive reverse wrap

* `.flex-wrap-reverse`
* `.flex-sm-wrap-reverse`
* `.flex-md-wrap-reverse`
* `.flex-lg-wrap-reverse`
* `.flex-xl-wrap-reverse`


## Order

<div class="d-flex flex-nowrap bg-primary">
  <div class="order-3 p-2 bg-primary">First flex item</div>
  <div class="order-2 p-2 bg-primary">Second flex item</div>
  <div class="order-1 p-2 bg-primary">Third flex item</div>
</div>

### Responsive order

* `.order-0`
* `.order-1`
* `.order-2`
* `.order-3`
* `.order-4`
* `.order-5`
* `.order-6`
* `.order-7`
* `.order-8`
* `.order-9`
* `.order-10`
* `.order-11`
* `.order-12`
* `.order-sm-0`
* `.order-sm-1`
* `.order-sm-2`
* `.order-sm-3`
* `.order-sm-4`
* `.order-sm-5`
* `.order-sm-6`
* `.order-sm-7`
* `.order-sm-8`
* `.order-sm-9`
* `.order-sm-10`
* `.order-sm-11`
* `.order-sm-12`
* `.order-md-0`
* `.order-md-1`
* `.order-md-2`
* `.order-md-3`
* `.order-md-4`
* `.order-md-5`
* `.order-md-6`
* `.order-md-7`
* `.order-md-8`
* `.order-md-9`
* `.order-md-10`
* `.order-md-11`
* `.order-md-12`
* `.order-lg-0`
* `.order-lg-1`
* `.order-lg-2`
* `.order-lg-3`
* `.order-lg-4`
* `.order-lg-5`
* `.order-lg-6`
* `.order-lg-7`
* `.order-lg-8`
* `.order-lg-9`
* `.order-lg-10`
* `.order-lg-11`
* `.order-lg-12`
* `.order-xl-0`
* `.order-xl-1`
* `.order-xl-2`
* `.order-xl-3`
* `.order-xl-4`
* `.order-xl-5`
* `.order-xl-6`
* `.order-xl-7`
* `.order-xl-8`
* `.order-xl-9`
* `.order-xl-10`
* `.order-xl-11`
* `.order-xl-12`

## Align content

### Start

```html
<div class="d-flex align-content-start flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-start`
* `.align-content-sm-start`
* `.align-content-md-start`
* `.align-content-lg-start`
* `.align-content-xl-start`

### End

```html
<div class="d-flex align-content-end flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-end`
* `.align-content-sm-end`
* `.align-content-md-end`
* `.align-content-lg-end`
* `.align-content-xl-end`

### Center

```html
<div class="d-flex align-content-center flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-center`
* `.align-content-sm-center`
* `.align-content-md-center`
* `.align-content-lg-center`
* `.align-content-xl-center`

### Between

```html
<div class="d-flex align-content-between flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-between`
* `.align-content-sm-between`
* `.align-content-md-between`
* `.align-content-lg-between`
* `.align-content-xl-between`

### Around

```html
<div class="d-flex align-content-around flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-around`
* `.align-content-sm-around`
* `.align-content-md-around`
* `.align-content-lg-around`
* `.align-content-xl-around`

### Stretch

```html
<div class="d-flex align-content-stretch flex-wrap bg-primary" style="height: 200px">
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
  <div class="p-2 bg-secondary">Flex item</div>
</div>
```

#### Responsive align content

* `.align-content-stretch`
* `.align-content-sm-stretch`
* `.align-content-md-stretch`
* `.align-content-lg-stretch`
* `.align-content-xl-stretch`

<div class="alert alert-secondary" role="alert">

This documentation "Flex" is a derivative of "[Flex](http://getbootstrap.com/docs/4.1/utilities/flex/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Flex" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
