import User from "../models/User.js";
import bcrypt from "bcryptjs";

// =====================================================
// CREATE USER
// =====================================================

export const createUser = async (req, res) => {
  try {
    const {
      name,
      userId,
      password,
      role,
    } = req.body;

    // -------------------------------------------------
    // Check required fields
    // -------------------------------------------------

    if (
      !name ||
      !userId ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // -------------------------------------------------
    // Check valid role
    // -------------------------------------------------

    if (
      !["admin", "student", "teacher"].includes(
        role
      )
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // -------------------------------------------------
    // Check maximum 5 admins
    // -------------------------------------------------

    if (role === "admin") {
      const adminCount =
        await User.countDocuments({
          role: "admin",
        });

      if (adminCount >= 5) {
        return res.status(400).json({
          message:
            "Maximum 5 admin accounts are allowed",
        });
      }
    }

    // -------------------------------------------------
    // Check duplicate user ID
    // -------------------------------------------------

    const existingUser =
      await User.findOne({
        userId,
      });

    if (existingUser) {
      return res.status(400).json({
        message: "User ID already exists",
      });
    }

    // -------------------------------------------------
    // Hash password
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------------------------------
    // Create user
    // -------------------------------------------------

    const user = await User.create({
      name,
      userId,
      password: hashedPassword,
      role,
    });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    res.status(201).json({
      message: "User created successfully",

      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};