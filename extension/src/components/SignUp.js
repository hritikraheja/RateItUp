import React, { useState } from "react";
import logo from "../assets/logoTransparent.png";
import loginFooterImage from "../assets/loginFooterImage.svg";
import "../css/SignUp.css";
import { validateNewPassword } from "../validations";
import { createUser } from "../services/UserService";
import { RESPONSE_CODES } from "../constants/ResponseCodes";

const SignUp = (props) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isNameEmpty, setNameEmpty] = useState(false);
  const [passwordInvalidMsg, setPasswordInvalidMsg] = useState("");
  const [isRePasswordDifferent, setRePasswordDifferent] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRePasswordVisible, setRePasswordVisible] = useState(false);

  const signUpButtonOnSubmit = async () => {
    let hasError = false;
    if (name == "") {
      setNameEmpty(true);
      hasError = true;
    } else {
      setNameEmpty(false);
    }

    let validation = validateNewPassword(password);
    if (validation.isInvalid) {
      setPasswordInvalidMsg(validation.message);
      hasError = true;
    } else {
      setPasswordInvalidMsg("");
    }

    if (password != rePassword) {
      if (!validation.isInvalid) {
        setRePasswordDifferent(true);
      } else {
        setRePasswordDifferent(false);
      }
      hasError = true;
    } else {
      setRePasswordDifferent(false);
    }

    if (hasError) {
      return;
    } else {
      let response = await createUser(props.email, name, password);
      if (response.status == RESPONSE_CODES.RESPONSE_CREATED) {
        props.createSuccessNotification("User created successfully!")
        setTimeout(() => {
            props.goBackToLogin(props.email);
        }, 1500)
      } else if (response.status == RESPONSE_CODES.RESPONSE_ALREADY_EXIST) {
        props.createErrorNotification("Email already exist.");
      } else {
        props.createErrorNotification("Server Error!");
      }
    }
  };

  function setValue(setterMethod, value) {
    setterMethod(value);
  }

  return (
    <div id="signup">
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
      <span id="head">Create your account</span>
      <input
        id="nameInput"
        placeholder="Enter your name"
        style={{
          outline: isNameEmpty ? "1.5px solid #ed4337" : "none",
        }}
        type="text"
        onChange={(e) => {
          setValue(setName, e.target.value);
        }}
      ></input>
      {isNameEmpty && (
        <span className="warningMessage">*Name cannot be empty</span>
      )}
      <div>
        <div
          id="passwordInput"
          style={{
            outline: passwordInvalidMsg != "" ? "1.5px solid #ed4337" : "none",
          }}
        >
          <input
            placeholder="Password"
            type={isPasswordVisible ? "text" : "password"}
            onChange={(e) => {
              setValue(setPassword, e.target.value);
            }}
          ></input>
          <i
            className={isPasswordVisible ? "fa fa-eye-slash" : "fa fa-eye"}
            onClick={() => {
              setPasswordVisible(!isPasswordVisible);
            }}
          ></i>
        </div>
        {passwordInvalidMsg != "" && (
          <span className="warningMessage">{passwordInvalidMsg}</span>
        )}
      </div>
      <div>
        <div
          id="passwordInput"
          style={{
            outline:
              isRePasswordDifferent != "" ? "1.5px solid #ed4337" : "none",
          }}
        >
          <input
            placeholder="Re-enter Password"
            type={isRePasswordVisible ? "text" : "password"}
            onChange={(e) => {
              setValue(setRePassword, e.target.value);
            }}
          ></input>
          <i
            className={isRePasswordVisible ? "fa fa-eye-slash" : "fa fa-eye"}
            onClick={() => {
              setRePasswordVisible(!isRePasswordVisible);
            }}
          ></i>
        </div>
        {isRePasswordDifferent != "" && (
          <span className="warningMessage">
            *Re-entered password doesn't match.
          </span>
        )}
      </div>
      <button id="signupButton" onClick={signUpButtonOnSubmit}>
        Sign Up
      </button>
      <img id="footerImg" src={loginFooterImage}></img>
      <button
        id="backButton"
        onClick={() => {
          props.goBackToLogin(props.email);
        }}
      >
        <i className="fa fa-arrow-left"></i>
      </button>
    </div>
  );
};

export default SignUp;
