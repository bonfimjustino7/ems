import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

const Routers = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/home" component={Home} />
    </Switch>
  );
};

export default Routers;
