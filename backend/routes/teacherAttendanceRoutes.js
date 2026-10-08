import express from "express";

import {
  getTodayTeacherAttendance,
  saveTeacherAttendance,
  getTeacherAttendance,
} from "../controllers/teacherAttendanceController.js";

const router = express.Router();

// Get teacher attendance for a selected date
router.get("/today", getTodayTeacherAttendance);

// Save teacher attendance
router.post("/", saveTeacherAttendance);

// Get individual teacher attendance
router.get("/teacher/:teacherId", getTeacherAttendance);

export default router;