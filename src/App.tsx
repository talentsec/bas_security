import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import store from "@/store";
import { Provider } from "react-redux";
import ProgressBar from "./components/Progress";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<ProgressBar></ProgressBar>}>
          <AppRoutes></AppRoutes>
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
