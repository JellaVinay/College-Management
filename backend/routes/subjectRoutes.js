import express from "express";

import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

// Get all subjects
router.get("/", getSubjects);

// Get subject by ID
router.get("/:id", getSubjectById);

// Create subject
router.post("/", createSubject);

// Update subject
router.put("/:id", updateSubject);

// Delete subject
router.delete("/:id", deleteSubject);

export default router;