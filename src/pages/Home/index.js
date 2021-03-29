import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import "./styles.css";

import { FiSearch } from "react-icons/fi";
import { CgShoppingCart } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
const { ipcRenderer } = window.require("electron");

const Home = () => {
  const { contextData } = useAuth();
  const [categoriasActives, setActiveCategoria] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ipcRenderer.send("maximize-window");

    ipcRenderer.on("produtos-reply", (e, resp) => {
      console.log("Resposta de produtos: ", resp);
      setProdutos(resp);
    });
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
    console.log("Produto: " + produto_id);
  };

  return (
    <>
      <header>
        <div id="cabecalho">
          <FaRegUserCircle id="icone_user" size={60} color="#fff" />

          <span id="titulo">Easy Market System</span>

          <CgShoppingCart
            onClick={() => console.log("Navegar Carrinho")}
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
            placeholder="Buscar produtos (nome, tipo, preço)"
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
              <div className="produtos" key={String(produto.nome + index)}>
                <span className="nome_produto">{produto.nome}</span>
                <div className="img_produto">
                  <img src="" id="prodA" alt="Produto A" />
                </div>

                <div className="detalhes">
                  <a href="#">Detalhes</a>
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
