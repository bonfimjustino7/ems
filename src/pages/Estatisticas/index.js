import React, { useEffect, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";

import { useHistory } from "react-router";

import "./styles.css";
import { useAuth } from "../../context/auth";
import { useToasts } from "react-toast-notifications";

const { ipcRenderer } = window.require("electron");

const Estatisticas = () => {
  const [data, setData] = useState({
    totalCompras: {},
    totalTipo: [],
  });
  const history = useHistory();
  const { contextData, setContext } = useAuth();

  useEffect(() => {
    const totais = ipcRenderer.sendSync("totais", {
      usuario_id: contextData.usuario_id,
    });
    const qtdTipo = ipcRenderer.sendSync("qtd-tipo", {
      usuario_id: contextData.usuario_id,
    });

    setData({ totalCompras: totais, totalTipo: qtdTipo });
  }, []);

  return (
    <>
      <header>
        <div id="cabecalho">
          <IoIosArrowBack
            onClick={() => history.goBack()}
            id="icone_user"
            size={60}
            color="#fff"
          />

          <span id="titulo">Easy Market System</span>

          <div></div>
        </div>
        <div id="subtitulo">
          <span id="subSpan">Estatísticas de Compras</span>
        </div>
      </header>
      <div className="container-cadastro">
        <div className="container-form stats">
          <div>
            <h2>Totais</h2>
            <p>
              Total de gastos: R${" "}
              {data.totalCompras.total
                ? data.totalCompras.total?.toFixed(2)
                : 0}
            </p>
            <p>
              Média de gastos: R${" "}
              {data.totalCompras.medicao_gasto
                ? data.totalCompras.medicao_gasto?.toFixed(2)
                : 0}
            </p>
          </div>

          <div className="tipos">
            {data.totalTipo.length > 0 && (
              <>
                <h2>Produtos por tipo</h2>
                <ul>
                  {data.totalTipo.map((item) => (
                    <li>
                      {item.tipo}: {item.quantidade}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Estatisticas;
