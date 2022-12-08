import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "@/hooks/auth";

export default function Landing() {
  const [user] = useAuth();

  // useEffect(() => {
  //   if (user) {
  //     navigate("/app/my/vector");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  return <Navigate to={user ? "/app/my/vector" : "/login"} />;
}
