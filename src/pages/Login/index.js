import React, { useEffect } from "react";
import "./styles.css";
import { useHistory } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

const Login = () => {
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on("login-reply", (e, resp) => {
      console.log(resp);
      history.push("/home");
    });
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();

    ipcRenderer.send("login", { login: "teste" });
  };

  return (
    <div className="main">
      <div className="bg"></div>
      <div className="form-login">
        <div className="header">Login</div>
        <h1>Bem Vindo</h1>
        <p>Por favor acesse sua conta</p>
        <form id="formulario" onSubmit={onSubmit}>
          <label>Login / Email</label>
          <input id="login" type="text" name="login" />
          <label>Senha</label>
          <input id="password" type="password" name="password" />

          <div className="actions">
            <a href="#">Esqueci minha senha</a>
            <button type="submit">OK</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
