import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

//Line to to added 
import route from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static('public/upload'));

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

// Line to be added 
app.use("/api/category", route);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
