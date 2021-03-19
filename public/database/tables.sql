
-- DROP DATABASE IF EXISTS loja2;

CREATE DATABASE IF NOT EXISTS loja2;
USE loja2;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    email VARCHAR(200) NOT NULL,    
    nome  VARCHAR(200) NOT NULL,
    sobrenome  VARCHAR(200) NOT NULL,
    cpf  VARCHAR(11) NOT NULL,
    telefone  VARCHAR(9) NOT NULL,
    tipoconta BOOLEAN DEFAULT 0,
    gerente INT,
    UNIQUE(cpf)

);

ALTER TABLE usuario ADD FOREIGN KEY(gerente) REFERENCES usuario(id);


CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(200) NOT NULL,
    marca VARCHAR(200),
    preco FLOAT NOT NULL,
    codigo_barras VARCHAR(200) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    tamanho FLOAT,
    descricao VARCHAR(200),
    usuario INT, 
    CONSTRAINT FK_usuario FOREIGN KEY(usuario) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS pedido (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_usuario_pedido FOREIGN KEY(usuario_id) REFERENCES usuario(id),
    CONSTRAINT FK_produto FOREIGN KEY(produto_id) REFERENCES produto(id)
);