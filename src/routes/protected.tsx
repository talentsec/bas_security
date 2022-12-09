import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
const Layout = React.lazy(() => import("@/components/Layout"));
const My = React.lazy(() => import("@/pages/my"));
const MyVector = React.lazy(() => import("@/pages/my/vector/index"));
// const MyScene = React.lazy(() => import("@/pages/my/scene/index"));
import MyScene from "@/pages/my/scene";
const MyJob = React.lazy(() => import("@/pages/my/job/index"));
const All = React.lazy(() => import("@/pages/all/index"));

const App = () => {
  return (
    <Layout>
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">loading</div>}>
        <Outlet />
      </Suspense>
    </Layout>
  );
};

export const protectedRoutes = [
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "my",
        element: <My />,
        children: [
          {
            path: "vector",
            element: <MyVector></MyVector>
          },
          {
            path: "scene",
            element: <MyScene></MyScene>
          },
          {
            path: "job",
            element: <MyJob></MyJob>
          }
        ]
      },
      {
        path: "all",
        element: <All />
      }
    ]
  }
];
