---
title: Theming
---

Phonon uses the heart of Bootstrap SCSS.
As with Bootstrap 4, you can edit SCSS variables.

Example:

```scss
$blue:    #3271d1;
```

For this, create a file `custom.scss` and import it before the Phonon SCSS file.

```scss
@import 'path/to/custom.scss'; // my custom SCSS
@import 'phonon/src/scss/phonon.scss';
```

Run `node ./build/css` to apply your custom values and generate you CSS files.
