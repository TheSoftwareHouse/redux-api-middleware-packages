// @flow

import React, { createContext, type ComponentType } from 'react';

import type { Locale } from './context.types';

export const TranslationsContext = createContext({
  update: new Function(),
  value: 'en',
});

export const withTranslationsContext = (WrappedComponent: ComponentType<any>) => (props: any) => (
  <TranslationsContext.Consumer>
    {(locale: Locale) => <WrappedComponent {...props} locale={locale.value} updateLocale={locale.update} />}
  </TranslationsContext.Consumer>
);

export const withLocale = (WrappedComponent: ComponentType<any>) => (props: any) => (
  <TranslationsContext.Consumer>
    {(locale: Locale) => <WrappedComponent {...props} locale={locale.value} />}
  </TranslationsContext.Consumer>
);
