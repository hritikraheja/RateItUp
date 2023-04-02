import React, { useState } from "react";
import {
  ASK_FOR_COMMENT_PLACEHOLDER,
  RATING_PARAMETERS,
} from "../constants/RatingParameters";
import { submitRating } from "../services/RatingsService";
import { RESPONSE_CODES } from "../constants/ResponseCodes";

const SubmitRating = (props) => {
  const { ratings, domain, url, updateRating, createErrorNotification, createSuccessNotification, showSuccessMessage } = props;
  const [review, setReview] = useState("");

  const onSubmit = async () => {
    let response = await submitRating(
      localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY),
      domain,
      url,
      ratings,
      review
    );
    if(response.status == RESPONSE_CODES.RESPONSE_CREATED){
      showSuccessMessage('Thanks for your views!')
      createSuccessNotification('Ratings submitted!')
    } else if(response.status == RESPONSE_CODES.DATABASE_ERROR){
      createErrorNotification('Database Error!');
    } else {
      createErrorNotification('Server Not Working!');
    }
  };

  return (
    <div id="submitRating" className="ratingComponent">
      {ratings.map((rating, index) => {
        return (
          <div id="rating" key={index}>
            <p>{RATING_PARAMETERS[index]}</p>
            <div id="stars">
              {Array(rating)
                .fill(0)
                .map((v, i) => (
                  <i
                    onClick={() => {
                      updateRating(index, i + 1);
                    }}
                    id="filled"
                    className="fa fa-star"
                    key={i}
                  ></i>
                ))}
              {Array(5 - rating)
                .fill(0)
                .map((v, i) => (
                  <i
                    onClick={() => {
                      updateRating(index, rating + i + 1);
                    }}
                    id="unfilled"
                    className="fa fa-star-o"
                    key={i}
                  ></i>
                ))}
            </div>
          </div>
        );
      })}
      <textarea
        id="reviewBox"
        onChange={(e) => setReview(e.target.value)}
        placeholder={ASK_FOR_COMMENT_PLACEHOLDER}
      ></textarea>
      <button id="submitBtn" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default SubmitRating;
