// @flow

import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';

import flatten from 'flat';

import { TranslationsContext } from './context';

import type { Locales, TranslationsProviderProps, TranslationsProviderState } from './provider.types';

export default function translationsProviderFactory(locales: Locales = {}) {
  if (!Object.keys(locales).length) {
    throw new Error('You must provide at least one locale');
  }

  class TranslationsProvider extends Component<TranslationsProviderProps, TranslationsProviderState> {
    constructor(props: TranslationsProviderProps) {
      super(props);

      this.state = {
        locale: {
          update: this.updateLocale,
          value: props.locale || 'en',
        },
      };
    }

    updateLocale = (locale: string, callback?: Function) =>
      this.setState(
        (prev: TranslationsProviderState) => ({
          ...prev,
          locale: {
            ...prev.locale,
            value: locale,
          },
        }),
        callback,
      );

    render() {
      const messages = flatten(locales[this.state.locale.value]);

      return (
        <TranslationsContext.Provider value={this.state.locale}>
          <IntlProvider locale={this.state.locale.value} messages={messages}>
            {this.props.children}
          </IntlProvider>
        </TranslationsContext.Provider>
      );
    }
  }

  return TranslationsProvider;
}
