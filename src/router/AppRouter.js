import React from "react";
import { AuthCallback } from "../pages/AuthCallback";
import { createBrowserHistory } from "history";
import { Loading } from "../pages/Loading";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { Router, Route, Switch } from "react-router-dom";
import { SignIn } from "../pages/SignIn";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export const customHistory = createBrowserHistory();

export const AppRouter = () => {
  return (
    <Router history={customHistory}>
      <Switch>
        <PublicRoute exact path="/"><SignIn/></PublicRoute>
        <Route path="/loading" component={Loading} />
        <Route path="/auth-callback" component={AuthCallback} />
        <PrivateRoute path="/home" ><Home/></PrivateRoute>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};
