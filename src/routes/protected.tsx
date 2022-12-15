import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";
const Layout = React.lazy(() => import("@/components/Layout"));
const My = React.lazy(() => import("@/pages/my"));
const MyVector = React.lazy(() => import("@/pages/my/vector/index"));
const MyVectorDetail = React.lazy(() => import("@/pages/my/vector/Detail"));
const MyVectorEdit = React.lazy(() => import("@/pages/my/vector/EditVector/index"));
const MyScene = React.lazy(() => import("@/pages/my/scene/index"));
const MyJob = React.lazy(() => import("@/pages/my/job/index"));
const All = React.lazy(() => import("@/pages/all/index"));

const App = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spin tip="Loading..." />
          </div>
        }
      >
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
            element: <MyVector />
          },
          {
            path: "vector/edit",
            element: <MyVectorEdit />
          },
          {
            path: "vector/:id",
            element: <MyVectorDetail />
          },
          {
            path: "scene",
            element: <MyScene />
          },
          {
            path: "job",
            element: <MyJob />
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
