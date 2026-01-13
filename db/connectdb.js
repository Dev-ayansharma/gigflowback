import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
export const connectdb = async () => {
  try {
    const connectioninstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `database connected DB_HOST:${connectioninstance.connection.host}`,
    );
  } catch (error) {
    console.error("the database not connected", error);
    process.exit(1);
  }
};
