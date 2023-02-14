import * as express from "express";
import { celebrate, Joi, errors, Segments } from "celebrate";
import { Auth } from "../../middlewares/auth";
import { RatingsController } from "../../controllers/ratings.controller";
import { DOMAIN_VALIDATION_REGEX } from "../../constants/constants";
import { RATING_PARAMETERS } from "../../constants/ratingParameters";

const router = express.Router();

router.get("/my", Auth.BasicAuth, Auth.UserAuth, RatingsController.getAllRatings);

router.get(
  "/my/searchByDomain",
  Auth.BasicAuth,
  Auth.UserAuth,
  RatingsController.getMyRatingsByDomain
);

router.get(
  "/searchByDomain",
  Auth.BasicAuth,
  Auth.UserAuth,
  RatingsController.getAllRatingsByDomain
);

router.post(
  "/add",
  Auth.BasicAuth,
  Auth.UserAuth,
  celebrate({
    body: {
      domain: Joi.string().required().regex(DOMAIN_VALIDATION_REGEX),
      ratings: Joi.array()
        .items(Joi.number())
        .length(RATING_PARAMETERS.length)
        .required(),
      comment: Joi.string().optional(),
    },
  }),
  RatingsController.addRating
);

router.put(
  "/update",
  Auth.BasicAuth,
  Auth.UserAuth,
  celebrate({
    body: {
      domain: Joi.string().required(),
      ratings: Joi.array()
        .items(Joi.number())
        .length(RATING_PARAMETERS.length)
        .optional(),
      comment: Joi.string().optional(),
    },
  }),
  RatingsController.updateRating
);

router.delete(
  "/delete",
  Auth.BasicAuth,
  Auth.UserAuth,
  celebrate({
    body: {
      domain: Joi.string().required(),
    },
  }),
  RatingsController.deleteRating
);

router.use(errors());

module.exports = router;
