import React from "react";
const Login = React.lazy(() => import("@/pages/login"));

export const publicRoutes = [
  {
    path: "/login",
    element: <Login />
  }
];
