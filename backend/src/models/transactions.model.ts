import { Schema, model, Document, Types } from "mongoose";
import { dateConstants } from "../utils/helpers";
import { DATABASE_NAMES } from "../constants/databaseNames";

export interface ITransactionModel extends Document {
  user: Types.ObjectId | null;
  from : String;
  to : String;
  amountInEther : Number;
  transactionHash : String;
  createdOn: Number;
  updatedOn: Number;
}

export const TransactionsSchema: any = new Schema({
  user: { type: Types.ObjectId, required : false },
  from : {type : String, required: true },
  to : {type : String, required : true },
  amountInEther : {type : Number, required : true },
  transactionHash : {type : String, required: true, length : 64},
  createdOn: { type: Number, default: dateConstants.currentTimeStamp(), required : false },
  updatedOn: { type: Number, default: dateConstants.currentTimeStamp(), required : false },
});

export const Transactions = model<ITransactionModel>(
  DATABASE_NAMES.TRANSACTIONS,
  TransactionsSchema
);
