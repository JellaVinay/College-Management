import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    // Check required fields
    if (!userId || !password || !role) {
      return res.status(400).json({
        message: "Please provide user ID, password and role",
      });
    }

    // Find user
    const user = await User.findOne({
      userId: userId,
      role: role,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid ID, password or role",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid ID, password or role",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        userId: user.userId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};