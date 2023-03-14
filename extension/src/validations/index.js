import { REGEX } from "./RegExs";

export const validateNewPassword = (password) => {
  let isInvalid = false;
  let passwordInvalidMsg = "";
  if (!password.match(REGEX.LOWER_CASE_LETTERS)) {
    passwordInvalidMsg = "*Password must contain a lowercase character.";
    isInvalid = true;
  }

  if (!password.match(REGEX.UPPER_CASE_LETTERS)) {
    passwordInvalidMsg = "*Password must contain an uppercase character.";
    isInvalid = true;
  }

  if (!password.match(REGEX.NUMBERS)) {
    passwordInvalidMsg = "*Password must contain a number.";
    isInvalid = true;
  }

  if (password.length < 8) {
    passwordInvalidMsg = "*Password must be greater than 8 characters.";
    isInvalid = true;
  }
  return {
    isInvalid: isInvalid,
    message: passwordInvalidMsg,
  };
};

export const checkEmailValidity = (email) => {    
  return email != "" && REGEX.EMAIL_VALIDATION_REGEX.test(email);
};
