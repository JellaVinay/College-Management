import express from "express";

import {
  getStudents,
  getStudentByUserId,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// Get all students
router.get("/", getStudents);

// Get student by logged-in user's userId
router.get("/user/:userId", getStudentByUserId);

// Get student by MongoDB _id
router.get("/:id", getStudentById);

// Create student
router.post("/", createStudent);

// Update student
router.put("/:id", updateStudent);

// Delete student
router.delete("/:id", deleteStudent);

export default router;