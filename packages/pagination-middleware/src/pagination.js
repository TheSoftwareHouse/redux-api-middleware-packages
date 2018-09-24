// @flow

import React, { Component, Fragment } from 'react';

import type { Options, Props, State } from './types';
import type { ComponentType } from 'react';

const withPagination = (options: Options) => (WrapperComponent: ComponentType<Props>) => {
  return class extends Component<Props, State> {
    state = {
      page: +new URLSearchParams(window.location.search).get('page') || 1,
    };

    pushNewLocation = (params: any) => this.props.history.push(window.location.pathname + '?' + params.toString());

    onPageChange = (page: number) => this.setState({ page });

    componentDidMount() {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams.get('page')) {
        searchParams.append('page', '1');
      }

      this.pushNewLocation(searchParams);
      this.props.onPageChange();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
      if (prevProps.location.search !== this.props.location.search) {
        this.props.onPageChange();
      }
      if (prevState.page !== this.state.page) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', this.state.page.toString());

        this.pushNewLocation(searchParams);
      }
    }

    render() {
      return (
        <WrapperComponent
          {...this.props}
          render={customizeOptions => (
            <options.renderComponent
              page={+this.state.page}
              onPageChange={this.onPageChange}
              {...this.props.pagination}
              {...customizeOptions}
            />
          )}
        />
      );
    }
  };
};

export default withPagination;
