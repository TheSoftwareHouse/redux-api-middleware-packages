import {Component, Context, ComponentType} from 'react';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Options = {
    currentPageKey?: string;
    pageChangeCallbackKey?: string;
    pageParamName?: string;
    itemsPerPageParamName?: string;
    defaultItemsPerPage?: number;
};

type RenderProps = {
    currentPage: number;
    onChange: (page: number) => void;
};

type PaginationProp<R, T> = {
    pagination: (customizeOptions?: T) => ComponentType<R & T & RenderProps>;
};

export function connectRouterWithPagination<R, S, T>(
    renderComponent: ComponentType<R>,
    options?: Options,
): (wrappedComponent: ComponentType<S & PaginationProp<R, T>>) => ComponentType<Omit<S, 'pagination'>>;