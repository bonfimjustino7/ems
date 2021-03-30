import React, { useEffect, useState } from "react";
import { CgMathMinus } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";

import "./styles.css";

function Card({ produto, onDelete, onAdiciona, onRemove }) {
  const [quantidade, setQuantidade] = useState(produto.quantidade);

  const handlerAdicionar = () => {
    setQuantidade(quantidade + 1);
    onAdiciona(quantidade + 1);
  };
  const handlerRemover = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
      onRemove(quantidade - 1);
    }
  };

  return (
    <div className="card-carrinho" key={produto}>
      <div className="img"></div>
      <div className="card-carrinho-body">
        <h4>{produto.nome}</h4>
        <a>Deltalhes</a>
        <div className="actions">
          <span>Quantidade</span>
          <CgMathMinus className="botao" onClick={() => handlerRemover()} />
          <div className="quantidade">{quantidade}</div>
          <FiPlus className="botao" onClick={() => handlerAdicionar()} />
        </div>
        <div className="actions">
          <span>Valor</span>
          <input value={produto.valor} readOnly />
        </div>
        <div className="actions">
          <span onClick={onDelete} className="delete">
            Remover
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;