import { Middleware } from 'redux';

type Options = {
  apis?: {
    [key: string]: Object;
  };
  excluded?: string[];
};

export default function endpointMiddlewareFactory(options: Options): Middleware;
