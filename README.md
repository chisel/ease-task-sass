# Ease Task Runner SASS Plugin

This is a plugin for the [Ease task runner](https://github.com/chisel/ease). It uses the NPM [sass](https://github.com/sass/node-sass) module to process SASS file into CSS.

# Installation

```
npm install ease-task-sass --save-dev
```

**easeconfig.js:**
```js
const sass = require('ease-task-sass');

module.exports = ease => {

  ease.install('sass', sass, {});

};
```

# Configuration

This plugin takes a config object similar to [SASS Options](https://github.com/sass/node-sass#options) while ignoring `file`, `outFile`, and `data` properties. Instead, the following properties are added to the options object:
  - `dir`: Path to a directory containing all the SASS files, relative to `easeconfig.js`
  - `outDir`: Path to the output directory where the CSS files should be written, relative to `easeconfig.js`
  - `clearOutDir`: Boolean indicating if the output directory should be emptied first

# Example

**easeconfig.js:**
```js
const sass = require('ease-task-sass');

module.exports = ease => {

  ease.install('sass', sass, {
    dir: 'sass',
    outDir: 'css',
    sourceMap: true,
    clearOutDir: true
  });

  ease.job('process-sass-files', ['sass']);

};
```

**CLI:**
```
ease process-sass-files
```
