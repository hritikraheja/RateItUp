import React, { useState } from "react";
import "../css/UpdateRating.css";
import {
  RATING_PARAMETERS,
  ASK_FOR_COMMENT_PLACEHOLDER,
} from "../constants/RatingParameters";
import { updateRating } from "../services/RatingsService";
import { RESPONSE_CODES } from "../constants/ResponseCodes";

const UpdateRating = (props) => {
  const { ratings, review, updateRatings, updateReview, domain, url, createErrorNotification, createSuccessNotification, showSuccessMessage } = props;
  const [ratingsVisible, setRatingsVisible] = useState(false);

  const onUpdate = async() => {
    let updates = {
      ratings, review, url
    }
    let response = await updateRating(
      localStorage.getItem(process.env.REACT_APP_LOGIN_TOKEN_KEY),
      domain,
      updates
    );
    if(response.status == RESPONSE_CODES.RESPONSE_OK){
      showSuccessMessage('Thanks for the update!')
      createSuccessNotification('Update Successfull!')
    } else if(response.status == RESPONSE_CODES.DATABASE_ERROR){
      createErrorNotification('Database Error!');
    } else {
      createErrorNotification('Server Not Working!');
    }
  };

  return (
    <div id="updateRating">
      <div></div>
      <p id="head">
        Changed your mind?
        <br />
        <span>Update your ratings!</span>
      </p>
      {domain && (
        <div id="domainDiv" className="animate__animated animate__slideInLeft">
          <img
            alt="favicon"
            height="20"
            width="20"
            src={"https://www.google.com/s2/favicons?domain=" + domain}
          />
          <p>{domain}</p>
        </div>
      )}

      <div
        id="ratingsAndReview"
        style={{
          transform: ratingsVisible ? "scaleY(1)" : "scaleY(0)",
          height: ratingsVisible ? "auto" : "0px",
        }}
      >
        <div id="ratings">
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
                          updateRatings(index, i + 1);
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
                          updateRatings(index, rating + i + 1);
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
        </div>
        <textarea
          id="reviewBox"
          onChange={(e) => updateReview(e.target.value)}
          placeholder={ASK_FOR_COMMENT_PLACEHOLDER}
          value={review}
        ></textarea>
      </div>
      {!ratingsVisible &&<p id="subHead">You have already rated this domain.</p>}
      <button
        id="updateBtn"
        onClick={ratingsVisible ? onUpdate : () => setRatingsVisible(true)}
      >
        Update
      </button>
    </div>
  );
};

export default UpdateRating;
