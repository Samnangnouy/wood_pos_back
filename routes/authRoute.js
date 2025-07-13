// routes/authRoute.js
import express from "express";
import { login, logout, me } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/login", login);
route.post("/logout", logout);
route.get("/me", authenticate, me);

export default route;
