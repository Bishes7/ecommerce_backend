import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL || process.env.MONGO_URL;
    if (!uri) throw new Error("Mongo URI not set in env variables");

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
