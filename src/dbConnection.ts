import mongoose from "mongoose";
import {config} from "./config";
import createHttpError from "http-errors";


const connectDb = async ()=> {
  try {
    mongoose.connection.on("connected", () =>{
      console.log("Connected to DB");
    })
    mongoose.connection.on("error", (err: Error) => {
      console.log(err)
    })
    await mongoose.connect( config.databaseUrl as string)
  } catch (error) {
    console.log(error)
  }
}

export default connectDb;