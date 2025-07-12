import fs from "fs";
import path from "path";
import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js"; 

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
    const category = await Category.findById(category_id);
    const response = {
      ...savedProduct.toObject(), 
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
    const products = await Product.find().populate("category_id");

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    const response = products.map(product => {
      const productObj = product.toObject();
      return {
        ...productObj,
        category: productObj.category_id, 
        category_id: productObj.category_id._id, 
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const {
      name,
      description,
      category_id,
      price,
      cost,
      status,
      created_by,
      updated_by,
    } = req.body;

    let image = existingProduct.image;

    if (req.file) {
      const oldImagePath = path.join("public/upload", path.basename(existingProduct.image));
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.warn("Failed to delete old image:", err.message);
        } else {
          console.log("Old image deleted:", oldImagePath);
        }
      });
      image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category_id,
        price,
        cost,
        image,
        status,
        created_by,
        updated_by,
        updated_date: new Date(),
      },
      { new: true }
    );

    const category = await Category.findById(updatedProduct.category_id);
    const response = {
      ...updatedProduct.toObject(),
      category,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found." });
    }

    const imagePath = path.join("public/upload", path.basename(product.image));
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.warn("Failed to delete image file:", err.message);
      } else {
        console.log("Image deleted:", imagePath);
      }
    });

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("category_id");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const productObj = product.toObject();
    const response = {
      ...productObj,
      category: productObj.category_id,        
      category_id: productObj.category_id._id  
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};