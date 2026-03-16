require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Connecting to", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected!");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();