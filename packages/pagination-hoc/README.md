# Pagination HOC

## Installation

Using [yarn](https://yarnpkg.com/lang/en/):

    $ yarn add @tsh/pagination-hoc

Using [npm](https://www.npmjs.com/):

    $ npm install --save @tsh/pagination-hoc

## Usage

In order to connect custom component with pagination, it is required to import [`withRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md) function from [`react-router-dom`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) and use it to wrap `withPagination` function.

At the beginning, wrap your list component using `withPagination` function in your container:

```js
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withPagination from '@tsh/pagination-hoc';

import { fetchUsers } from '../redux/users/users.actions';
import { PaginationComponent } from '../pagination.component';

const mapStateToProps = () => ({ ... })

const mapDispatchToProps = dispatch => ({
    onPageChange: () => dispatch(fetchUsers()); // `onPageChange` method will dispatch your redux action when page changes
});

//And now, connect your store with list component

export const UsersListComponent = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withPagination({
    // Assign to `renderComponent` your custom pagination component
    renderComponent: PaginationComponent
  })
)(List);
```
**Keep in mind, that `onPageChange` function is required and always has to be implemented!**

And then, you can render pagination component in list component:

```js
import React, { Component } from 'react';

// ...

export class UsersListComponent extends Component {
  render() {
    return (
        <div>
        // ...
            {this.props.pagination({
                // here, you can define custom properties for pagination component
            })}
        </div>
    )
  }
}
```

This package is working with `page` parameter which is included in URL. If `page` param is missing, it will be set as default with value `1`.