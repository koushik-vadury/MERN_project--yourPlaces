import React, { useCallback, useState } from "react";
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
      <Router>
        <MainNavigation />
        <main>
          {isLoggedIn ? (
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
