// Import the User model from userModel.js
import Category from "../model/categoryModel.js";

// Create a new category
export const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Optional: check if category with the same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();

    res.status(200).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// For getting all category from the database
export const fetch = async (req, res)=>{
    try {
        // Find all category in the database
        const categories = await Category.find();
        // If no category are found, send a 404 error response
        if(categories.length === 0 ){
            return res.status(404).json({message : "Categories not Found."})
        }
        // Send a success response with the fetched category data
        res.status(200).json(categories);
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// For updating data
export const update = async (req, res)=>{
    try {
        // Extract category id from request parameters
        const id = req.params.id;
        // Check if the category with the given id exists
        const categoryExist = await Category.findOne({_id:id})
        if (!categoryExist){
            return res.status(404).json({message : "Category not found."})
        }
        // Update the category data and return the updated user
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {new : true});
        res.status(201).json(updateCategory);
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// For deleting data from the database
export const deleteCategory = async (req, res)=>{
    try {
        // Extract category id from request parameters
        const id = req.params.id;
        // Check if the category with the given id exists
        const categoryExist = await Category.findOne({_id:id})
        if(!categoryExist){
            return res.status(404).json({message : "Category Not Found. "})
        }
        // Delete the category from the database
        await Category.findByIdAndDelete(id);
        // Send a success response
        res.status(201).json({message : "Category deleted Successfully."})
    } catch (error) {
        // Handle any errors and send an internal server error response
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the category by ID
    const category = await Category.findById(id);

    // If not found
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Return the found category
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
