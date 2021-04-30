import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router";
import Input from "../../components/Input";
import "./styles.css";
import Select from "../../components/Select";
import { Formik } from "formik";
import * as Yup from "yup";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../../context/auth";

const { ipcRenderer } = window.require("electron");

function NovoUsuario() {
  const history = useHistory();

  const { addToast } = useToasts();
  const { contextData } = useAuth();

  useEffect(() => {
    ipcRenderer.on("save-usuario-reply", (e, res) => {
      if (res) {
        addToast("Usuário salvo com sucesso", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push("/usuarios");
      } else {
        addToast("Erro ao salvar usuário", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    });

    ipcRenderer.on("update-usuario-reply", (e, res) => {
      if (res) {
        addToast("Usuário atualizado com sucesso", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push("/usuarios");
      } else {
        addToast("Erro ao salvar usuário", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    });
    return () => {
      ipcRenderer.removeAllListeners("save-usuario-reply");
      ipcRenderer.removeAllListeners("update-usuario-reply");
    };
  }, []);

  const saveUsuario = (values) => {
    if (contextData.usuario?.id) {
      ipcRenderer.send("update-usuario", {
        ...values,
        id: contextData.usuario.id,
        tipoconta: values.tipoUsuario,
        sobrenome: values.sobreNome,
      });
    } else {
      ipcRenderer.send("save-usuario", {
        ...values,
        tipoconta: values.tipoUsuario,
        sobrenome: values.sobreNome,
      });
    }
  };

  const UsuarioSchema = Yup.object().shape({
    nome: Yup.string().required("Required"),
    email: Yup.string().required("Required").email(),
    sobreNome: Yup.string(),
    login: Yup.string().required("Requered"),
    password: Yup.string().required("Requered").min(4),
    cpf: Yup.string().required("Required"),
    telefone: Yup.string(),
    tipoUsuario: Yup.string()
      .required("Required")
      .test("tipo", "Required", (item) => {
        return item !== "Nenhum";
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
          <span id="subSpan">Usuário</span>
        </div>
      </header>
      <div className="container-cadastro">
        <div className="container-form">
          <Formik
            initialValues={{
              nome: contextData.usuario?.nome ? contextData.usuario?.nome : "",
              sobreNome: contextData.usuario?.sobrenome
                ? contextData.usuario?.sobrenome
                : "",
              login: contextData.usuario?.login
                ? contextData.usuario?.login
                : "",
              password: "",
              email: contextData.usuario?.email
                ? contextData.usuario?.email
                : "",
              cpf: contextData.usuario?.cpf ? contextData.usuario?.cpf : "",
              telefone: contextData.usuario?.telefone
                ? contextData.usuario?.telefone
                : "",
              tipoUsuario: contextData.usuario?.tipoconta
                ? contextData.usuario?.tipoconta
                : "",
            }}
            validationSchema={UsuarioSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveUsuario(values);
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
                  <form className="form-usuario" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-field fill">
                        <Input
                          className={errors.nome && "error"}
                          label="Nome do Usuário"
                          name="nome"
                          value={values.nome}
                          onChange={handleChange("nome")}
                        />
                      </div>{" "}
                      <div className="form-field fill">
                        <Input
                          className={errors.sobreNome && "error"}
                          label="Sobrenome"
                          name="sobreNome"
                          value={values.sobreNome}
                          onChange={handleChange("sobreNome")}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-field fill">
                        <Input
                          className={errors.login && "error"}
                          label="Login"
                          name="login"
                          value={values.login}
                          onChange={handleChange("login")}
                        />
                      </div>
                      <div className="form-field fill">
                        <Input
                          className={errors.password && "error"}
                          label="Password"
                          name="password"
                          type="password"
                          value={values.password}
                          onChange={handleChange("password")}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-field fill">
                        <Input
                          className={errors.email && "error"}
                          label="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange("email")}
                        />
                      </div>
                      <div className="form-field fill">
                        <Input
                          className={errors.telefone && "error"}
                          label="Telefone"
                          name="telefone"
                          mask="(99) 99999-9999"
                          value={values.telefone}
                          onChange={handleChange("telefone")}
                        />
                      </div>
                      <div className="form-field fill">
                        <Input
                          label="CPF"
                          name="cpf"
                          value={values.cpf}
                          mask="99999999999"
                          onChange={handleChange("cpf")}
                          className={errors.cpf && "error"}
                        />
                      </div>

                      <div className="form-field fill ">
                        <Select
                          onSelect={handleChange("tipoUsuario")}
                          label="Tipo"
                          value={values.tipoUsuario}
                          options={[
                            { label: "Cliente", value: "0" },
                            { label: "Gerente", value: "1" },
                          ]}
                          className={errors.tipoUsuario && "error"}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="buttons">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="button adicionar"
                        >
                          {contextData.usuario ? "Editar" : "Salvar"}
                        </button>
                        <button
                          type="button"
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

export default NovoUsuario;
