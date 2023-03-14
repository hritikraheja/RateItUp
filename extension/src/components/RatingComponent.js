import React from "react";
import BeautyStars from "beauty-stars";
import {Browser} from 'react-kawaii'
import { MOODS_BY_RATING, COLORS_BY_RATING } from "../constants/RatingMoodsAndColors";

const RatingComponent = (props) => {

  const {title, index, updateRating, rating} = props;

  return (
    <div id="ratingComponent">
      <p id="head">{title}</p>
      <BeautyStars
        value={rating}
        onChange={(newRating) => updateRating(index, newRating)}
        size='28px'
        inactiveColor="gray"
        activeColor="gold"
      ></BeautyStars>
      <div id='emoji'>
        <Browser size={100} mood={MOODS_BY_RATING[rating]} color={COLORS_BY_RATING[rating]} />
      </div>
    </div>
  );
};

export default RatingComponent;
