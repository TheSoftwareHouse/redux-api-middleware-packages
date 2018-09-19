import { RSAA } from 'redux-api-middleware';

import createEndpointMiddleware from '../middleware';

describe('Endpoint middleware factory', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.REACT_APP_API_URL;
  });

  test('throws an error if API url is not specified', () => {
    expect(() => {
      createEndpointMiddleware();
    }).toThrowErrorMatchingSnapshot();
  });

  test('creates middleware that handles only RSAA', () => {
    process.env.REACT_APP_API_URL = 'http://foo.bar';

    const endpointMiddleware = createEndpointMiddleware();

    const next = jest.fn();

    endpointMiddleware()(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  test('creates middleware that prefixes endpoint unless it is excluded or it is a function', () => {
    process.env.REACT_APP_API_URL = 'http://foo.bar';

    const endpointMiddleware = createEndpointMiddleware();

    const next = jest.fn();

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo/bar',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://foo.bar/foo/bar',
      },
    });

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://foo.bar/baz',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://foo.bar/baz',
      },
    });

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'https://foo.bar/baz',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'https://foo.bar/baz',
      },
    });

    const endpoint = () => 'http://foo.bar/baz';

    endpointMiddleware()(next)({
      [RSAA]: {
        endpoint,
        foo: 'bar',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        endpoint,
        foo: 'bar',
      },
    });
  });

  test('allows to pass API url via options', () => {
    process.env.REACT_APP_API_URL = 'http://foo.bar';

    const endpointMiddleware = createEndpointMiddleware({
      apiUrl: 'http://bar.baz',
    });

    const next = jest.fn();

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo/bar',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://bar.baz/foo/bar',
      },
    });
  });

  test('allows to pass excluded prefixes via options', () => {
    process.env.REACT_APP_API_URL = 'http://foo.bar';

    const endpointMiddleware = createEndpointMiddleware({
      excluded: ['/foo'],
    });

    const next = jest.fn();

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://foo.bar',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: 'http://foo.barhttp://foo.bar',
      },
    });

    endpointMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo/bar',
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo/bar',
      },
    });
  });
});
