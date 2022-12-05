import React, { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
const Login = React.lazy(() => import('@/pages/login'));

export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
];