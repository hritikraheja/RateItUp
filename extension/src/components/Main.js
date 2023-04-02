import React, { useEffect, useState } from "react";
import logo from "../assets/logoTransparent.png";
import "../css/Main.css";
import ReactLoading from "react-loading";
import loginFooterImage from "../assets/loginFooterImage.svg";
import Rate from "./Rate";
import { getMyRatingByDomain } from "../services/RatingsService";
import UpdateRating from "./UpdateRating";
import { RESPONSE_CODES } from "../constants/ResponseCodes";
import SuccessMessage from "./SuccessMessage";

const Main = (props) => {
  const [domain, setDomain] = useState("chat.openai.com");
  const [url, setUrl] = useState(
    "https://www.google.com/search?q=what+is+a+web+extension&oq=what+is+a+web+extension&aqs=chrome..69i57j0i22i30i625j0i22i30l2j0i22i30i625l3j0i22i30j0i22i30i625l2.6158j0j15&sourceid=chrome&ie=UTF-8"
  );
  const [isAlreadyRated, setAlreadyRated] = useState(false);
  const [ratings, setRatings] = useState(null);
  const [review, setReview] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Ratings Submitted!");
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  // useEffect(() => {
  //   const queryInfo = { active: true, lastFocusedWindow: true };
  //   chrome.tabs &&
  //     chrome.tabs.query(queryInfo, async (tabs) => {
  //       let url = new URL(tabs[0].url);
  //       let domain = url.hostname;
  //       domain = domain.replace("www.", "");
  //       setUrl(tabs[0].url);
  //       setDomain(domain);
  //     });
  // }, []);

  useEffect(() => {
    if (domain) {
      getMyRatingByDomain(props.loginCredentials, domain)
        .then((res) => {
          if (res.status == RESPONSE_CODES.RESPONSE_OK && res.data) {
            setRatings(res.data.ratings);
            setReview(res.data.review);
            setAlreadyRated(true);
          } else if (res.status == RESPONSE_CODES.UNAUTHORISED) {
            props.createErrorNotification("Login session expired!");
            window.location.reload(false);
          }
          setLoaded(true);
        })
        .catch((err) => {
          console.log(err);
          props.createErrorNotification("Server not working!");
          setLoaded(true);
        });
    }
  }, [domain]);

  const updateRatings = (index, newRating) => {
    let oldRatings = [...ratings];
    oldRatings[index] = newRating;
    setRatings(oldRatings);
  };

  const updateReview = (newReview) => {
    setReview(newReview);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setSuccessMessageVisible(true);
  };

  return (
    <div id="main">
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
        <div id="userIconContainer">
          <button>
            <i className="fa fa-user-circle"></i>
          </button>
          <span></span>
          {/* <i className="fa fa-certificate"></i> */}
        </div>
      </nav>
      {!loaded ? (
        <div id="loader">
          <ReactLoading type="spinningBubbles" color="#8bd8bd"></ReactLoading>
        </div>
      ) : successMessageVisible ? (
        <SuccessMessage message={successMessage}></SuccessMessage>
      ) : isAlreadyRated ? (
        <UpdateRating
          ratings={ratings}
          review={review}
          updateRatings={updateRatings}
          updateReview={updateReview}
          domain={domain}
          url={url}
          createErrorNotification={props.createErrorNotification}
          createSuccessNotification={props.createSuccessNotification}
          showSuccessMessage={showSuccessMessage}
        ></UpdateRating>
      ) : (
        <Rate
          domain={domain}
          url={url}
          showSuccessMessage={showSuccessMessage}
          createErrorNotification={props.createErrorNotification}
          createSuccessNotification={props.createSuccessNotification}
        ></Rate>
      )}
      <img id="footerImg" src={loginFooterImage} alt="Footer"></img>
    </div>
  );
};

export default Main;
