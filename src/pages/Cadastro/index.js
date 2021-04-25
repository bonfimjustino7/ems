import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router";
import { FiUpload } from "react-icons/fi";
import Input from "../../components/Input";
import "./styles.css";
import Select from "../../components/Select";
import { Formik } from "formik";
import * as Yup from "yup";
const { ipcRenderer } = window.require("electron");

function Cadastro() {
  const history = useHistory();
  const inputImage = useRef(null);
  const [imageProduct, setImageProduct] = useState(null);

  useEffect(() => {
    ipcRenderer.on("produtos-save-reply", (e, resp) => {
      history.push("/produtos");
    });
    return () => ipcRenderer.removeAllListeners("produtos-save-reply");
  }, [history]);

  const imageHandler = (e) => {
    const reader = new FileReader();

    if (e.target?.files?.length) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImageProduct(reader.result);
      } else {
        setImageProduct(null);
      }
    };
  };

  const handlerUpload = () => {
    inputImage.current.click();
    setImageProduct(null);
  };
  const saveProduto = (values) => {
    ipcRenderer.send("save-produto", {
      ...values,
      imageProduct,
    });
  };

  const ProdutoSchema = Yup.object().shape({
    nomeProduto: Yup.string().required("Required"),
    marcaProduto: Yup.string(),
    descricaoProduto: Yup.string(),
    precoProduto: Yup.string().required("Required"),
    quantidadeProduto: Yup.number()
      .min(1, "Deve ser maior que 1")
      .required("Required"),
    codeProduto: Yup.string().required("Required"),
    tipoProduto: Yup.string()
      .required("Required")
      .test("tipo", "Required", (item) => {
        return item !== "0";
      }),
  });
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
          <span id="subSpan">Cadastrar Produto</span>
        </div>
      </header>
      <div className="container-cadastro">
        <div className="container-form">
          <Formik
            initialValues={{
              nomeProduto: "",
              marcaProduto: "",
              precoProduto: "",
              tipoProduto: "",
              quantidadeProduto: 0,
              codeProduto: "",
              descricaoProduto: "",
            }}
            validationSchema={ProdutoSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveProduto(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                <div className="row">
                  <div className="col-img">
                    <div className="quadro-img">
                      {imageProduct && (
                        <img
                          className="view-image"
                          src={imageProduct}
                          alt=""
                        ></img>
                      )}
                    </div>
                    <input
                      ref={inputImage}
                      onChange={imageHandler}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <button className="button importar" onClick={handlerUpload}>
                      <FiUpload style={{ marginRight: 10 }} />
                      <span>Imagem</span>
                    </button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="col-fields">
                      <div className="row">
                        <div className="form-field">
                          <Input
                            className={errors.nomeProduto && "error"}
                            label="Nome do Produto"
                            name="nomeProduto"
                            value={values.nomeProduto}
                            onChange={handleChange("nomeProduto")}
                          />
                        </div>
                        <div className="form-field">
                          <Input
                            className={errors.marcaProduto && "error"}
                            label="Marca"
                            name="marcaProduto"
                            value={values.marcaProduto}
                            onChange={handleChange("marcaProduto")}
                          />
                        </div>
                        <div className="form-field">
                          <Input
                            className={errors.precoProduto && "error"}
                            label="Preço"
                            type="number"
                            name="precoProduto"
                            value={values.precoProduto}
                            onChange={handleChange("precoProduto")}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-field">
                          <Select
                            onSelect={handleChange("tipoProduto")}
                            label="Tipo"
                            value={values.tipoProduto}
                            options={[
                              "Limpeza",
                              "Higiene",
                              "Frutas",
                              "Secos",
                              "Frios",
                            ]}
                            className={errors.tipoProduto && "error"}
                          />
                        </div>
                        <div className="form-field">
                          <Input
                            label="Quantidade"
                            type="number"
                            name="quantidadeProduto"
                            value={values.quantidadeProduto}
                            onChange={handleChange("quantidadeProduto")}
                            className={errors.quantidadeProduto && "error"}
                          />
                        </div>
                        <div className="form-field">
                          <Input
                            label="Cod. de Barras"
                            name="codeProduto"
                            value={values.codeProduto}
                            onChange={handleChange("codeProduto")}
                            className={errors.codeProduto && "error"}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-field">
                          <Input
                            label="Descrição"
                            type="textarea"
                            name="descricaoProduto"
                            value={values.descricaoProduto}
                            onChange={handleChange("descricaoProduto")}
                            className={errors.descricaoProduto && "error"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="buttons">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="button adicionar"
                        >
                          Salvar
                        </button>
                        <button
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
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Cadastro;
