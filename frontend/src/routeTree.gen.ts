/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as LoginImport } from './routes/login'
import { Route as DoctorImport } from './routes/_doctor'
import { Route as DoctorIndexImport } from './routes/_doctor/index'
import { Route as DoctorPatientIdImport } from './routes/_doctor/patient/$id'

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const DoctorRoute = DoctorImport.update({
  id: '/_doctor',
  getParentRoute: () => rootRoute,
} as any)

const DoctorIndexRoute = DoctorIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DoctorRoute,
} as any)

const DoctorPatientIdRoute = DoctorPatientIdImport.update({
  id: '/patient/$id',
  path: '/patient/$id',
  getParentRoute: () => DoctorRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_doctor': {
      id: '/_doctor'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DoctorImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/_doctor/': {
      id: '/_doctor/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof DoctorIndexImport
      parentRoute: typeof DoctorImport
    }
    '/_doctor/patient/$id': {
      id: '/_doctor/patient/$id'
      path: '/patient/$id'
      fullPath: '/patient/$id'
      preLoaderRoute: typeof DoctorPatientIdImport
      parentRoute: typeof DoctorImport
    }
  }
}

// Create and export the route tree

interface DoctorRouteChildren {
  DoctorIndexRoute: typeof DoctorIndexRoute
  DoctorPatientIdRoute: typeof DoctorPatientIdRoute
}

const DoctorRouteChildren: DoctorRouteChildren = {
  DoctorIndexRoute: DoctorIndexRoute,
  DoctorPatientIdRoute: DoctorPatientIdRoute,
}

const DoctorRouteWithChildren =
  DoctorRoute._addFileChildren(DoctorRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof DoctorRouteWithChildren
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/': typeof DoctorIndexRoute
  '/patient/$id': typeof DoctorPatientIdRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/': typeof DoctorIndexRoute
  '/patient/$id': typeof DoctorPatientIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_doctor': typeof DoctorRouteWithChildren
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/_doctor/': typeof DoctorIndexRoute
  '/_doctor/patient/$id': typeof DoctorPatientIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/login' | '/register' | '/' | '/patient/$id'
  fileRoutesByTo: FileRoutesByTo
  to: '/login' | '/register' | '/' | '/patient/$id'
  id:
    | '__root__'
    | '/_doctor'
    | '/login'
    | '/register'
    | '/_doctor/'
    | '/_doctor/patient/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DoctorRoute: typeof DoctorRouteWithChildren
  LoginRoute: typeof LoginRoute
  RegisterRoute: typeof RegisterRoute
}

const rootRouteChildren: RootRouteChildren = {
  DoctorRoute: DoctorRouteWithChildren,
  LoginRoute: LoginRoute,
  RegisterRoute: RegisterRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_doctor",
        "/login",
        "/register"
      ]
    },
    "/_doctor": {
      "filePath": "_doctor.tsx",
      "children": [
        "/_doctor/",
        "/_doctor/patient/$id"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/_doctor/": {
      "filePath": "_doctor/index.tsx",
      "parent": "/_doctor"
    },
    "/_doctor/patient/$id": {
      "filePath": "_doctor/patient/$id.tsx",
      "parent": "/_doctor"
    }
  }
}
ROUTE_MANIFEST_END */
