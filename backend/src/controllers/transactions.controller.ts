import { ITransactionModel, Transactions } from "../models/transactions.model"
import { MongoDao } from "../daoLayer/mongoDao";
import { SUCCESS } from "../constants/succes";
import { ERROR } from "../constants/error";
import { verifyJwtToken } from "../utils/helpers";
require("dotenv").config();

const transactionsDao = new MongoDao<ITransactionModel>(Transactions)

export const TRANSACTIONS_CONTROLLER = {
    getAllTransactions : async(req : any, res : any) => {
        try {
            let result = await transactionsDao.findAll({}, {
              _id : 0,
              user : 1,
              from : 1,
              to : 1,
              amountInEther : 1,
              transactionHash : 1,
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
    getMyTransactions : async(req : any, res : any) => {
        try {
            let token = req.headers[<string>process.env.JWT_HEADER_KEY];
            let tokenData = await verifyJwtToken(token);
            let result = await transactionsDao.findAll({user : tokenData.id}, {
              _id : 0,
              from : 1,
              to : 1,
              amountInEther : 1,
              transactionHash : 1,
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
}