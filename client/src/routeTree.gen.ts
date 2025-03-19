/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router';

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as OrdersImport } from './routes/orders';
import { Route as OrdersOrderIdImport } from './routes/orders/$orderId';

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')();

// Create/Update Routes

const OrdersRoute = OrdersImport.update({
  id: '/orders',
  path: '/orders',
  getParentRoute: () => rootRoute,
} as any);

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route));

const OrdersOrderIdRoute = OrdersOrderIdImport.update({
  id: '/$orderId',
  path: '/$orderId',
  getParentRoute: () => OrdersRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexLazyImport;
      parentRoute: typeof rootRoute;
    };
    '/orders': {
      id: '/orders';
      path: '/orders';
      fullPath: '/orders';
      preLoaderRoute: typeof OrdersImport;
      parentRoute: typeof rootRoute;
    };
    '/orders/$orderId': {
      id: '/orders/$orderId';
      path: '/$orderId';
      fullPath: '/orders/$orderId';
      preLoaderRoute: typeof OrdersOrderIdImport;
      parentRoute: typeof OrdersImport;
    };
  }
}

// Create and export the route tree

interface OrdersRouteChildren {
  OrdersOrderIdRoute: typeof OrdersOrderIdRoute;
}

const OrdersRouteChildren: OrdersRouteChildren = {
  OrdersOrderIdRoute: OrdersOrderIdRoute,
};

const OrdersRouteWithChildren =
  OrdersRoute._addFileChildren(OrdersRouteChildren);

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute;
  '/orders': typeof OrdersRouteWithChildren;
  '/orders/$orderId': typeof OrdersOrderIdRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute;
  '/orders': typeof OrdersRouteWithChildren;
  '/orders/$orderId': typeof OrdersOrderIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexLazyRoute;
  '/orders': typeof OrdersRouteWithChildren;
  '/orders/$orderId': typeof OrdersOrderIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/orders' | '/orders/$orderId';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/orders' | '/orders/$orderId';
  id: '__root__' | '/' | '/orders' | '/orders/$orderId';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute;
  OrdersRoute: typeof OrdersRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  OrdersRoute: OrdersRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/orders"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/orders": {
      "filePath": "orders.tsx",
      "children": [
        "/orders/$orderId"
      ]
    },
    "/orders/$orderId": {
      "filePath": "orders/$orderId.tsx",
      "parent": "/orders"
    }
  }
}
ROUTE_MANIFEST_END */
