import { IUserModel, Users } from "../models/users.model";
import { MongoDao } from "../daoLayer/mongoDao";
import { SUCCESS } from "../constants/succes";
import { ERROR } from "../constants/error";
import { verifyJwtToken } from "../utils/helpers";
require("dotenv").config();

const usersDao = new MongoDao<IUserModel>(Users);

export const CoinsController = {
  getCoins: async (req: any, res: any) => {
    try {
      let token = req.headers[<string>process.env.JWT_HEADER_KEY];
      let tokenData = await verifyJwtToken(token);
      let result = await usersDao.findOneByFields({
        _id : tokenData.id
      })
      const userDetails = result[0]
      res.status(SUCCESS.GET_200.code).send({ result: {coins : userDetails.coins}});
    } catch (err: any) {
      res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
  },
  giveCoins : async(req:any , res:any) => {
    try{
    let numberOfCoins = req.body.numberOfCoins;
    let userId = req.body.userId;
    await usersDao.incrementField({_id : userId}, "coins", numberOfCoins)
    let result = {...SUCCESS.PATCH_200_DATA, response : "Coins credited successfully!"}
    res.status(SUCCESS.PATCH_200_DATA.code).send(result)
    } catch (err : any){
        res
        .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
        .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
    }
    
  },
  redeemCoins : async(req : any, res : any) =>{
    try {
        let requestedCoins = req.body.coins;
        let token = req.headers[<string>process.env.JWT_HEADER_KEY];
        let tokenData = await verifyJwtToken(token);
        let result = await usersDao.findOneByFields({
          _id : tokenData.id
        })
        const userDetails = result[0]
        const userId = userDetails.id
        if(requestedCoins > userDetails.coins){
            return res.status(ERROR.INSUFFICIENT_COINS.code).json(ERROR.INSUFFICIENT_COINS)
        } else {

            // <--------Code to transfer coins to the respective user goes here -------->
            
            await usersDao.decrementField({_id : userId}, "coins", requestedCoins)
            return res.status(SUCCESS.PATCH_200_DATA.code).json({...SUCCESS.PATCH_200_DATA, response : `${requestedCoins} coins redeemed successfully!`})
        }
      } catch (err: any) {
        res
          .status(ERROR.INTERNAL_SERVER_ERROR_500.code)
          .send({ ...ERROR.INTERNAL_SERVER_ERROR_500, databaseError: err });
      }
  }
};
