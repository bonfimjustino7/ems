import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import "./styles.css";

import { FiSearch } from "react-icons/fi";
import { CgShoppingCart } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { useHistory } from "react-router";
const { ipcRenderer } = window.require("electron");
const path = require("path");

const Home = () => {
  const { contextData } = useAuth();
  const history = useHistory();
  const [categoriasActives, setActiveCategoria] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ipcRenderer.send("maximize-window");
    ipcRenderer.on("produtos-reply", (e, resp) => {
      console.log("Resposta de produtos: ", resp);
      setProdutos(resp);
    });

    return () => ipcRenderer.removeAllListeners("produtos-reply");
  }, []);

  useEffect(() => {
    ipcRenderer.send("produtos", { nome: search, tipo: categoriasActives });
  }, [categoriasActives, search]);

  const onActiveCategoria = (categoria) => {
    if (categoriasActives.includes(categoria)) {
      setActiveCategoria(categoriasActives.filter((cat) => cat !== categoria));
    } else {
      setActiveCategoria([...categoriasActives, categoria]);
    }
  };

  const onChangeText = (query) => {
    setSearch(query);
  };

  const handlerAddCarrinho = (produto_id) => {
    // console.log("Produto: " + produto_id, "Usuario: " + contextData.usuario_id);
    ipcRenderer.send("save-pedido", {
      usuario_id: contextData.usuario_id,
      produto_id: produto_id,
    });
    setProdutos(produtos.filter((p) => p.id !== produto_id));
  };

  return (
    <>
      <header>
        <div id="cabecalho">
          {!contextData.isGerente ? (
            <FaRegUserCircle
              onClick={() => history.push("/gerente")}
              id="icone_user"
              size={60}
              color="#fff"
            />
          ) : (
            <div></div>
          )}

          <span id="titulo">Easy Market System</span>

          <CgShoppingCart
            onClick={() => history.push("/carrinho")}
            id="icone_carrinho"
            size={60}
            color="#fff"
          />
        </div>
        <div id="subtitulo">
          <span id="subSpan">Home - Produtos</span>
        </div>
      </header>
      <div className="container">
        <div id="campo_busca">
          <input
            onChange={(e) => onChangeText(e.target.value)}
            type="text"
            id="txtBusca"
            placeholder="Buscar produtos"
          />
          <button type="button" id="btnLupa">
            <FiSearch size={30} color="#fff" />
          </button>
        </div>
        <div id="menu">
          <button
            className={categoriasActives.includes("limpeza") && "active"}
            onClick={() => onActiveCategoria("limpeza")}
          >
            Limpeza
          </button>
          <button
            className={categoriasActives.includes("higiene") && "active"}
            onClick={() => onActiveCategoria("higiene")}
          >
            Higiene
          </button>
          <button
            className={categoriasActives.includes("frutas") && "active"}
            onClick={() => onActiveCategoria("frutas")}
          >
            Frutas
          </button>
          <button
            className={categoriasActives.includes("secos") && "active"}
            onClick={() => onActiveCategoria("secos")}
          >
            Secos
          </button>
          <button
            className={categoriasActives.includes("frios") && "active"}
            onClick={() => onActiveCategoria("frios")}
          >
            Frios
          </button>
        </div>
        <div id="conteudo">
          {produtos.map((produto, index) => {
            return (
              <div className="produtos" key={produto.id}>
                <span className="nome_produto">{produto.nome}</span>
                <div className="img_produto">
                  <img
                    className="view-image"
                    src={process.env.PUBLIC_URL + `${produto.imagem}`}
                    alt=""
                  ></img>
                </div>

                <div className="detalhes">
                  <span style={{ color: "white" }}>
                    Preço: R$ {produto.preco ? produto.preco.toFixed(2) : 0.0}
                  </span>
                </div>

                <button
                  onClick={() => handlerAddCarrinho(produto.id)}
                  type="button"
                >
                  Add ao carrinho
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
