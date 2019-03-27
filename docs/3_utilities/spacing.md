---
title: Spacing
---

## Introduction

Spacing utility classes.

`{property}{sides}-{size}`

Responsive `{property}{sides}-{breakpoint}-{size}` for `sm`, `md`, `lg`, and `xl`.

Sizes:

1 sets `0`
1 sets `$spacer * .25`
2 sets `$spacer * .5`
3 sets `$spacer * .75`
4 sets `$spacer`
auto sets margin or padding to `auto`

## Margin

The prefix `m-` defines a margin.

`mt-{size}` - sets margin-top of size `{size}`
`mb-{size}` - sets margin-bottom of size `{size}`
`ml-{size}` - sets margin-left of size `{size}`
`mr-{size}` - sets margin-right of size `{size}`
`mx-{size}` - sets both margin-left and margin-right of size `{size}`
`my-{size}` - sets both margin-top and margin-bottom of size `{size}`
`m-{size}` - sets margin in 4 directions of size `{size}`

Example:

```html
<div class="mt-2 mr-1 mb-1 mr-1 bg-primary" style="height: 50px"></div>

<div class="mx-2 my-4 bg-secondary" style="height: 50px"></div>
```

## Padding

The prefix `p-` defines a padding.

`pt-{size}` - sets padding-top of size `{size}`
`pb-{size}` - sets padding-bottom of size `{size}`
`pl-{size}` - sets padding-left of size `{size}`
`pr-{size}` - sets padding-right of size `{size}`
`px-{size}` - sets both padding-left and padding-right of size `{size}`
`py-{size}` - sets both padding-top and padding-bottom of size `{size}`
`p-{size}` - sets padding in 4 directions of size `{size}`

Example:

```html
<div class="pt-2 pr-1 pb-1 pr-1 bg-primary"></div>

<div class="px-2 py-4 bg-secondary"></div>
```

## Horizontal centering

```html
<div class="mx-auto" style="width: 200px;">
  Centered element
</div>
```

<div class="alert alert-secondary" role="alert">

This documentation "Spacing" is a derivative of "[Spacing](http://getbootstrap.com/docs/4.1/utilities/spacing/)"
by Bootstrap, used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
"Spacing" is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) by Bootstrap.
</div>
