import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import userSchema from "./model/userSchema.js";
import productSchema from "./model/productSchema.js";
import orderSchema from "./model/orderSchema.js";
import connectDB from "./config/dbConnect.js";

dotenv.config();

connectDB();

// function to delete and insert dummy data into the database

const importData = async () => {
  try {
    await orderSchema.deleteMany();
    await productSchema.deleteMany();
    await userSchema.deleteMany();

    const createdUsers = await userSchema.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    await productSchema.insertMany(sampleProducts);
    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// delete the dummy datas
const destroyData = async () => {
  try {
    await orderSchema.deleteMany();
    await productSchema.deleteMany();
    await userSchema.deleteMany();
    console.log("Data destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// import or destroy data from console
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
