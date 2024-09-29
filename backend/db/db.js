import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const client = mongoose.connect(process.env.mongo_uri || 8001, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 40000,
});

let isDBConneted = false;

async function getDatabaseProps() {
  try {
    mongoose.connection.once("open", () => {
      if (!isDBConneted) {
        const db = mongoose.connection.db
          .collection("user_comment")
          .find({})
          .toArray();
        return db;
      }
    });
  } catch (err) {
    console.error("Failed to fetch data ", err);
  }
}

async function updateDatabase(data) {
  try {
    const postData = await mongoose.connection.db
      .collection("user_comment")
      .insertOne(data);
    return postData.acknowledged;
  } catch (err) {
    console.error("Failed to insert data", err);
  }
}

export { getDatabaseProps, updateDatabase };
