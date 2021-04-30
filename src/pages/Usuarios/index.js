import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosArrowBack, IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill, BsSearch } from "react-icons/bs";
import { useHistory } from "react-router";

import "./styles.css";
import { useAuth } from "../../context/auth";
import { useToasts } from "react-toast-notifications";
const { ipcRenderer } = window.require("electron");

const Usuarios = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [deleteItems, setDeleteItems] = useState([]);
  const [toggledClearRows, setToggledClearRows] = useState(false);
  const { setContext, contextData } = useAuth();
  const { addToast } = useToasts();

  const deleteProduto = (id) => {
    const res = ipcRenderer.sendSync("delete-usuario", { idUsuario: id });
    if (res) {
      setData(data.filter((item) => item.id !== id));
    } else {
      addToast("Erro ao excluir usuario", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const editarUsuario = (row) => {
    console.log(row);
    setContext({ ...contextData, usuario: row });
    history.push("/usuarios/novo");
  };

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "login",
      selector: "login",
      sortable: true,
    },
    {
      name: "Nome",
      selector: "nome",
      sortable: true,
    },
    {
      name: "Sobrenome",
      selector: "sobrenome",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Telefone",
      selector: "telefone",
      sortable: true,
    },
    {
      name: "CPF",
      selector: "cpf",
      sortable: true,
    },
    {
      name: "Tipo",
      selector: "tipoconta",
      sortable: true,
      cell: (row) => (row.tipoconta === 1 ? "Gerente" : "Cliente"),
    },

    {
      name: "Ações",
      allowOverflow: true,
      minWidth: "200px",
      cell: (row) => {
        return (
          <>
            <MdModeEdit
              size={20}
              style={{ marginRight: 10 }}
              className="icon-button"
              onClick={() => editarUsuario(row)}
            />
            <BsFillTrashFill
              className="icon-button"
              size={20}
              onClick={() => deleteProduto(row.id)}
              color="red"
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    ipcRenderer.on("usuarios-reply", (e, resp) => {
      console.log("Resposta usuarios: ", resp);
      setData(resp);
      setLoading(false);
    });

    return () => ipcRenderer.removeAllListeners("usuarios-reply");
  }, []);

  useEffect(() => {
    ipcRenderer.send("usuarios", { nome: filterText });
  }, [filterText]);

  const Loading = () => {
    return <h1>Carregando....</h1>;
  };
  const ButtonAdicionar = ({ onClick }) => {
    return (
      <button className="button adicionar" onClick={onClick}>
        <IoMdAddCircleOutline
          color="white"
          size={18}
          style={{ marginRight: 5 }}
        />
        Adicionar
      </button>
    );
  };
  const ButtonExcluir = ({ onClick }) => {
    return (
      <button className="button excluir" onClick={onClick}>
        <BsFillTrashFill color="white" size={18} style={{ marginRight: 5 }} />
        Apagar Produtos
      </button>
    );
  };

  const SubHeaderComponent = () => {
    return (
      <>
        {deleteItems.length > 0 ? (
          <ButtonExcluir
            onClick={() => {
              const itemIdsRemoved = deleteItems.map((item) => item.id);
              const dadosFiltered = data.filter(
                (item) => !itemIdsRemoved.includes(item.id)
              );

              setData(dadosFiltered);
              setToggledClearRows(!toggledClearRows);
            }}
          />
        ) : (
          <div className="input-search">
            <BsSearch size={18} color="#aaa" style={{ marginRight: 5 }} />
            <input
              value={filterText}
              placeholder="Pesquise"
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        )}
      </>
    );
  };

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
          <span id="subSpan">Usuários cadastrados</span>
        </div>
      </header>
      <div className="container-tabela">
        <DataTable
          subHeader
          subHeaderAlign="left"
          subHeaderComponent={SubHeaderComponent()}
          selectableRows
          onSelectedRowsChange={(state) => setDeleteItems(state.selectedRows)}
          progressPending={loading}
          progressComponent={<Loading />}
          data={data}
          columns={columns}
          actions={[
            <ButtonAdicionar
              onClick={() => {
                setContext({ ...contextData, usuario: null });
                history.push("/usuarios/novo");
              }}
            />,
          ]}
          striped
          pagination
          clearSelectedRows={toggledClearRows}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          paginationDefaultPage={1}
          paginationPerPage={5}
        />
      </div>
    </>
  );
};

export default Usuarios;
