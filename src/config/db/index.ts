import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/vuetube_dev", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect successfully");
  } catch (e) {
    console.log("connect failure", e);
  }
}

module.exports = { connect };
