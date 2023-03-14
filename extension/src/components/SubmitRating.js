import React, { useState } from "react";
import { ASK_FOR_COMMENT_PLACEHOLDER, RATING_PARAMETERS } from "../constants/RatingParameters";

const SubmitRating = (props) => {
  const { ratings } = props;
  const [review, setReview] = useState("");

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
                  <i id="filled" className="fa fa-star" key={i}></i>
                ))}
              {Array(5 - rating)
                .fill(0)
                .map((v, i) => (
                  <i id="unfilled" className="fa fa-star-o" key={i}></i>
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
      <button id="submitBtn">Submit</button>
    </div>
  );
};

export default SubmitRating;
