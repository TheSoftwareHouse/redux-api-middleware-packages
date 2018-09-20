import { RSAA } from 'redux-api-middleware';

import paramsMiddleware from '../middleware';

describe('Params middleware', () => {
  test('handles only RSAA', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  test('handles only RSAA with params', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo',
      }),
    });
  });

  test('handles only RSAA with endpoints as string', () => {
    const next = jest.fn();

    const endpoint = () => '/foo';

    paramsMiddleware()(next)({
      [RSAA]: {
        endpoint,
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        endpoint,
      }),
    });
  });

  test('parametrises endpoint correctly', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo?foo=bar',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        params: {
          bar: ['baz', 'qaz'],
          baz: null,
          qux: undefined,
          quux: 0,
          quuz: false,
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo?foo=bar&bar%5B0%5D=baz&bar%5B1%5D=qaz&baz=&quux=0&quuz=false',
      }),
    });
  });

  test('overrides parameters from endpoint', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo?foo=bar',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        params: {
          foo: 'baz',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo?foo=baz',
      }),
    });
  });
});
