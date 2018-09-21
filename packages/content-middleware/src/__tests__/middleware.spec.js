import { RSAA } from 'redux-api-middleware';

import contentMiddleware from '../middleware';

describe('Content middleware', () => {
  test('handles only RSAA', () => {
    const next = jest.fn();

    contentMiddleware()(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  test('stringifies object or array bodies', () => {
    const next = jest.fn();

    contentMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        body: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        body: '{"foo":"bar"}',
      }),
    });

    contentMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        body: ['foo', 'bar'],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        body: '["foo","bar"]',
      }),
    });

    contentMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        body: true,
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        body: true,
      }),
    });

    const data = new FormData();
    data.append('foo', 'bar');

    contentMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        body: data,
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        body: data,
      }),
    });
  });

  test('adds application/json header unless headers are function', () => {
    const next = jest.fn();

    contentMiddleware()(next)({
      [RSAA]: {
        body: {
          foo: 'bar',
        },
        headers: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        headers: {
          foo: 'bar',
          'Content-Type': 'application/json',
        },
      }),
    });

    contentMiddleware()(next)({
      [RSAA]: {
        body: ['foo', 'bar'],
        headers: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        headers: {
          foo: 'bar',
          'Content-Type': 'application/json',
        },
      }),
    });

    contentMiddleware()(next)({
      [RSAA]: {
        body: true,
        headers: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        headers: {
          foo: 'bar',
        },
      }),
    });

    const headers = () => ({
      foo: 'bar',
    });

    contentMiddleware()(next)({
      [RSAA]: {
        headers,
        body: {
          foo: 'bar',
        },
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        headers,
      }),
    });
  });
});
