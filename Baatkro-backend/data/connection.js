import mongoose from "mongoose";

export const mongoDb = () =>
  mongoose
    .connect("mongodb://127.0.0.1:27017", {
      dbName: "Baatkro",
    })
    .then((c) => console.log(`Database Connected ${c.connection.host}`))
    .catch((e) => console.log(e));
