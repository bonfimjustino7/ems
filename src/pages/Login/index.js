import React, { useEffect, useState } from "react";
import "./styles.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Img from "../../assets/img/logo.png";
import Input from "../../components/Input";
import { useToasts } from "react-toast-notifications";

const { ipcRenderer } = window.require("electron");

const Login = () => {
  const history = useHistory();
  const { setContext } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    ipcRenderer.send("size-window", 1100, 600);
    ipcRenderer.on("login-reply", (e, resp) => {
      console.log("Resposta do ipcmain: ", resp);
      if (resp) {
        setContext({
          usuario: resp.usuario,
          usuario_id: resp.usuario_id,
          isGerente: resp.isGerente,
        });
        history.push("/gerente");
      } else {
        addToast("Login inválido", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    });
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();
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
          <Input label="Login" onChange={(e) => setLogin(e.target.value)} />
          <Input
            label="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="actions">
            <a onClick={() => history.push("/recuperar-senha")}>
              Esqueci minha senha
            </a>
            <button type="submit">OK</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
