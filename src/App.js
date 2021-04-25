import React from "react";
import { HashRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import AuthProvider from "./context/auth";
import Routers from "./routes";
import "./styles/global.css";

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider
          autoDismiss
          autoDismissTimeout={6000}
          placement="bottom-center"
        >
          <Routers />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
