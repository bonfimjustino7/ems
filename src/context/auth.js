import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [contextData, setContext] = useState({
    login: null,
    usuario_id: null,
  });

  return (
    <AuthContext.Provider
      value={{
        contextData,
        setContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useCount must be used within a CountProvider");
  const { contextData, setContext } = context;
  return { contextData, setContext };
}
