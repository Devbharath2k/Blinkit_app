import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Mongodb = process.env.MONGODB_URI

if(!Mongodb){
    throw new Error("MONGODB_URI not found in the environment variables.")
}

const HandlerDatabase = async (req, res) => {
    try {
        await mongoose.connect(Mongodb);
        console.log("Monogodb connection established :)")
    } catch (error) {
        console.error(error);
    }
}

export default HandlerDatabase;