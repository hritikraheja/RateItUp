import React, { useState } from "react";
import logo from "../assets/logoTransparent.png";
import loginFooterImage from "../assets/loginFooterImage.svg";
import '../css/SignUp.css'

const SignUp = (props) => {

    const [isNameInvalid, setNameInvalid] = useState(false)
    const [isPasswordValid, setPasswordValid] = useState('')
    const [isRePasswordDifferent, setRePasswordDifferent] = useState(false)
    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const [isRePasswordVisible, setRePasswordVisible] = useState(false)

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
          outline: isNameInvalid ? "1.5px solid #ed4337" : "none",
        }}
      ></input>
      {isNameInvalid && (
        <span className="warningMessage">*Enter a valid name</span>
      )}
      <div>
        <div
          id="passwordInput"
          style={{
            outline: isPasswordValid !='' ? "1.5px solid #ed4337" : "none",
          }}
        >
          <input
            placeholder="Password"
            type={isPasswordVisible ? "text" : "password"}
          ></input>
          <i
            className={
              isPasswordVisible ? "fa fa-eye-slash" : "fa fa-eye"
            }
            onClick={() => {
              setPasswordVisible(!isPasswordVisible);
            }}
          ></i>
        </div>
        {isPasswordValid!= '' && (
          <span className="warningMessage">*{isPasswordValid}</span>
        )}
      </div>
      <div>
        <div
          id="passwordInput"
          style={{
            outline: isRePasswordDifferent !='' ? "1.5px solid #ed4337" : "none",
          }}
        >
          <input
            placeholder="Re-enter Password"
            type={isRePasswordVisible ? "text" : "password"}
          ></input>
          <i
            className={
              isRePasswordVisible ? "fa fa-eye-slash" : "fa fa-eye"
            }
            onClick={() => {
              setRePasswordVisible(!isRePasswordVisible);
            }}
          ></i>
        </div>
        {isPasswordValid!= '' && (
          <span className="warningMessage">*{isPasswordValid}</span>
        )}
      </div>
      <button id="signupButton">Sign Up</button>
      <img id="footerImg" src={loginFooterImage}></img>
      <button id="backButton" onClick={() => {props.goBackToLogin(props.email)}}><i className="fa fa-arrow-left"></i></button>
    </div>
  );
};

export default SignUp;