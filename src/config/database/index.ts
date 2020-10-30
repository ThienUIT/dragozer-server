import mongoose from "mongoose";
import colors from "colors";

import {
  APP_CONNECT_DATABASE,
  APP_CONNECT_MLAB,
} from "@/config/database/config_env";

// async function connect() {
//   try {
//     await mongoose.connect(APP_CONNECT_DATABASE!, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     });
//     console.log(
//       colors.cyan.underline.bold(`MongoDB Connected: ${APP_CONNECT_DATABASE}`)
//     );
//   } catch (e) {
//     console.log(
//       colors.red(`For some reasons we couldn't connect to the DB ${e}`)
//     );
//   }
// }
async function connect() {
  try {
    await mongoose.connect(APP_CONNECT_MLAB!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(
      colors.cyan.underline.bold(`MongoDB Connected: ${APP_CONNECT_MLAB}`)
    );
  } catch (e) {
    console.log(
      colors.red(`For some reasons we couldn't connect to the DB ${e}`)
    );
  }
}

module.exports = { connect };
