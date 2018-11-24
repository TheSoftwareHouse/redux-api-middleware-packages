import { RSAA } from 'redux-api-middleware';

import createParamsMiddleware from '../middleware';

describe('Params middleware', () => {
  test('handles only RSAA', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware();

    paramsMiddleware()(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  test('handles only RSAA with params', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware();

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

    const paramsMiddleware = createParamsMiddleware();
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
    const paramsMiddleware = createParamsMiddleware();

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

  test('parametrises endpoint correctly using stringify options - array format changed', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware();

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
        paramsOptions: {
          arrayFormat: 'brackets',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo?foo=bar&bar%5B%5D=baz&bar%5B%5D=qaz&baz=&quux=0&quuz=false',
      }),
    });
  });

  test('parametrises endpoint correctly using stringify options - indices disabled', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware();

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
        paramsOptions: {
          indices: false,
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo?foo=bar&bar=baz&bar=qaz&baz=&quux=0&quuz=false',
      }),
    });
  });

  test('overrides parameters from endpoint', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware();

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

  test('uses custom default stringify options', () => {
    const next = jest.fn();
    const paramsMiddleware = createParamsMiddleware({
      defaultOptions: {
        arrayFormat: 'brackets',
      },
    });

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
        endpoint: '/foo?foo=bar&bar%5B%5D=baz&bar%5B%5D=qaz&baz=&quux=0&quuz=false',
      }),
    });
  });
});
