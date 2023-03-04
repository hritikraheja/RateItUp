import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import "react-notifications/lib/notifications.css";
import 'font-awesome/css/font-awesome.min.css';
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const App = () => {
  const [loginCredentials, setLoginCredentials] = useState("");

  useEffect(() => {
    setLoginCredentials(
      localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY)
    );
  }, [localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY)]);

  const createErrorNotification = (message) => {
    NotificationManager.error(message);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              loginCredentials != 'null' ? (
                <div>
                  <h1>Login Successfull</h1>
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        process.env.REACT_APP_LOGIN_TOKEN_KEY,
                        null
                      );
                      window.location.reload(false)
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Login
                  createErrorNotification={createErrorNotification}
                ></Login>
              )
            }
          ></Route>
        </Routes>
      </Router>
      <NotificationContainer />
    </div>
  );
};

export default App;
