import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";
import { GetMyUserDetail } from "@/api/account";
import { setUser } from "@/store/slices/account";
import { useAppDispatch } from "@/hooks/redux";
import { useQuery } from "react-query";
const Layout = React.lazy(() => import("@/components/Layout"));

export default function AppContent() {
  const dispatch = useAppDispatch();

  useQuery(["get-user-detail"], GetMyUserDetail, {
    onSuccess(data) {
      if (data.code === 0) {
        dispatch(setUser(data.data));
      }
    }
  });
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
}
