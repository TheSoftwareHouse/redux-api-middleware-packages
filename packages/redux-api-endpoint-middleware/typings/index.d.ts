import { Middleware } from 'redux';

type Options = {
    apiUrl?: string;
    excluded?: string[];
};

export default function endpointMiddlewareFactory(options: Options): Middleware;