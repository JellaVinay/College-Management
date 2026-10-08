import express from "express";

import {
  getSubjectAssignments,
  getTeacherSubjectAssignments,
  getSubjectAssignmentById,
  createSubjectAssignment,
  updateSubjectAssignment,
  deleteSubjectAssignment,
} from "../controllers/subjectAssignmentController.js";

const router = express.Router();

// Get all subject assignments
router.get("/", getSubjectAssignments);

// Get assignments for a specific teacher
router.get("/teacher/:teacherId", getTeacherSubjectAssignments);

// Get assignment by ID
router.get("/:id", getSubjectAssignmentById);

// Create subject assignment
router.post("/", createSubjectAssignment);

// Update subject assignment
router.put("/:id", updateSubjectAssignment);

// Delete subject assignment
router.delete("/:id", deleteSubjectAssignment);

export default router;