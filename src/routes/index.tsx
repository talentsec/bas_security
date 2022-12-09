import React, { useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { commonRoutes } from "./common";
import { useAuth } from "@/hooks/auth";

export default function Index() {
  // TODO 权限相关代码
  const [hasAuth] = useAuth();

  console.log(hasAuth, 55555);

  const routes = hasAuth ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
}
