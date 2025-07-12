import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { create, fetch } from "../controller/productController.js";

const route = express.Router();

route.post("/create", upload.single("image"), create);
route.get("/getAllProducts", fetch);

export default route;
