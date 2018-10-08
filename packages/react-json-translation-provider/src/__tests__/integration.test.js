import React from 'react';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { withLocale, withTranslationsContext } from '../context';
import createTranslationsProvider from '../provider';

describe('Translations provider factory', () => {
  test('updates locale correctly', () => {
    const locales = {
      en: {
        FOO: {
          BAR: 'en.foobar',
        },
      },
      pl: {
        FOO: {
          BAR: 'pl.foo.bar',
        },
      },
    };

    const TranslationsProvider = createTranslationsProvider(locales);

    const ChangeLocaleComponent = ({ locale, updateLocale }) => (
      <div>
        <p>{locale}</p>
        <button onClick={() => updateLocale('pl')}>pl</button>
      </div>
    );
    const EnhancedChangeLocaleComponent = withTranslationsContext(ChangeLocaleComponent);

    const wrapper = mount(
      <TranslationsProvider>
        <>
          <FormattedMessage id="FOO.BAR" />

          <EnhancedChangeLocaleComponent />
        </>
      </TranslationsProvider>,
    );

    expect(wrapper.find('p').text()).toBe('en');

    wrapper.find('button').simulate('click');
    expect(wrapper.find('span').text()).toBe('pl.foo.bar');
    expect(wrapper.find('p').text()).toBe('pl');
  });

  test('passes current locale correctly', () => {
    const locales = {
      pl: {
        FOO: {
          BAR: 'en.foobar',
        },
      },
    };

    const TranslationsProvider = createTranslationsProvider(locales);

    const CurrentLocaleComponent = ({ locale }) => <p>{locale}</p>;
    const EnhancedCurrentLocaleComponent = withLocale(CurrentLocaleComponent);

    const wrapper = mount(
      <TranslationsProvider locale="pl">
        <EnhancedCurrentLocaleComponent />
      </TranslationsProvider>,
    );

    expect(wrapper.find('p').text()).toBe('pl');
  });
});
