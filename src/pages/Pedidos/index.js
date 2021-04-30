import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosArrowBack } from "react-icons/io";
import { ImStatsDots } from "react-icons/im";
import { BsSearch } from "react-icons/bs";
import { useHistory } from "react-router";

import "./styles.css";
import { useAuth } from "../../context/auth";
import { getDateTimeFormatter } from "../../utils/datetime";
const { ipcRenderer } = window.require("electron");

const Pedidos = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [deleteItems, setDeleteItems] = useState([]);
  const [toggledClearRows, setToggledClearRows] = useState(false);
  const { contextData, setContext } = useAuth();

  useEffect(() => {
    const dataString = localStorage.getItem("usuario");
    const dataObject = JSON.parse(dataString);
    setContext({ ...contextData, dataObject });
  }, []);

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    !contextData.compra && {
      name: "Usuário",
      selector: "usuario",
      sortable: true,
    },
    {
      name: "Produto",
      selector: "produto",
      sortable: true,
    },
    {
      name: "Data",
      selector: "data",
      sortable: true,
      cell: (row) => getDateTimeFormatter(row.data),
    },
    {
      name: "Quantidade",
      selector: "quantidade",
      sortable: true,
    },

    {
      name: "Valor",
      cell: (row) => `R$ ${(row.quantidade * row.preco).toFixed(2)}`,
    },
  ];

  useEffect(() => {
    ipcRenderer.on("vendas", (e, resp) => {
      console.log("Resposta vendas: ", resp);
      setData(resp);
      setLoading(false);
    });

    return () => ipcRenderer.removeAllListeners("vendas");
  }, []);

  useEffect(() => {
    if (filterText !== "") {
      const newData = data.filter((pedido) =>
        pedido.produto.toLowerCase().startsWith(filterText)
      );
      console.log(filterText);
      setData(newData);
    } else {
      if (contextData.compra) {
        ipcRenderer.send("getCompras", { usuario_id: contextData.usuario_id });
      } else {
        ipcRenderer.send("getVendas");
      }
    }
  }, [filterText]);

  const Loading = () => {
    return <h1>Carregando....</h1>;
  };
  const ButtonEstatistica = ({ onClick }) => {
    return (
      <button className="button adicionar" onClick={onClick}>
        <ImStatsDots color="white" size={16} style={{ marginRight: 5 }} />
        Estatisticas
      </button>
    );
  };

  const SubHeaderComponent = () => {
    return (
      <>
        <div className="input-search">
          <BsSearch size={18} color="#aaa" style={{ marginRight: 5 }} />
          <input
            value={filterText}
            placeholder="Pesquise"
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
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
          <span id="subSpan">
            {contextData.compra ? "Histórico de Compras" : "Vendas"}
          </span>
        </div>
      </header>
      <div className="container-tabela">
        <DataTable
          subHeader
          subHeaderAlign="left"
          subHeaderComponent={SubHeaderComponent()}
          progressPending={loading}
          progressComponent={<Loading />}
          data={data}
          columns={columns}
          striped
          pagination
          actions={
            <ButtonEstatistica onClick={() => history.push("/estatisticas")} />
          }
          clearSelectedRows={toggledClearRows}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          paginationDefaultPage={1}
          paginationPerPage={5}
        />
      </div>
    </>
  );
};

export default Pedidos;
