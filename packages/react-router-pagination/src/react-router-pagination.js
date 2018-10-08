// @flow

import React, { Component } from 'react';
import { parse, stringify } from 'qs';

import type { ConfigOptions, PaginationProps } from './react-router-pagination.types';
import type { ComponentType } from 'react';

export const connectRouterWithPagination = (
  RenderComponent: ComponentType<any>,
  { currentPageKey = 'currentPage', pageChangeCallbackKey = 'onChange', pageParamName = 'page' }: ConfigOptions = {},
) => (WrappedComponent: ComponentType<any>) => {
  return class extends Component<PaginationProps> {
    updateCurrentURL = (page: number) => {
      const queryParams = this.parseQueryParamsToObject();
      queryParams[pageParamName] = page;

      this.props.history.push({ search: '?' + stringify(queryParams) });
    };

    parseQueryParamsToObject = () => parse(this.props.location.search.slice(1));

    setDefaultPageParam = (params: { [string]: string | number }) => {
      params[pageParamName] = 1;
      this.props.history.push({ search: '?' + stringify(params) });
    };

    componentDidMount() {
      const queryParams = this.parseQueryParamsToObject();

      if (!queryParams[pageParamName]) {
        return this.setDefaultPageParam(queryParams);
      }
      this.props.onPageChange({
        page: +queryParams[pageParamName],
      });
    }

    componentDidUpdate(prevProps: PaginationProps) {
      const queryParams = this.parseQueryParamsToObject();

      if (prevProps.location.search !== this.props.location.search && queryParams[pageParamName]) {
        this.props.onPageChange({
          page: +queryParams[pageParamName],
        });
      }
      if (!queryParams[pageParamName]) {
        this.setDefaultPageParam(queryParams);
      }
    }

    render() {
      const page = this.parseQueryParamsToObject()[pageParamName] || 1;
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
