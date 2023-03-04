import axios from "axios";
import { ERRORS } from "../constants/Error";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const BASIC_AUTH_USER = process.env.REACT_APP_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

export const checkIfUserExist = async (userEmail) => {
  try {
    let res = await axios.post(
      `${SERVER_URL}users/checkUserPresent`,
      { email: userEmail },
      {
        auth: {
          username: BASIC_AUTH_USER,
          password: BASIC_AUTH_PASSWORD,
        },
      }
    );
    console.log(res)

    let response = {
      status: res.status,
      data: res.data.result,
    };
    return response;
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.data.code,
        data: err.response.data.message,
      };
    } else {
      return {  
        status: ERRORS.SERVER_NOT_WORKING,
        data: null,
      };
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    let res = await axios.post(
      `${SERVER_URL}users/login`,
      { email, password },
      {
        auth: {
          username: BASIC_AUTH_USER,
          password: BASIC_AUTH_PASSWORD,
        },
      }
    );
    let response = {
      status: res.status,
      data: res.data.token,
    };
    return response;
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.data.code,
        data: err.response.data.message,
      };
    } else {
      return {
        status: ERRORS.SERVER_NOT_WORKING,
        data: null,
      };
    }
  }
};