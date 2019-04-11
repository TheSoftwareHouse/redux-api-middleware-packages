# React Packages

React reusable packages repository

## Packages

This repository is a monorepo that is managed using [Lerna](https://github.com/lerna/lerna).
That means that [several packages](/packages) are published to npm from the same codebase, including:

| Package                                                                    | Version                                                                           | Description                                                                                                         |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`redux-api-auth-middleware`](/packages/redux-api-auth-middleware)         | ![version](https://img.shields.io/npm/v/@tshio/redux-api-auth-middleware.svg)     | Authorization middleware to [redux-api-middleware](https://github.com/agraboso/redux-api-middleware)                |
| [`redux-api-content-middleware`](/packages/redux-api-content-middleware)   | ![version](https://img.shields.io/npm/v/@tshio/redux-api-content-middleware.svg)  | Adding JSON body support middleware to [redux-api-middleware](https://github.com/agraboso/redux-api-middleware)     |
| [`redux-api-endpoint-middleware`](/packages/redux-api-endpoint-middleware) | ![version](https://img.shields.io/npm/v/@tshio/redux-api-endpoint-middleware.svg) | Endpoint prefixing middleware to [redux-api-middleware](https://github.com/agraboso/redux-api-middleware)           |
| [`redux-api-params-middleware`](/packages/redux-api-params-middleware)     | ![version](https://img.shields.io/npm/v/@tshio/redux-api-params-middleware.svg)   | Adding query params to request endpoint to [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) |

React Packages used to contain more libraries, which have been moved to separate repositories:

- [`react-intl-json-provider`](https://github.com/TheSoftwareHouse/react-intl-json-provider)
- [`react-router-pagination`](https://github.com/TheSoftwareHouse/react-router-pagination)
- [`react-router-permissions`](https://github.com/TheSoftwareHouse/react-router-permissions)

## Development

We welcome all contributions. Please read our [CONTRIBUTING.md](https://github.com/TheSoftwareHouse/react-packages/blob/master/CONTRIBUTING.md) first.
You can submit any ideas as [GitHub issues](https://github.com/TheSoftwareHouse/react-packages/issues).
