import React from "react";
import { useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { commonRoutes } from "./common";
import { useAuth } from "@/hooks/auth";

export default function Index() {
  const [hasAuth] = useAuth();

  // if (location.pathname !== "/" && location.pathname !== "/login" && !hasAuth) {
  //   location.pathname = "/login";
  // }

  const routes = hasAuth ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
}
