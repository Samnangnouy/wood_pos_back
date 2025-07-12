import express from "express";

import { fetch, create, update, deleteCategory } from "../controller/categoryController.js";

// Create a new router instance
const route = express.Router();

route.post("/create", create);
route.get("/getAllCategories", fetch);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteCategory);

// Export the router
export default route;