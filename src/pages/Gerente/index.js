import React, { useEffect, useState } from "react";
import { FiPower } from "react-icons/fi";
import { useHistory } from "react-router";
import { useAuth } from "../../context/auth";
import "./styles.css";
const { ipcRenderer } = window.require("electron");

const Gerente = () => {
  const history = useHistory();
  const { contextData } = useAuth();

  useEffect(() => {
    ipcRenderer.send("maximize-window");
    console.log("size");
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
              onClick={() => history.push("/")}
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
              <div className="opcao" id="cliente"></div>
            )}
            {contextData.isGerente && (
              <div
                className="opcao"
                onClick={() => history.push("/home")}
                id="usuario"
              ></div>
            )}
            <div className="opcao" id="configuracao"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gerente;
