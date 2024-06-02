# Lite-XML
A very lightweight XML construction library.

[![npm version](https://badge.fury.io/js/lite-xml.svg)](https://badge.fury.io/js/lite-xml)

## Installation

You can install lite-xml using npm, yarn, or pnpm:

```bash
npm install lite-xml
```

```bash
yarn add lite-xml
```

```bash
pnpm add lite-xml
```

## Documentation
See the [**API Documentation**](docs/README.md)

## Modules

Lite-XML includes three kinds of [JavaScript module format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
The process for achieving this is inspired by [this blog post from SenseDeep](https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html).
This library uses [ESBuild](https://esbuild.github.io/api/#platform) for constructing each module platform.

### ES Module
Exports all code as an ECMAScript Module, suitable for `import`:

`import * as liteXml from 'lite-xml'`


ES Modules are typically used:
  * In browser-based applications.
  * In applications that use a JS bundler system (ex: Bundler, Bun, Webpack, ESBuild, Vite, etc).
  * In [modern Node.js applications](https://nodejs.org/api/packages.html#determining-module-system).

### CommonJS / Node module

Exports all code as a CommonJS, suitable for `require`.

`const liteXML = require('lite-xml')`

CommonJS modules are typically used by older Node.JS applications.

### Browser script.

Exports all code as a ES6 script suitable for inclusion in browsers.
The code is wrapped in an [Immediately invoked function expression](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression) (or "IIFE").

`<script src='lite-xml/dist/browser/index.js'>`

Browser scripts are typically used by older web browser-based applications.

## License
lite-xml is licensed under the [MIT License](https://opensource.org/licenses/MIT).

