import React, { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
const Layout = React.lazy(() => import('@/components/Layout'));
const Template = React.lazy(() => import('@/pages/template'));
const Job = React.lazy(() => import('@/pages/job'));
const JobList = React.lazy(() => import('@/pages/job/list'));
const JobTemplate = React.lazy(() => import('@/pages/job/template'));



const App = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            loading
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
    path: '/app',
    element: <App />,
    children: [
      { path: 'template', element: <Template /> },
      {
        path: 'job',
        element: <Job />,
        children: [
          {
            path: 'list',
            element: <JobList></JobList>
          },
          {
            path: 'template',
            element: <JobTemplate></JobTemplate>
          }
        ]
      },
    ],
  },
];