import axios from "axios";
import { RESPONSE_CODES } from "../constants/ResponseCodes";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const BASIC_AUTH_USER = process.env.REACT_APP_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.REACT_APP_BASIC_AUTH_PASSWORD;
const LOGIN_TOKEN_KEY = process.env.REACT_APP_LOGIN_TOKEN_KEY;

export const getMyRatingByDomain = async (tokenHeader, domain) => {
  try {
    let res = await axios.get(
      `${SERVER_URL}ratings/my/searchByDomain?domain=${domain}`,
      {
        auth: {
          username: BASIC_AUTH_USER,
          password: BASIC_AUTH_PASSWORD,
        },
        headers: {
          [LOGIN_TOKEN_KEY]: tokenHeader,
        },
      }
    );
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
        status: RESPONSE_CODES.SERVER_NOT_WORKING,
        data: null,
      };
    }
  }
};

export const submitRating = async (
  tokenHeader,
  domain,
  url,
  ratings,
  review
) => {
  try {
    let res = await axios.post(
      `${SERVER_URL}ratings/add`,
      { domain, url, ratings, review },
      {
        auth: {
          username: BASIC_AUTH_USER,
          password: BASIC_AUTH_PASSWORD,
        },
        headers: {
          [LOGIN_TOKEN_KEY]: tokenHeader,
        },
      }
    );
    let response = {
      status: res.status,
      data: res.data.message,
    };
    console.log(res)
    return response;
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.data.code,
        data: err.response.data.message,
      };
    } else {
      return {
        status: RESPONSE_CODES.SERVER_NOT_WORKING,
        data: null,
      };
    }
  }
};

export const updateRating = async(tokenHeader, domain, updates) => {
  try {
    let res = await axios.put(
      `${SERVER_URL}ratings/update`,
      { domain : domain,
        ratings : updates.ratings,
        review : updates.review,
        url : updates.url
      },
      {
        auth: {
          username: BASIC_AUTH_USER,
          password: BASIC_AUTH_PASSWORD,
        },
        headers: {
          [LOGIN_TOKEN_KEY]: tokenHeader,
        },
      }
    );
    let response = {
      status: res.status,
      data: res.data.message,
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
        status: RESPONSE_CODES.SERVER_NOT_WORKING,
        data: null,
      };
    }
  }
}