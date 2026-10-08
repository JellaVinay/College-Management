import CollegeHoliday from "../models/CollegeHoliday.js";
import User from "../models/User.js";

// ===============================
// GET ALL HOLIDAYS
// ===============================

export const getHolidays = async (req, res) => {
  try {
    const holidays = await CollegeHoliday.find()
      .sort({ date: 1 });

    res.status(200).json(holidays);
  } catch (error) {
    console.error("Get holidays error:", error);

    res.status(500).json({
      message: "Failed to get holidays",
    });
  }
};

// ===============================
// GET HOLIDAYS BY MONTH
// ===============================

export const getHolidaysByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        message: "Year and month are required",
      });
    }

    const startDate = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    const endDate = new Date(
      Number(year),
      Number(month),
      1
    );

    const holidays = await CollegeHoliday.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    res.status(200).json(holidays);
  } catch (error) {
    console.error(
      "Get monthly holidays error:",
      error
    );

    res.status(500).json({
      message: "Failed to get monthly holidays",
    });
  }
};

// ===============================
// ADD HOLIDAY
// ===============================

export const addHoliday = async (req, res) => {
  try {
    const {
      adminUserId,
      date,
      name,
      reason,
    } = req.body;

    // Check Admin
    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can add holidays",
      });
    }

    if (!date || !name) {
      return res.status(400).json({
        message: "Date and holiday name are required",
      });
    }

    // Normalize date
    const holidayDate = new Date(
      `${date}T00:00:00`
    );

    // Check duplicate
    const existingHoliday =
      await CollegeHoliday.findOne({
        date: holidayDate,
      });

    if (existingHoliday) {
      return res.status(400).json({
        message:
          "A holiday already exists on this date",
      });
    }

    const holiday = await CollegeHoliday.create({
      date: holidayDate,
      name,
      reason,
      createdBy: admin._id,
    });

    res.status(201).json({
      message: "Holiday added successfully",
      holiday,
    });
  } catch (error) {
    console.error("Add holiday error:", error);

    res.status(500).json({
      message: "Failed to add holiday",
    });
  }
};

// ===============================
// UPDATE HOLIDAY
// ===============================

export const updateHoliday = async (req, res) => {
  try {
    const {
      adminUserId,
      date,
      name,
      reason,
    } = req.body;

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can update holidays",
      });
    }

    const holiday = await CollegeHoliday.findById(
      req.params.id
    );

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    if (date) {
      holiday.date = new Date(
        `${date}T00:00:00`
      );
    }

    if (name) {
      holiday.name = name;
    }

    holiday.reason = reason || "";

    await holiday.save();

    res.status(200).json({
      message: "Holiday updated successfully",
      holiday,
    });
  } catch (error) {
    console.error(
      "Update holiday error:",
      error
    );

    res.status(500).json({
      message: "Failed to update holiday",
    });
  }
};

// ===============================
// DELETE HOLIDAY
// ===============================

export const deleteHoliday = async (req, res) => {
  try {
    const { adminUserId } = req.query;

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can delete holidays",
      });
    }

    const holiday = await CollegeHoliday.findById(
      req.params.id
    );

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    await holiday.deleteOne();

    res.status(200).json({
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete holiday error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete holiday",
    });
  }
};