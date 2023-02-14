import { IRatingModel, Ratings } from "../models/ratings.model";
import { MongoDao } from "../daoLayer/mongoDao";
import { SUCCESS } from "../constants/succes";
import { ERROR } from "../constants/error";
import { verifyJwtToken } from "../utils/helpers";
require("dotenv").config();

const ratingsDao = new MongoDao<IRatingModel>(Ratings);

export const RatingsController = {
  getAllRatings: async (req: any, res: any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let result = await ratingsDao.findAll({
        user: tokenData.id,
      }, {
        _id : 0,
        domain : 1,
        ratings : 1,
        comment : 1,
        createdOn : 1,
        updatedOn : 1,
      });
      res.status(SUCCESS.GET_200.code).send({ result: result });
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  getMyRatingsByDomain: async (req: any, res: any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let domain = req.query.domain
      let result = await ratingsDao.findAll({
        user: tokenData.id,
        domain: domain,
      }, {
        _id : 0,
        domain : 1,
        ratings : 1,
        comment : 1,
        createdOn : 1,
        updatedOn : 1
      });
      res.status(SUCCESS.GET_200.code).send({ result: result });
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  getAllRatingsByDomain: async (req: any, res: any) => {
    try {
      let domain = req.query.domain
      let result = await ratingsDao.findAll({
        domain: domain
      }, {
        _id : 0,
        user : 1,
        ratings : 1,
        comment : 1,
        createdOn : 1,
        updatedOn : 1
      });
      res.status(SUCCESS.GET_200.code).send({ result: result });
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  addRating: async (req: any, res: any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let newRating = req.body;
      newRating.user = tokenData.id
      await ratingsDao.create(newRating)
      res.status(SUCCESS.POST_201.code).json(SUCCESS.POST_201);
    } catch (err: any) {
      if(err.code == '11000'){
        return res.status(SUCCESS.DOMAIN_ALREADY_RATED.code).send(SUCCESS.DOMAIN_ALREADY_RATED)
      }
      return res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  updateRating : async (req : any, res : any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let reqBody = req.body;
      let updates = {
        ratings : reqBody.ratings,
        comment : reqBody.comment
      }
      await ratingsDao.update({user : tokenData.id, domain : reqBody.domain}, updates)
      res.status(SUCCESS.PUT_200_DATA.code).json(SUCCESS.PUT_200_DATA);
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  deleteRating : async (req : any, res : any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let domain = req.body.domain;
      let deletedRating = await ratingsDao.delete({user : tokenData.id, domain : domain})
      if (deletedRating) {
        res.status(SUCCESS.DELETE_204.code).send(SUCCESS.DELETE_204);
      } else {
        res.status(SUCCESS.NOT_FOUND.code).send("Rating not found!");
      }
    } catch (err:any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  }
};
