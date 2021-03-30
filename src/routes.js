import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Carrinho from "./pages/Carrinho";

const Routers = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/carrinho" component={Carrinho} />
    </Switch>
  );
};

export default Routers;
