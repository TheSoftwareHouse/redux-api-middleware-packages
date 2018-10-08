# Translations Provider

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/react-json-translation-provider

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/react-json-translation-provider

## Usage example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import plLocaleData from 'react-intl/locale-data/pl';

import createTranslationsProvider from '@tshio/react-json-translation-provider';

import { AppComponent } from 'app/app.component';

import en from 'assets/i18n/en.json';
import pl from 'assets/i18n/pl.json';

addLocaleData([...enLocaleData, ...plLocaleData]);

const TranslationsProvider = createTranslationsProvider({
  en,
  pl,
});

ReactDOM.render(
  <TranslationsProvider locale="en">
    <AppComponent />
  </TranslationsProvider>,
  document.getElementById('root'),
);
```

## Getting current locale

In order to get the current application locale you can use `withLocale` HOC, which adds `locale` props to the
decorated component.

```js
import React, { Component } from 'react';
import { withLocale } from '@tshio/react-json-translation-provider';

// Simple component that display the current locale
class DisplayLocale extends Component {
  render() {
    const { locale } = this.props;

    return <span>{locale}</span>;
  }
}

// Create a new component that is "connected" to the translations provider
const DecoratedDisplayLocale = withLocale(DisplayLocale);
```

## Changing locale

The `TranslationsContext` is exposing the method `update` which is used for updating the locale. In order to add it to
the component `withTranslationsContext` HOC can be used.

```js
import React, { Component } from 'react';
import { withTranslationsContext } from '@tshio/react-json-translation-provider';

class ChangeLocale extends Component {
  render() {
    const { locale, updateLocale } = this.props;

    return (
      <div>
        Current locale: {locale}
        <button onClick={() => updateLocale('en')}>English</button>
        <button onClick={() => updateLocale('pl')}>Polish</button>
      </div>
    );
  }
}

const DecoratedChangeLocale = withTranslationsContext(ChangeLocale);
```

## Connecting to Redux

It is important that `withLocale` wraps the component that implements `shouldComponentUpdate`. For example, when using
Redux.

```js
// This gets around shouldComponentUpdate
withLocale(connect(...)(MyComponent))
// or
compose(
  withLocale,
  connect(...)
)(MyComponent)

// This does not
connect(...)(withLocale(MyComponent))
// nor
compose(
  connect(...),
  withLocale
)(MyComponent)
```
