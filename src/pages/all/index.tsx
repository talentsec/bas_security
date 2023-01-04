import React from "react";
import { Outlet } from "react-router-dom";

export default function All() {
  return (
    <div className="bg-gray-50 w-full h-full">
      <Outlet></Outlet>
    </div>
  );
}
