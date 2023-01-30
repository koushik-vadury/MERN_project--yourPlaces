import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";
import "./index.css";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpDate, setTokenExpDate] = useState();

  const login = useCallback((uid, token, expireDate) => {
    setToken(token);
    setUserId(uid);
    const expirationDate =
      expireDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(expirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expirationDate.toISOString(),
      })
    );
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, login, logout, userId, token: token }}
    >
      <Router>
        <MainNavigation />
        <main>
          {token ? (
            <Switch>
              <Route path="/" exact>
                <Users />
              </Route>
              <Route path="/:userId/places" exact>
                <UserPlaces />
              </Route>
              <Route path="/places/new" exact>
                <NewPlace />
              </Route>
              <Route path="/places/:placeId" exact>
                <UpdatePlace />
              </Route>
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route path="/" exact>
                <Users />
              </Route>
              <Route path="/:userId/places" exact>
                <UserPlaces />
              </Route>
              <Route path="/auth" exact>
                <Auth />
              </Route>
              <Redirect to="/auth" />
            </Switch>
          )}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
