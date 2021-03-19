import React from "react";
import { useAuth } from "../../context/auth";

const Home = () => {
  const { contextData } = useAuth();
  return <h1>Bem vindo {contextData.login}</h1>;
};

export default Home;
