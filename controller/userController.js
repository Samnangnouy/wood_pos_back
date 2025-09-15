import fs, { link } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";

export const create = async (req, res) => {
    try {
        const { username, password, full_name, role } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create full image URL
        const image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const newUser = new User({
            username,
            password: hashedPassword,
            full_name,
            image,
            role,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const savedUser = await newUser.save();

        // Don't return password
        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// export const fetch = async (req, res) => {
//     try {
//         const users = await User.find();
//         if (users.length === 0) {
//             return res.status(404).json({ message: "User not found." })
//         }
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error." })
//     }
// }

export const fetch = async (req, res) => {
    try {
        const perPage = parseInt(req.query.per_page) || 10;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';
        const sortField = req.query.sort_field || 'updated_at';
        const sortDirection = req.query.sort_direction === 'asc' ? 1 : -1;

        const filter = {
            username: { $regex: search, $options: 'i' }
        };

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .sort({ [sortField]: sortDirection })
            .skip((page -1) * perPage)
            .limit(perPage);

        const response = users.map(user => {
            const userObj = user.toObject();
            return {
                ...userObj,
            };
        });

        const lastPage = Math.ceil(total / perPage);
        const from = total === 0 ? 0 : (page -1) * perPage + 1;
        const to = Math.min(page * perPage, total);

        const links = [];
        for (let i = 1; i <= lastPage; i++) {
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

    }   catch(error) {
        console.error("Error fetchong users:", error);
        res.status(500).json({ error: "Internal Server Error."});
    }
}

export const update = async (req, res) => {
    try {
        const id = req.params.id;

        // Find existing user
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Extract fields
        const { username, password, full_name, role } = req.body;

        // Handle new image
        let image = existingUser.image;
        if (req.file) {
            // Delete old image file
            const oldImagePath = path.join("public/upload", path.basename(existingUser.image));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Update with new image URL
            image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        // Hash password if updated
        let hashedPassword = existingUser.password;
        if (password && password !== "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                username,
                password: hashedPassword,
                full_name,
                image,
                role,
                updated_at: new Date()
            },
            { new: true }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser.toObject();

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const imagePath = path.join("public/upload", path.basename(user.image));
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.warn("Failed to delete image file:", err.message);
            } else {
                console.log("Image deleted:", imagePath);
            }
        });

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found."});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}