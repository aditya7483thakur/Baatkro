import mongoose from "mongoose";

export const mongoDb = () =>
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Baatkro",
    })
    .then((c) => console.log(`Database Connected ${c.connection.host}`))
    .catch((e) => console.log(e));
