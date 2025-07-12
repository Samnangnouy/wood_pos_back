import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { create, fetch, update, deleteUser, getUserById } from "../controller/userController.js";

const route = express.Router();

route.post("/create", upload.single("image"), create); 
route.get("/getAllUsers", fetch);
route.put("/update/:id", upload.single("image"), update);
route.delete("/delete/:id", deleteUser);
route.get("/detail/:id", getUserById);

export default route;