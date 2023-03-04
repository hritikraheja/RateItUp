import React, { useEffect, useState } from "react";
import "../css/Login.css";
import logo from "../assets/logoTransparent.png";
import loginFooterImage from "../assets/loginFooterImage.svg";
import { checkIfUserExist, loginUser } from "../services/UserService";
import Signup from './SignUp'
import 'animate.css'

const COMPONENT_STATES = {
  BASIC_LOGIN: 0,
  LOGIN_WITH_PASSWORD: 1,
  SIGN_UP_NEW_USER: 2,
};

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [isPasswordIncorrect, setPasswordIncorrect] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [componentState, setComponentState] = useState(
    COMPONENT_STATES.BASIC_LOGIN
  );

  const emailInputOnChange = (e) => {
    setEmail(e.target.value);
    if (isEmailInvalid) {
      setEmailInvalid(false);
    }
    if(componentState != COMPONENT_STATES.BASIC_LOGIN){
      setComponentState(COMPONENT_STATES.BASIC_LOGIN)
    }
  };

  const passwordInputOnChange = (e) => {
    setPassword(e.target.value);
    if(isPasswordIncorrect){
      setPasswordIncorrect(false)
    }
  };

  const checkEmailValidity = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email!='' && regex.test(email);
  };

  const continueButtonOnClick = async () => {
    if (!checkEmailValidity()) {
      setEmailInvalid(true);
    } else {
      setEmailInvalid(false);
      let response = await checkIfUserExist(email);
      if (response.status == "200") {
        let doUserExist = response.data;
        if (doUserExist) {
          setComponentState(COMPONENT_STATES.LOGIN_WITH_PASSWORD);
        } else {
          setComponentState(COMPONENT_STATES.SIGN_UP_NEW_USER);
        }
      } else {
        props.createErrorNotification('Server Error!')
      }
    }
  };

  const loginButtonOnClick = async () => {
    if(!password){
      return;
    }
    let response = await loginUser(email, password);
    if(response.status == '200'){
      let loginToken = response.data
      localStorage.setItem(process.env.REACT_APP_LOGIN_TOKEN_KEY, loginToken)
      window.location.reload(false)
    } else if(response.status == '401') {
      setPasswordIncorrect(true)
    } else {
      props.createErrorNotification('Server Error!')
    }
  };

  const goBackToLogin = (email) => {
    setEmail(email)
    setComponentState(COMPONENT_STATES.BASIC_LOGIN)
  }

  return (
    <div>
      {(componentState == COMPONENT_STATES.BASIC_LOGIN ||
        componentState == COMPONENT_STATES.LOGIN_WITH_PASSWORD) && (
        <div id="login">
          <div id="header">
            <div>
              <img src={logo}></img>
              <span>
                Rate
                <br />
                It Up
              </span>
            </div>
            <span id="phrase">
              World's First Website<br></br>Rating Platform
            </span>
          </div>
          <div id="welcomeNote">
            <span id="head">Welcome</span>
            <span id="subhead">
              Time to discover and rate the best web applications on the
              internet.
            </span>
          </div>
          <input
            id="emailInput"
            placeholder="Enter your Email Address"
            value={email}
            onChange={emailInputOnChange}
            style={{
              outline: isEmailInvalid ? "1.5px solid #ed4337" : "none",
            }}
          ></input>
          {isEmailInvalid && (
            <span className="warningMessage">*Enter a valid email</span>
          )}
          {componentState == COMPONENT_STATES.LOGIN_WITH_PASSWORD && (
            <div>
              <div id="passwordInput" style={{
                    outline: isPasswordIncorrect
                      ? "1.5px solid #ed4337"
                      : "none",
                  }} className="animate__animated animate__fadeInDown">
                <input
                  placeholder="Password"
                  onChange={passwordInputOnChange}
                  type={isPasswordVisible ? "text" : "password"}
                ></input>
                <i
                  className={
                    isPasswordVisible
                      ? "fa fa-solid fa-eye-slash"
                      : "fa fa-solid fa-eye"
                  }
                  onClick={() => {
                    setPasswordVisible(!isPasswordVisible);
                  }}
                />
              </div>
              {isPasswordIncorrect && (
                <span className="warningMessage">*Incorrect Password</span>
              )}
            </div>
          )}
          {componentState == COMPONENT_STATES.BASIC_LOGIN && (
            <button id="continueButton" onClick={continueButtonOnClick}>
              Continue
            </button>
          )}

          {componentState == COMPONENT_STATES.LOGIN_WITH_PASSWORD && (
            <button id="loginButton" onClick={loginButtonOnClick}>
              Login
            </button>
          )}
          <img id="footerImg" src={loginFooterImage}></img>
        </div>
      )}
      {componentState == COMPONENT_STATES.SIGN_UP_NEW_USER && (
        <Signup goBackToLogin={goBackToLogin} email={email}></Signup>
      )}
    </div>
  );
};

export default Login;
