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
// export const fetch = async (req, res)=>{
//     try {
//         // Find all category in the database
//         const categories = await Category.find();
//         // If no category are found, send a 404 error response
//         if(categories.length === 0 ){
//             return res.status(404).json({message : "Categories not Found."})
//         }
//         // Send a success response with the fetched category data
//         res.status(200).json(categories);
//     } catch (error) {
//         // Handle any errors and send an internal server error response
//         res.status(500).json({error : " Internal Server Error. "})
//     }
// }

export const fetch = async (req, res) => {
  try {
    const perPage = parseInt(req.query.per_page) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const sortField = req.query.sort_field || 'updated_date';
    const sortDirection = req.query.sort_direction === 'asc' ? 1 : -1;

    const filter = {
      name: { $regex: search, $options: 'i' },
    };

    const total = await Category.countDocuments(filter);
    const categories = await Category.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(( page - 1) * perPage)
      .limit(perPage);

    const response = categories.map(category => {
      const categoryObj = category.toObject();
      return {
        ...categoryObj,
      };
    });

    const lastPage = Math.ceil(total / perPage);
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    const links = [];
    for (let i =1; i <= lastPage; i++) {
      links.push({
        url: `?page=${i}&per_page=${perPage}&search=${search}&sort_field=${sortField}&sort_direction=${req.query.sort_direction || 'desc'}`,
        label: String(i),
        active: i === page,
      });
    }

    res.status(200).json({
      data: response,
      links,
      total,
      limit: perPage,
      from,
      to
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error." });
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
