
import mongoose from "mongoose";

// Define the schema for the user entity
const categorySchema = new mongoose.Schema({
  // Define the name property with type String and required constraint
  name: {
    type: String,
    required: true,
  },
  // Define the email property with type String and required constraint
  description: {
    type: String,
    required: true,
  }
});

// Create and export the Mongoose model for the "users" collection based on the categorySchema
export default mongoose.model("categories", categorySchema);