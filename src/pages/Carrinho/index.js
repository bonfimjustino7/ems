import React, { useEffect, useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";

import { useHistory } from "react-router";

import "./styles.css";
import Card from "../../components/Card";
import { useAuth } from "../../context/auth";
const { ipcRenderer } = window.require("electron");

function Carrinho() {
  const history = useHistory();
  const { contextData } = useAuth();
  const [valorTotal, setValorTotal] = useState(0);
  const [quantidadeProdutos, setQuantidade] = useState(0);

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    ipcRenderer.send("pedidos", { usuario_id: contextData.usuario_id });

    ipcRenderer.on("pedidos-reply", (e, resp) => {
      console.log("Resposta de produtos: ", resp);
      setProdutos(resp);
    });
  }, []);

  const handlerCalcularTotais = () => {
    if (produtos.length) {
      const valTotal = produtos.reduce((acumulado, atual) => ({
        valor: acumulado.valor + atual.valor,
      }));
      setValorTotal(valTotal.valor);
    } else {
      setValorTotal(0);
    }

    setQuantidade(produtos.length);
  };

  useEffect(() => {
    handlerCalcularTotais();
  }, [produtos]);

  const handlerRemove = (produtoRemovido) => {
    setProdutos(
      produtos.filter((produto) => produto.nome !== produtoRemovido.nome)
    );
  };

  const onChange = (produto, quantidade) => {
    let productIndex = produtos.findIndex((pr) => pr.nome === produto.nome);

    const updateProdutos = produtos;
    updateProdutos[productIndex].quantidade = quantidade;
    updateProdutos[productIndex].valor = produto.preco * quantidade;

    setProdutos(updateProdutos);
    handlerCalcularTotais();
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
          <span id="subSpan">Carrinho</span>
        </div>
      </header>
      <div className="container-carrinho">
        <div className="row">
          {produtos.length ? (
            produtos.map((produto) => {
              return (
                <Card
                  produto={produto}
                  onAdiciona={(qtd) => onChange(produto, qtd)}
                  onRemove={(qtd) => onChange(produto, qtd)}
                  onDelete={() => handlerRemove(produto)}
                />
              );
            })
          ) : (
            <div className="aviso">
              <h1>O seu carrinho de compras está vazio.</h1>
            </div>
          )}
        </div>
        <div className="quadro">
          <div className="body">
            <div className="header">
              <GiShoppingCart
                size={120}
                color="rgba(, valor: 10.0 63, 74, 0.67)"
              />
            </div>
            <div className="field">
              <label>Valor Total:</label>
              <input value={valorTotal} readOnly />
            </div>
            <div className="field">
              <label>Total Produtos:</label>
              <input value={quantidadeProdutos} readOnly />
            </div>
            <div className="field">
              <button>Finalizar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Carrinho;
