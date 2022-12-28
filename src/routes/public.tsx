import React from "react";
const Login = React.lazy(() => import("@/pages/login"));
const Example = React.lazy(() => import("@/pages/example"));

export const publicRoutes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/example",
    element: <Example />
  }
];
