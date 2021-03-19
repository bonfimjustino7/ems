import React from "react";
import { HashRouter } from "react-router-dom";
import AuthProvider from "./context/auth";
import Routers from "./routes";

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routers />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
