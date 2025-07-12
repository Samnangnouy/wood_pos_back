import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true
    },
    full_name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("users", userSchema);