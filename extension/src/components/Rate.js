import React, { useEffect, useState } from "react";
import "../css/Rate.css";
import "../css/RatingComponentAndSubmitRating.css";
import RatingComponent from "./RatingComponent";
import SubmitRating from "./SubmitRating";
import { RATING_PARAMETERS } from "../constants/RatingParameters";

const Rate = (props) => {
  const { domain, url } = props;
  const [currentRatingState, setCurrentRatingState] = useState(0);
  const [rating, setRating] = useState(
    new Array(RATING_PARAMETERS.length).fill(0)
  );
  const [componentSeen, setComponentSeen] = useState(
    new Array(RATING_PARAMETERS.length + 1).fill(false)
  );

  const updateRating = (index, newRating) => {
    let oldRating = [...rating];
    oldRating[index] = newRating;
    setRating(oldRating);
    if (
      currentRatingState < RATING_PARAMETERS.length &&
      !componentSeen[currentRatingState + 1]
    ) {
      setTimeout(() => {
        moveToNextState();
      }, 700);
    }
  };

  useEffect(() => {
    let oldStack = [...componentSeen];
    oldStack[currentRatingState] = true;
    setComponentSeen(oldStack);
  }, [currentRatingState]);

  const getStateComponent = () => {
    return RATING_STATES[currentRatingState];
  };

  const RATING_STATES = [
    ...RATING_PARAMETERS.map((ratingParameter, index) => {
      return (
        <RatingComponent
          title={ratingParameter}
          index={index}
          updateRating={updateRating}
          rating={rating[index]}
        />
      );
    }),
    <SubmitRating
      ratings={rating}
      domain={domain}
      url={url}
      updateRating={updateRating}
      showSuccessMessage={props.showSuccessMessage}
      createErrorNotification={props.createErrorNotification}
      createSuccessNotification={props.createSuccessNotification}
    />,
  ];

  const moveToPreviousState = () => {
    if (document.getElementById("ratingComponent")) {
      document.getElementById("ratingComponent").className =
        "animate__animated animate__slideInLeft";
      setTimeout(() => {
        document.getElementById("ratingComponent").className = "";
      }, 500);
    }
    setCurrentRatingState(currentRatingState - 1);
  };

  const moveToNextState = () => {
    setCurrentRatingState(currentRatingState + 1);
    if (currentRatingState == RATING_STATES.length - 1) {
      if (document.getElementById("submitRating")) {
        document.getElementById("submitRating").className =
          "animate__animated animate__slideInRight";
        setTimeout(() => {
          document.getElementById("submitRating").className = "";
        }, 500);
      }
    } else {
      if (document.getElementById("ratingComponent")) {
        document.getElementById("ratingComponent").className =
          "animate__animated animate__slideInRight";
        setTimeout(() => {
          document.getElementById("ratingComponent").className = "";
        }, 500);
      }
    }
  };

  return (
    <div id="rate">
      <p id="head">
        Share your experience
        <br />
        <span>Leave your ratings and review!</span>
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
      <div id="mainDiv">
        <button
          id="arrowBtn"
          onClick={moveToPreviousState}
          style={{ visibility: currentRatingState > 0 ? "visible" : "hidden" }}
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        {getStateComponent()}
        <button
          id="arrowBtn"
          onClick={moveToNextState}
          style={{
            visibility:
              currentRatingState < RATING_PARAMETERS.length &&
              rating[currentRatingState] != 0
                ? "visible"
                : "hidden",
          }}
        >
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
      {/* <button
        onClick={() => {
          localStorage.setItem(process.env.REACT_APP_LOGIN_TOKEN_KEY, null);
          window.location.reload(false);
        }}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Rate;
