import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import cors
import { authenticate } from "./middleware/authMiddleware.js";

import route from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use('/uploads', express.static('public/upload'));

// ✅ Enable CORS before any route
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// 🔐 Routes
app.use("/api/category", authenticate, route);
app.use("/api/product", authenticate, productRoute);
app.use("/api/user", authenticate, userRoute);
app.use("/api/auth", authRoute);

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
