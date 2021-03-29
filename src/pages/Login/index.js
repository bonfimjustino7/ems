import React, { useEffect } from "react";
import "./styles.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Img from "../../assets/img/logo.png";

const { ipcRenderer } = window.require("electron");

const Login = () => {
  const history = useHistory();
  const { setContext } = useAuth();

  useEffect(() => {
    ipcRenderer.on("login-reply", (e, resp) => {
      console.log("Resposta do ipcmain: ", resp);
      if (resp) {
        setContext({ login: resp });
        history.push("/home");
      } else {
        alert("Login inválido");
      }
    });
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    ipcRenderer.send("login", { login, password });
  };

  return (
    <div className="main">
      <div className="bg">
        <div id="logo"></div>
        <img src={Img} alt="logo" />
      </div>
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
