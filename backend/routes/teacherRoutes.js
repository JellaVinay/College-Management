import express from "express";

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

// Get all teachers
router.get("/", getTeachers);

// Get teacher by MongoDB _id
router.get("/:id", getTeacherById);

// Create teacher
router.post("/", createTeacher);

// Update teacher
router.put("/:id", updateTeacher);

// Delete teacher
router.delete("/:id", deleteTeacher);

export default router;