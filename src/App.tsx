import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import store from "@/store";
import { Provider } from "react-redux";
import ProgressBar from "./components/Progress";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<ProgressBar></ProgressBar>}>
          <ConfigProvider locale={zhCN}>
            <AppRoutes></AppRoutes>
          </ConfigProvider>
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
