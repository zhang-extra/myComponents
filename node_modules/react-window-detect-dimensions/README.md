# react-window-detect-dimensions [![NPM version][npm-image]][npm-url]  [![Dependency Status][daviddm-image]][daviddm-url]
> React component to detect window size change

## Installation

```sh
$ npm install --save react-window-detect-dimensions
```

## Usage

```js
class DimensionDemo extends React.Component<{}> {
  render() {
    return (
      <WindowDimensions>
        { ({ windowWidth, windowHeight }) => (
          <div>
            width: {windowWidth}, // get window width
            height: {windowHeight} // get window height
          </div>
        )}
      </WindowDimensions>
    );
  }
}
```

## Start example server

```
npm start
```

## generate demo

```js
npm run gh-pages
```

## License

MIT © [chilijung]()


[npm-image]: https://badge.fury.io/js/react-window-detect-dimensions.svg
[npm-url]: https://npmjs.org/package/react-window-detect-dimensions
[travis-image]: https://travis-ci.org/Canner/react-window-detect-dimensions.svg?branch=master
[travis-url]: https://travis-ci.org/Canner/react-window-detect-dimensions
[daviddm-image]: https://david-dm.org/Canner/react-window-detect-dimensions.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Canner/react-window-detect-dimensions
