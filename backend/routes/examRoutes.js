import express from "express";

import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

const router = express.Router();

// Get all exams
router.get("/", getExams);

// Get exam by ID
router.get("/:id", getExamById);

// Create exam
router.post("/", createExam);

// Update exam
router.put("/:id", updateExam);

// Delete exam
router.delete("/:id", deleteExam);

export default router;