import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import 'animate.css'
import Login from "./components/Login";
import "react-notifications/lib/notifications.css";
import 'font-awesome/css/font-awesome.min.css';
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Rate from "./components/Rate";

const App = () => {
  const [loginCredentials, setLoginCredentials] = useState("");

  useEffect(() => {
    setLoginCredentials(
      localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY)
    );
  }, [localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY)]);

  const createSuccessNotification = (message) => {
    NotificationManager.success(message, "", 2000);
  }

  const createErrorNotification = (message) => {
    NotificationManager.error(message, "", 2000);
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
                <Rate></Rate>
              ) : (
                <Login
                  createErrorNotification={createErrorNotification}
                  createSuccessNotification={createSuccessNotification}
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
