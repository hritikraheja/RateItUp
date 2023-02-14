import * as express from "express";
import { celebrate, Joi, errors, Segments } from "celebrate";
import { Auth } from "../../middlewares/auth";
import { CoinsController } from "../../controllers/coins.controller";

const router = express.Router();

router.get('', 
Auth.BasicAuth,
Auth.UserAuth,
CoinsController.getCoins
)

router.patch('/credit',
Auth.PlatformAuth,
celebrate({
    body : {
        userId : Joi.string().required(),
        numberOfCoins : Joi.number().required()
    }
}),
CoinsController.giveCoins
)

router.patch('/redeem',
Auth.BasicAuth,
Auth.UserAuth,
celebrate({
    body : {
        coins : Joi.number().required()
    }
}),
CoinsController.redeemCoins
)

router.use(errors());

module.exports = router;