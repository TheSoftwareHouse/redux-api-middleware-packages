import React from 'react';
import renderer from 'react-test-renderer';
import { FormattedMessage } from 'react-intl';

import createTranslationsProvider from '../provider';

describe('Translations provider factory', () => {
  test('throws an error if no locale is specified', () => {
    expect(() => {
      createTranslationsProvider();
    }).toThrowErrorMatchingSnapshot();
  });

  test('creates translations provider correctly', () => {
    const locales = {
      en: {
        FOO: {
          BAR: 'en.foobar',
        },
      },
    };

    const TranslationsProvider = createTranslationsProvider(locales);

    expect(
      renderer
        .create(
          <TranslationsProvider>
            <FormattedMessage id="FOO.BAR" />
          </TranslationsProvider>,
        )
        .toJSON(),
    ).toMatchSnapshot();
  });
});
