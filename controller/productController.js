import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js"; // make sure this path is correct

export const create = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      price,
      cost,
      status,
      created_by,
      updated_by
    } = req.body;

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const newProduct = new Product({
      name,
      description,
      category_id,
      price,
      cost,
      image,
      status,
      created_by,
      updated_by,
      created_date: new Date(),
      updated_date: new Date()
    });

    const savedProduct = await newProduct.save();

    // Fetch category object
    const category = await Category.findById(category_id);

    // Construct response with category object
    const response = {
      ...savedProduct.toObject(), // convert Mongoose document to plain JS object
      category
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const fetch = async (req, res) => {
  try {
    const products = await Product.find();
    if(products.length === 0) {
      return res.status(404).json({message: "Product not Found."})
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({error: "Internal Server Error."})
  }
}