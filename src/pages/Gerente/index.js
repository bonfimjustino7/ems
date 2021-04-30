import React, { useEffect, useState } from "react";
import { FiPower } from "react-icons/fi";
import { useHistory } from "react-router";
import { useAuth } from "../../context/auth";
import "./styles.css";
const { ipcRenderer } = window.require("electron");

const Gerente = () => {
  const history = useHistory();
  const [contextData, setContextData] = useState({});

  useEffect(() => {
    ipcRenderer.send("maximize-window");
    console.log("size");

    const dataString = localStorage.getItem("usuario");
    const dataObject = JSON.parse(dataString);

    setContextData(dataObject);
  }, [history]);

  return (
    <>
      <header>
        <div id="cabecalho">
          <div className="icon-power"></div>
          <span id="titulo">Easy Market System</span>
          <div>
            <FiPower
              className="icon-power"
              onClick={() => {
                ipcRenderer.send("size-window", 1100, 600);
                localStorage.removeItem("usuario");
                history.push("/");
              }}
              color="#fff"
              size={60}
            />
          </div>
        </div>
        <div id="subtitulo">
          <span id="subSpan">
            {contextData.isGerente ? "Administração" : "Cliente"}
          </span>
        </div>
      </header>

      <div className="container-gerente">
        <div className="container-menu">
          <div className="menu">
            <div
              className="opcao"
              id="produto"
              onClick={() =>
                contextData.isGerente
                  ? history.push("/produtos")
                  : history.push("/home")
              }
            ></div>

            {contextData.isGerente && (
              <div
                className="opcao"
                id="cliente"
                onClick={() => history.push("/usuarios")}
              ></div>
            )}
            {contextData.isGerente && (
              <div
                className="opcao"
                onClick={() => history.push("/home")}
                id="usuario"
              ></div>
            )}
            <div
              className="opcao"
              id="configuracao"
              onClick={() => history.push("/configuracoes")}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gerente;
