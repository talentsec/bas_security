import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "@/hooks/auth";

export default function Landing() {
  const [hasAuth] = useAuth();
  console.log(hasAuth, 4444);

  // useEffect(() => {
  //   if (user) {
  //     navigate("/app/my/vector");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  return <Navigate to={hasAuth ? "/app/my/vector" : "/login"} />;
}
