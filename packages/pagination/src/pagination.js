// @flow

import React, { Component } from 'react';
import { parse, stringify } from 'qs';

import type { ConfigOptions, PaginationProps } from './pagination.types';
import type { ComponentType } from 'react';

export const connectRouterWithPagination = (
  RenderComponent: ComponentType<any>,
  {
    currentPageKey = 'currentPage',
    pageChangeCallbackKey = 'onChange',
    // above two values are use to set names of props which are passing directly to pagination render component
    pageParamName = 'page', // determines what is the name of page param which is displaying in URL
  }: ConfigOptions = {},
) => (WrappedComponent: ComponentType<any>) => {
  return class extends Component<PaginationProps> {
    // update history with new page param
    updateCurrentURL = (page: number) => {
      const queryParams = this.parseQueryParamsToObject();
      queryParams[pageParamName] = page;
      this.props.history.push({ search: '?' + stringify(queryParams) });
    };

    parseQueryParamsToObject = () => parse(this.props.location.search.slice(1));

    setDefaultPageParam = (params: { [string]: string | number }) => {
      params[pageParamName] = 1;
      const paramsString = stringify(params);
      if (window.history.state) {
        window.history.pushState({}, null, window.location.origin + this.props.location.pathname + '?' + paramsString);
      }
    };

    componentDidMount() {
      const queryParams = this.parseQueryParamsToObject();
      // if page param is missing in URL set its value to 1
      if (!queryParams[pageParamName]) {
        this.setDefaultPageParam(queryParams);
      }
      //dispatching redux action
      this.props.onPageChange({
        page: +queryParams[pageParamName],
      });
    }

    componentDidUpdate(prevProps: PaginationProps) {
      const queryParams = this.parseQueryParamsToObject();
      // if page param is missing in URL set its value to 1
      if (!queryParams[pageParamName]) {
        this.setDefaultPageParam(queryParams);
      }
      if (prevProps.location.search !== this.props.location.search) {
        //dispatching redux action
        this.props.onPageChange({
          page: +queryParams[pageParamName],
        });
      }
    }

    render() {
      const page = this.parseQueryParamsToObject()[pageParamName] || 1;
      // prepare custom prop names which are passing to pagination render component
      const config = {
        [currentPageKey]: +page,
        [pageChangeCallbackKey]: this.updateCurrentURL,
      };
      return (
        <WrappedComponent
          {...this.props}
          pagination={customizeOptions => <RenderComponent {...config} {...customizeOptions} />}
        />
      );
    }
  };
};
