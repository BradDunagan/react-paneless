[![NPM](https://img.shields.io/npm/v/paneless.svg)](https://www.npmjs.com/package/paneless) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# paneless

A minimal window manager as a React-JS component.

# warning
Early development. Tried only on Chrome so far.

# Example
Here is a screenshot of an app I am working on that uses this library. This shows one _frame_ with six _panes_ (two of the panes are on tabs so one of those panes is behind the front tab).
![RR App Screenshot](/images/RR-App-ScreenShot-001.png?raw=true "RR Screenshot")


# Also an example app in this repository

This repository includes an example app. Here is a screenshot of that app along with other images illustrating features.

## Install

```bash
npm install --save paneless
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'paneless'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## License

MIT © [BradDunagan](https://github.com/BradDunagan)
