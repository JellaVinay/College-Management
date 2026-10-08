import express from "express";

import {
  getHolidays,
  getHolidaysByMonth,
  addHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holidayController.js";

const router = express.Router();

// Get all holidays
router.get("/", getHolidays);

// Get holidays by month
router.get("/month", getHolidaysByMonth);

// Add holiday
router.post("/", addHoliday);

// Update holiday
router.put("/:id", updateHoliday);

// Delete holiday
router.delete("/:id", deleteHoliday);

export default router;