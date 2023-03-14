import React, { useEffect, useState } from "react";
import "../css/Rate.css";
import '../css/RatingComponentAndSubmitRating.css'
import logo from "../assets/logoTransparent.png";
import loginFooterImage from "../assets/loginFooterImage.svg";
import RatingComponent from "./RatingComponent";
import SubmitRating from "./SubmitRating";
import { RATING_PARAMETERS } from "../constants/RatingParameters";

const Rate = (props) => {
  const [domain, setDomain] = useState();
  const [url, setUrl] = useState();
  const [currentRatingState, setCurrentRatingState] = useState(0);
  const [rating, setRating] = useState(
    new Array(RATING_PARAMETERS.length).fill(0)
  );
  const [componentSeen, setComponentSeen] = useState(
    new Array(RATING_PARAMETERS.length + 1).fill(false)
  )

  const updateRating = (index, newRating) => {
    let oldRating = [...rating];
    oldRating[index] = newRating;
    setRating(oldRating);
    if(currentRatingState!= RATING_STATES.length && !componentSeen[currentRatingState+1]){
      setTimeout(() => {
        moveToNextState()
      }, 700);
    }
  };

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        let url = new URL(tabs[0].url);
        let domain = url.hostname;
        domain = domain.replace("www.", "");
        setUrl(tabs[0].url);
        setDomain(domain);
      });
  }, []);

  useEffect(() => {
    let oldStack = [...componentSeen]
    oldStack[currentRatingState] = true;
    setComponentSeen(oldStack)
  }, [currentRatingState])

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
    <SubmitRating ratings={rating} />,
  ];

  const moveToPreviousState = () => {
    if(document.getElementById('ratingComponent')){
      document.getElementById('ratingComponent').className = 'animate__animated animate__slideInLeft'
      setTimeout(() => {
        document.getElementById('ratingComponent').className = ''
      }, 500)
    }
    setCurrentRatingState(currentRatingState - 1);
  };

  const moveToNextState = () => {
    setCurrentRatingState(currentRatingState + 1);
    if(currentRatingState == RATING_STATES.length - 1){
      if(document.getElementById('submitRating')){
        document.getElementById('submitRating').className = 'animate__animated animate__slideInRight'
        setTimeout(() => {
          document.getElementById('submitRating').className = ''
        }, 500)
      }
    } else {
      if(document.getElementById('ratingComponent')){
        document.getElementById('ratingComponent').className = 'animate__animated animate__slideInRight'
        setTimeout(() => {
          document.getElementById('ratingComponent').className = ''
        }, 500)
      }
    }
  };

  return (
    <div id="rate">
      <nav>
        <div id="nav-head">
          <div>
            <img src={logo} alt="RateItUp Logo"></img>
            <span>
              Rate
              <br />
              It Up
            </span>
          </div>
        </div>
        <button>
          <i className="fa fa-user-circle"></i>
        </button>
      </nav>
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
              (currentRatingState < RATING_PARAMETERS.length && rating[currentRatingState] != 0)
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
      <img id="footerImg" src={loginFooterImage} alt="Footer"></img>
    </div>
  );
};

export default Rate;
