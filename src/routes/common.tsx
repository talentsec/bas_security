import React from "react";
const Landing = React.lazy(() => import("@/components/Landing"));
const NotFound = React.lazy(() => import("@/components/NotFound"));

export const commonRoutes = [
  { path: "/", element: <Landing /> },
  { path: "*", element: <NotFound></NotFound> }
];
