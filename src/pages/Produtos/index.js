import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosArrowBack, IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill, BsSearch } from "react-icons/bs";
import { useHistory } from "react-router";

import "./styles.css";
const { ipcRenderer } = window.require("electron");

const Produtos = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [deleteItems, setDeleteItems] = useState([]);
  const [toggledClearRows, setToggledClearRows] = useState(false);

  const deleteProduto = (id) => {
    const res = ipcRenderer.sendSync("delete-produto", { idProduto: id });
    if (res) {
      setData(data.filter((item) => item.id !== id));
    } else {
      alert("Erro ao apagar");
    }
  };

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Nome",
      selector: "nome",
      sortable: true,
    },
    {
      name: "Descrição",
      selector: "descricao",
      sortable: true,
    },
    {
      name: "Marca",
      selector: "marca",
      sortable: true,
    },
    {
      name: "Preço",
      selector: "preco",
      sortable: true,
    },
    {
      name: "Quantidade",
      selector: "quantidade",
      sortable: true,
    },
    {
      name: "Código de Barras",
      selector: "codigo_barras",
      sortable: true,
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
    ipcRenderer.on("produtos-reply", (e, resp) => {
      console.log("Resposta de produtos: ", resp);
      setData(resp);
      setLoading(false);
    });

    return () => ipcRenderer.removeAllListeners("produtos-reply");
  }, []);

  useEffect(() => {
    ipcRenderer.send("produtos", { nome: filterText });
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
            onClick={() => history.goBack()}
            id="icone_user"
            size={60}
            color="#fff"
          />

          <span id="titulo">Easy Market System</span>

          <div></div>
        </div>
        <div id="subtitulo">
          <span id="subSpan">Produtos cadastrados</span>
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
            <ButtonAdicionar onClick={() => history.push("/produtos/novo")} />,
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

export default Produtos;
