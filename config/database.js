import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
    }).con;
    console.log("MongoDB Connnected...");
  } catch (err) {
    console.error(err.message);

    process.exit(1);
  }
};

export default connectDB;