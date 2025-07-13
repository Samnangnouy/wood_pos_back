import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { authenticate } from "./middleware/authMiddleware.js";
//Line to to added 
import route from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

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
app.use("/api/category", authenticate, route);
app.use("/api/product", authenticate,  productRoute);
app.use("/api/user", authenticate, userRoute);
app.use("/api/auth", authRoute);
