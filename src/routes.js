import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Carrinho from "./pages/Carrinho";
import Gerente from "./pages/Gerente";
import Produtos from "./pages/Produtos";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";

const Routers = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/gerente" exact component={Gerente} />
      <Route path="/home" component={Home} />
      <Route path="/carrinho" component={Carrinho} />
      <Route path="/produtos" exact component={Produtos} />
      <Route path="/produtos/novo" component={Cadastro} />
      <Route path="/recuperar-senha" component={RecuperarSenha} />
    </Switch>
  );
};

export default Routers;
