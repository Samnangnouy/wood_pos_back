import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { create, fetch, update, deleteProduct, getProductById } from "../controller/productController.js";

const route = express.Router();

route.post("/create", upload.single("image"), create);
route.get("/getAllProducts", fetch);
route.put("/update/:id", upload.single("image"), update);
route.delete("/delete/:id", deleteProduct);
route.get("/detail/:id", getProductById);

export default route;
