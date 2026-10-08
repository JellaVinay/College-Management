import Notice from "../models/Notice.js";
import User from "../models/User.js";

/*
  GET ALL NOTICES
*/
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name userId")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    console.error("Get notices error:", error);

    res.status(500).json({
      message: "Failed to fetch notices",
    });
  }
};

/*
  GET ONE NOTICE
*/
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("createdBy", "name userId");

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Get notice error:", error);

    res.status(500).json({
      message: "Failed to fetch notice",
    });
  }
};

/*
  CREATE NOTICE
*/
export const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      adminUserId,
    } = req.body;

    if (!title || !description || !adminUserId) {
      return res.status(400).json({
        message: "Title, description and admin user ID are required",
      });
    }

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only an admin can create notices",
      });
    }

    const notice = await Notice.create({
      title,
      description,
      createdBy: admin._id,
    });

    const populatedNotice = await Notice.findById(notice._id)
      .populate("createdBy", "name userId");

    res.status(201).json({
      message: "Notice created successfully",
      notice: populatedNotice,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
  DELETE NOTICE
*/
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete notice error:", error);

    res.status(500).json({
      message: "Failed to delete notice",
    });
  }
};