import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router";

import Input from "../../components/Input";
import "./styles.css";

import { Formik } from "formik";
import * as Yup from "yup";
import { useToasts } from "react-toast-notifications";
const { ipcRenderer } = window.require("electron");

function RecuperarSenha() {
  const history = useHistory();

  const [emailEnviado, setStateEmailEnviado] = useState(false);
  const [emailValidado, setEmailValidado] = useState(false);
  const [usuarioID, setUsuarioID] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const EmailSchema = Yup.object().shape({
    email: Yup.string().required("Required").email("Email inválido"),
  });

  const ConfimacaoSchema = Yup.object().shape({
    code: Yup.number().required("Required"),
  });

  const NovaSenhaSchema = Yup.object().shape({
    senha: Yup.string()
      .required("Required")
      .min(4, "Deve conter 4 caracteres no mínimo"),
    confirmacao: Yup.string()
      .required("Required")
      .min(4, "Deve conter 4 caracteres no mínimo"),
  });

  const message = <p>Senha Alterada com sucesso.</p>;
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
          <span id="subSpan">Recuperar Senha</span>
        </div>
      </header>
      <div className="container-cadastro">
        <div className="container-form">
          <div className="row-info recuperar">
            {emailEnviado ? (
              <Formik
                initialValues={{ code: "", email: "" }}
                validationSchema={ConfimacaoSchema}
                onSubmit={(values, form) => {
                  console.log(values);
                  const res = ipcRenderer.sendSync("verify-code", {
                    code: values.code,
                  });

                  if (!res) {
                    form.setFieldError("code", "Código inválido");
                  } else {
                    setEmailValidado(true);
                    setStateEmailEnviado(false);
                  }
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
                  <form onSubmit={handleSubmit}>
                    <div className="col-fields">
                      <div className="row">
                        <div className="form-field form-email">
                          <Input
                            className={errors.code && "error"}
                            label="Código de Confirmação"
                            name="email"
                            value={values.code}
                            onChange={handleChange("code")}
                          />
                          <label className="error label-error">
                            {errors.code}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="buttons recuperar">
                      <button type="submit" className="button adicionar">
                        Enviar
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            ) : emailValidado ? (
              <Formik
                initialValues={{
                  senha: "",
                  confirmacao: "",
                  email: "",
                  code: "",
                }}
                validationSchema={NovaSenhaSchema}
                validate={(values) => {
                  const errors = {};
                  if (values.senha !== values.confirmacao) {
                    errors.confirmacao = "Senhas não conhecidem";
                  }
                  return errors;
                }}
                onSubmit={(values, form) => {
                  console.log(values);

                  const resposta = ipcRenderer.sendSync("nova-senha", {
                    senha: values.senha,
                    usuarioID: usuarioID,
                  });
                  if (!resposta) {
                    form.setFieldError("senha", "Erro ao atualizar senha");
                  } else {
                    form.setFieldValue("senha", "");
                    history.push("/");
                    addToast(message, {
                      appearance: "success",
                      autoDismiss: true,
                    });
                  }
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
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="col-fields">
                      <>
                        <div className="form-field form-email">
                          <Input
                            className={errors.senha && "error"}
                            label="Nova Senha"
                            type="password"
                            name="senha"
                            value={values.senha}
                            onChange={handleChange("senha")}
                          />
                          <label className="error label-error">
                            {errors.senha}
                          </label>
                        </div>
                        <div className="form-field form-email">
                          <Input
                            className={errors.confirmacao && "error"}
                            label="Confirmação"
                            type="password"
                            name="confirmaao"
                            value={values.confirmacao}
                            onChange={handleChange("confirmacao")}
                          />
                          <label className="error label-error">
                            {errors.confirmacao}
                          </label>
                        </div>
                      </>
                    </div>
                    <div className="buttons recuperar">
                      <button type="submit" className="button adicionar">
                        Enviar
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={EmailSchema}
                onSubmit={(values, form) => {
                  console.log(values);
                  setLoading(true);
                  const resposta = ipcRenderer.sendSync("recuperar-senha", {
                    email: values.email,
                  });
                  if (!resposta) {
                    form.setFieldError("email", "Email inválido");
                  } else {
                    setUsuarioID(resposta);
                    form.setFieldValue("email", "");
                    setStateEmailEnviado(true);
                  }
                  setLoading(false);
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
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="col-fields">
                      <div className="row">
                        <div className="form-field form-email">
                          <Input
                            className={errors.email && "error"}
                            label="Email"
                            name="email"
                            value={values.email}
                            onChange={handleChange("email")}
                          />
                          <label className="error label-error">
                            {errors.email}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="buttons recuperar">
                      <button
                        disabled={errors.email}
                        type="submit"
                        className="button adicionar"
                      >
                        {loading ? "Carregando" : "Enviar"}
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            )}

            <p>
              {emailValidado
                ? "Insira a sua nova senha"
                : emailEnviado
                ? "Insira o código que foi enviado para seu email."
                : "Insira o seu email cadastrado para recuperar a senha."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecuperarSenha;
