//@ts-nocheck
import { IUserModel, Users } from "../models/users.model";
import { ITransactionModel, Transactions } from "../models/transactions.model";
import { MongoDao } from "../daoLayer/mongoDao";
import {
  getRateItUpTokenDaoInstance,
  getRateItUpDeploymentAddress,
} from "../daoLayer/rateItUpTokenDao";
import { SUCCESS } from "../constants/succes";
import { ERROR } from "../constants/error";
import { verifyJwtToken } from "../utils/helpers";
import { Types } from "mongoose";
import Web3 from "web3";
require("dotenv").config();

const usersDao = new MongoDao<IUserModel>(Users);
const transactionsDao = new MongoDao<ITransactionModel>(Transactions);
const tokenDao = getRateItUpTokenDaoInstance();

export const CoinsController = {
  getCoins: async (req: any, res: any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let result = await usersDao.findOneByFields({
        _id: tokenData.id,
      });
      const userDetails = result[0];
      res
        .status(SUCCESS.GET_200.code)
        .send({ result: { coins: userDetails.coins } });
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  giveCoins: async (req: any, res: any) => {
    try {
      let numberOfCoins = req.body.numberOfCoins;
      let userId = req.body.userId;
      await usersDao.incrementField({ _id: userId }, "coins", numberOfCoins);
      let result = {
        ...SUCCESS.PATCH_200_DATA,
        response: "Coins credited successfully!",
      };
      res.status(SUCCESS.PATCH_200_DATA.code).send(result);
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  redeemCoins: async (req: any, res: any) => {
    try {
      let requestedCoins = req.body.coins;
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let result = await usersDao.findOneByFields({
        _id: tokenData.id,
      });
      const userDetails = result[0];
      const userId = userDetails.id;

      if (!userDetails.walletAddress) {
        return res
          .status(ERROR.WALLET_ADDRESS_NOT_FOUND.code)
          .json(ERROR.WALLET_ADDRESS_NOT_FOUND);
      } else if (requestedCoins > userDetails.coins) {
        return res
          .status(ERROR.INSUFFICIENT_COINS.code)
          .json(ERROR.INSUFFICIENT_COINS);
      } else {
        let amount = Web3.utils.toWei(requestedCoins.toString(), "ether");
        let transactionHash = await tokenDao.sendTokensFromContractToAddress(
          userDetails.walletAddress,
          amount.toString()
        );
        await usersDao.decrementField({ _id: userId }, "coins", requestedCoins);
        let newTransaction = {
          user: userId,
          from: getRateItUpDeploymentAddress("5777"),
          to: userDetails.walletAddress,
          transactionHash: transactionHash,
          amountInEther: 
          requestedCoins,
        };
        await transactionsDao.create(newTransaction);
        return res.status(SUCCESS.PATCH_200_DATA.code).json({
          ...SUCCESS.PATCH_200_DATA,
          response: `${requestedCoins} coins redeemed successfully!`,
          transactionHash: transactionHash,
        });
      }
    } catch (err: any) {
      console.log(err)
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
};
