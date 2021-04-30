import React, { useEffect, useState } from "react";

import { IoIosArrowBack, IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill, BsSearch } from "react-icons/bs";
import { useHistory } from "react-router";

import "./styles.css";
import { useAuth } from "../../context/auth";
import { useToasts } from "react-toast-notifications";
import Input from "../../components/Input";
const { ipcRenderer } = window.require("electron");

const Configuracoes = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const { contextData, setContext } = useAuth();

  useEffect(() => {
    const dataString = localStorage.getItem("usuario");
    const dataObject = JSON.parse(dataString);

    setContext(dataObject);

    const dadosUsuario = ipcRenderer.sendSync("dados-usuario", {
      usuario_id: dataObject.usuario_id,
    });
    setData(dadosUsuario);
  }, []);

  return (
    <>
      <header>
        <div id="cabecalho">
          <IoIosArrowBack
            onClick={() => history.push("/gerente")}
            id="icone_user"
            size={60}
            color="#fff"
          />

          <span id="titulo">Easy Market System</span>

          <div></div>
        </div>
        <div id="subtitulo">
          <span id="subSpan">Configurações</span>
        </div>
      </header>
      <div className="container-cadastro">
        <div className="container-form">
          <div className="row">
            <form className="form-usuario">
              <div className="row">
                <div className="form-field fill">
                  <Input
                    label="Nome do Usuário"
                    name="nome"
                    readOnly
                    value={data?.nome}
                  />
                </div>{" "}
                <div className="form-field fill">
                  <Input
                    label="Sobrenome"
                    name="sobreNome"
                    readOnly
                    value={data?.sobrenome}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-field fill">
                  <Input
                    readOnly
                    label="Login"
                    name="login"
                    value={data?.login}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-field fill">
                  <Input
                    readOnly
                    label="Email"
                    name="email"
                    value={data?.email}
                  />
                </div>
                <div className="form-field fill">
                  <Input
                    label="Telefone"
                    name="telefone"
                    mask="(99) 99999-9999"
                    value={data?.telefone}
                    readOnly
                  />
                </div>
                <div className="form-field fill">
                  <Input
                    label="CPF"
                    name="cpf"
                    value={data?.cpf}
                    mask="99999999999"
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="botoes-configs">
                  <button
                    onClick={() => {
                      setContext({ ...contextData, usuario: data });
                      history.push("/usuarios/novo");
                    }}
                    type="submit"
                    className="button adicionar"
                  >
                    Alterar Dados
                  </button>
                  {contextData.isGerente && (
                    <button
                      style={{ marginLeft: 20 }}
                      onClick={() => {
                        setContext({ ...contextData, compra: null });
                        history.push("/pedidos");
                      }}
                      type="submit"
                      className="button info"
                    >
                      Vendas Realizadas
                    </button>
                  )}
                  <button
                    style={{ marginLeft: 20 }}
                    onClick={() => {
                      setContext({ ...contextData, compra: true });
                      history.push("/pedidos");
                    }}
                    type="submit"
                    className="button info"
                  >
                    Compras Realizadas
                  </button>
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className="button excluir"
                    style={{ marginLeft: 20 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracoes;
