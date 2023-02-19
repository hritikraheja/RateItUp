import * as express from "express";
import { celebrate, Joi, errors, Segments } from "celebrate";
import { Auth } from "../../middlewares/auth";
import { TRANSACTIONS_CONTROLLER } from "../../controllers/transactions.controller";

const router = express.Router();

router.get('/all',
Auth.PlatformAuth,
TRANSACTIONS_CONTROLLER.getAllTransactions
)

router.get('/', 
Auth.BasicAuth,
Auth.UserAuth,
TRANSACTIONS_CONTROLLER.getMyTransactions
)

router.use(errors());

module.exports = router;
