import mongoose from "mongoose";
import { APP_CONNECT_DATABASE } from "../../utils/config_env";

async function connect() {
  try {
    await mongoose.connect(APP_CONNECT_DATABASE!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect successfully", APP_CONNECT_DATABASE);
  } catch (e) {
    console.log("connect failure", e);
  }
}

module.exports = { connect };
