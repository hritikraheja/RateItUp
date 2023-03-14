import { Schema, model, Document, Types } from "mongoose";
import { dateConstants } from "../utils/helpers";
import { DATABASE_NAMES } from "../constants/databaseNames";
import { RATING_PARAMETERS } from "../constants/ratingParameters";
import { DOMAIN_VALIDATION_REGEX } from "../constants/constants";

export interface IRatingModel extends Document {
  user: Types.ObjectId;
  domain: String;
  url : String;
  ratings: [Number];
  comment: String;
  createdOn: Number;
  updatedOn: Number;
}

export const RatingSchema: any = new Schema({
  user: { type: Types.ObjectId, required: true },
  domain: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return DOMAIN_VALIDATION_REGEX.test(value);
      },
      message: "Invalid domain name format",
    },
  },
  url : {
    type : String,
    required: true
  },
  ratings: {
    type: [Number],
    required: true,
    validate: {
      validator: (ratingsArray: [number]) => {
        return ratingsArray.length == RATING_PARAMETERS.length;
      },
      message: "Invalid number of parameters",
    },
  },
  comment: { type: String, required: false },
  createdOn: { type: Number, default: dateConstants.currentTimeStamp() },
  updatedOn: { type: Number, default: dateConstants.currentTimeStamp() },
});

// RatingSchema.index({user : 1, domain : 1}, {unique : true})

export const Ratings = model<IRatingModel>(
  DATABASE_NAMES.RATINGS,
  RatingSchema
);
