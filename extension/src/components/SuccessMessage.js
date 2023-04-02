import React from "react";
import "../css/SuccessMessage.css";
import successGif from "../assets/successGif.json";
import { Player } from "@lottiefiles/react-lottie-player";

const SuccessMessage = (props) => {
  const { message } = props;
  return (
    <div id="successMessage">
      <div id="gif">
        <Player
          autoplay
          loop
          src={successGif}
          style={{ height: "180px", width: "180px" }}
        >
        </Player>
      </div>
      <p>{message}</p>
      <button
        onClick={() => {
          window.location.reload(false);
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default SuccessMessage;
