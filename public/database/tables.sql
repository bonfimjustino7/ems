
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    login VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    nome  VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,    
    sobrenome  VARCHAR(200),
    cpf  VARCHAR(11) NOT NULL,
    telefone  VARCHAR(16),
    tipoconta BOOLEAN DEFAULT 0,
    gerente INT,
    UNIQUE(cpf, email),
    table_name VARCHAR(200)
);

ALTER TABLE usuario ADD FOREIGN KEY(gerente) REFERENCES usuario(id);

CREATE TABLE IF NOT EXISTS codigos_recuperacao (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usuario_id INT NOT NULL,
    code VARCHAR(7) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(200) DEFAULT 'VALID',
    table_name VARCHAR(200),
    UNIQUE(code),

    CONSTRAINT FK_usuario_code FOREIGN KEY(usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS produto (    
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    imagem VARCHAR(200),
    nome VARCHAR(200) NOT NULL,
    marca VARCHAR(200),
    preco FLOAT NOT NULL,
    codigo_barras VARCHAR(200) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    tamanho FLOAT,
    descricao VARCHAR(200),
    usuario INT, 
    tipo VARCHAR(200) NOT NULL,
    table_name VARCHAR(200),
    CONSTRAINT FK_usuario FOREIGN KEY(usuario) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS pedido (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantidade INT NOT NULL DEFAULT 0,
    total FLOAT DEFAULT 0.0,
    status VARCHAR(200) DEFAULT 'IN PROGRESS',
    CONSTRAINT FK_usuario_pedido FOREIGN KEY(usuario_id) REFERENCES usuario(id),
    CONSTRAINT FK_produto FOREIGN KEY(produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    table_name VARCHAR(200)
);