import Achievement from "../models/Achievement.js";
import User from "../models/User.js";

// GET all achievements
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate("createdBy", "name userId")
      .sort({ date: -1 });

    res.status(200).json(achievements);
  } catch (error) {
    console.error("Get achievements error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET single achievement
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate("createdBy", "name userId");

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found",
      });
    }

    res.status(200).json(achievement);
  } catch (error) {
    console.error("Get achievement error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CREATE achievement
export const createAchievement = async (req, res) => {
  try {
    const {
      title,
      studentId,
      description,
      date,
      image,
      adminUserId,
    } = req.body;

    if (!title || !studentId || !description || !date || !adminUserId) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check admin
    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can add achievements",
      });
    }

    const achievement = await Achievement.create({
      title,
      studentId,
      description,
      date,
      image: image || "",
      createdBy: admin._id,
    });

    const populatedAchievement = await Achievement.findById(
      achievement._id
    ).populate("createdBy", "name userId");

    res.status(201).json({
      message: "Achievement added successfully",
      achievement: populatedAchievement,
    });
  } catch (error) {
    console.error("Create achievement error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found",
      });
    }

    await Achievement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Delete achievement error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};