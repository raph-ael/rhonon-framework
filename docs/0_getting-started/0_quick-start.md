---
title: Quick start
---

Phonon builds are located in the `dist/` directory.
They provide convenient solutions that can be installed with no effort and that satisfy the most common editing use cases.

Please, read more about [custom builds](#0_getting-started/1_custom-build) if you would like to optimize the size of Phonon by importing required components only.

## Installation

The installation can take place in several ways:

- [Download the latest release](https://github.com/quark-dev/Phonon-Framework/releases) and use dist files.
- Clone the repo: `git clone https://github.com/quark-dev/Phonon-Framework.git`.
- Install with [npm](https://www.npmjs.com): `npm install phonon`.
- Install with [yarn](https://yarnpkg.com/en/): `yarn add phonon`.
- Install with [Bower](https://bower.io): `bower install phonon`.
- Use [CDNJS](https://cdnjs.com/libraries/PhononJs).

## Starter Template (website)

```html!
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Phonon CSS -->
    <link rel="stylesheet" href="phonon/dist/css/phonon.css">

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- Optional JavaScript -->
    <script src="phonon/dist/js/phonon.min.js"></script>
  </body>
</html>
```

## Starter Template (SPA)

In addition to the `phonon.js` base file that contains the visual components,
you need to include the SPA modules `phonon-spa.js`.

```html!
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Phonon CSS -->
    <link rel="stylesheet" href="phonon/dist/css/phonon.css">

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <script src="phonon/dist/js/phonon.min.js"></script>
    <script src="phonon/dist/js/phonon-spa.min.js"></script>
  </body>
</html>
```
