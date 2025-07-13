// routes/authRoute.js
import express from "express";
import { login, logout } from "../controller/authController.js";

const route = express.Router();

route.post("/login", login);
route.post("/logout", logout); // optional

export default route;
