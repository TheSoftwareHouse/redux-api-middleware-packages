# Pagination

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tshio/react-router-pagination

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tshio/react-router-pagination

## Usage

In order to connect custom component with pagination, it is required to import [`withRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md) function from [`react-router-dom`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) and use it to wrap `connectRouterWithPagination` function.

At the beginning, wrap your list component using `connectRouterWithPagination` function in your container:

```js
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { connectRouterWithPagination } from '@tshio/react-router-pagination';

import { fetchUsers } from '../redux/users/users.actions';
import { ListComponent } from '../list.component';
import { PaginationComponent } from '../pagination.component';

const mapStateToProps = () => ({ ... })

const mapDispatchToProps = dispatch => ({
    onPageChange: (params) => dispatch(fetchUsers(params)); // `onPageChange` method will dispatch your redux action when page changes
});

//And now, connect your store with list component

export const ListContainer = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  connectRouterWithPagination(PaginationComponent,
    // In first parameter pass your custom pagination component
    {
        // Second parameter (optional) is an object and allow you to pass config options
        pageChangeCallbackKey: "pageChangeCallback",
        currentPageKey: "page",
        pageParamName: "usersListPage"
        // See list of available options below..
    }
  )
)(ListComponent);
```

**Keep in mind, that `onPageChange` function is required and always has to be implemented!**

And then, you can render pagination component in list component:

```js
import React, { Component } from 'react';

// ...

export class ListComponent extends Component {
  render() {
    return (
      <div>
        // ...
        {this.props.pagination({
          // here, you can define custom properties for pagination component
        })}
      </div>
    );
  }
}
```

This package is working with `page` parameter which is included in URL. If `page` param is missing, it will be set as default with value `1`.

## Config options

| Option name           | Default value | Type     | Role                                                                                                   |
| --------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| currentPageKey        | `currentPage` | `string` | Name of prop which is passed to pagination component to point on current page.                         |
| pageChangeCallbackKey | `onChange`    | `string` | Name of callback function which is called when you click on navigation button in pagination component. |
| pageParamName         | `page`        | `string` | Determines what is the name of page param which is displaying in URL; e.g. `/users?page=1`.            |
