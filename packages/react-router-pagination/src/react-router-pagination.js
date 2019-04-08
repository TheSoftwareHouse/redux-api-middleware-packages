// @flow

import React, { Component } from 'react';
import { parse, stringify } from 'qs';

import type { ConfigOptions, PaginationProps } from './react-router-pagination.types';
import type { ComponentType } from 'react';

export const connectRouterWithPagination = (
  RenderComponent: ComponentType<any>,
  {
    currentPageKey = 'currentPage',
    pageChangeCallbackKey = 'onChange',
    pageParamName = 'page',
    itemsPerPageParamName = 'itemsPerPage',
    defaultItemsPerPage = 10,
  }: ConfigOptions = {},
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
      params[itemsPerPageParamName] = defaultItemsPerPage;
      this.props.history.push({ search: '?' + stringify(params) });
    };

    componentDidMount() {
      const queryParams = this.parseQueryParamsToObject();

      if (!queryParams[pageParamName] || !queryParams[itemsPerPageParamName]) {
        return this.setDefaultPageParam(queryParams);
      }
      this.props.onPageChange({
        page: +queryParams[pageParamName],
        itemsPerPage: +queryParams[itemsPerPageParamName],
      });
    }

    componentDidUpdate(prevProps: PaginationProps) {
      const queryParams = this.parseQueryParamsToObject();

      if (
        prevProps.location.search !== this.props.location.search &&
        queryParams[pageParamName] &&
        queryParams[itemsPerPageParamName]
      ) {
        this.props.onPageChange({
          page: +queryParams[pageParamName],
          itemsPerPage: +queryParams[itemsPerPageParamName],
        });
      }
      if (!queryParams[pageParamName] || !queryParams[itemsPerPageParamName]) {
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
