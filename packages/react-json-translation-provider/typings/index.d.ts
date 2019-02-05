import { Component, ComponentType, Context, ReactNode } from 'react';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Locale = {
  update: (locale: string) => void;
  value: string;
};

type TranslationsProviderProps = {
  children: ReactNode;
  locale: string;
};

type Locales = {
  [lang: string]: Object;
};

export const TranslationsContext: Context<Locale>;

export default function createTranslationsProvider(locales: Locales): ComponentType<TranslationsProviderProps>;

export function withLocale<P>(
  wrappedComponent: ComponentType<P & { locale: string }>,
): ComponentType<Omit<P, 'locale'>>;

export function withTranslationsContext<P>(
  wrappedComponent: ComponentType<P & { locale: string; updateLocale: (locale: string) => void }>,
): ComponentType<Omit<Omit<P, 'updateLocale'>, 'locale'>>;
