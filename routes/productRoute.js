import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { create } from "../controller/productController.js";

const route = express.Router();

route.post("/create", upload.single("image"), create);

export default route;
