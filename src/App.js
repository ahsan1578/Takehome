import React from "react";
import UserList from "./components/UserList.jsx";
import Profile from "./components/Profile.jsx";
import {
  HashRouter,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
import { createBrowserHistory } from "history";
import "./App.scss"

const App = () => {
  const history = createBrowserHistory();
  return (
    <HashRouter history={history}>
        <Switch>
          <Redirect exact path="/" to="/userlist/all"/>
          <Route path="/userlist/:query" component={UserList}/>
          <Route path="/user/:name/:date" component={Profile}/>
          <Redirect path="*" to="/"/>
        </Switch>
    </HashRouter>
  )
};

export default App;
