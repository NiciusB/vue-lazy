# vue-lazy

[![npm](https://img.shields.io/npm/v/vue-lazy.svg)](https://www.npmjs.com/package/vue-lazy) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/) [![](https://img.shields.io/github/size/niciusb/vue-lazy/dist/VueLazy.umd.min.js.svg)](https://github.com/NiciusB/vue-lazy/blob/master/dist/VueLazy.umd.min.js)

> A Vue.js plugin for lazy loading images

## Installation

```bash
npm install --save vue-lazy
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueLazy from 'vue-lazy'

Vue.use(VueLazy)
```

```html
<img v-lazy="https://example.com/image.png" />
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="vue-lazy/dist/vue-lazy.js"></script>

<!-- From CDN -->
<script src="https://unpkg.com/vue-lazy"></script>
```
```js
Vue.use(VueLazy.default)
```
```html
<!-- Usage, after installing the plugin -->
<img v-lazy="https://example.com/image.png" />
```

## Development
```
git clone git@github.com:NiciusB/vue-lazy.git
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## License

[MIT](http://opensource.org/licenses/MIT)
