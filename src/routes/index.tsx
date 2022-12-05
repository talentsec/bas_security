import React, { useState } from 'react'
import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
 
export default function Index() {
  // TODO 权限相关代码
  const [hasAuth] = useState(true)

  const routes = hasAuth ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
}
