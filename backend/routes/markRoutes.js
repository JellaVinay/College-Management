import express from "express";

import {
  getTeacherAssignedSubjects,
  getStudentsForSubject,
  getTeacherMarks,
  addOrUpdateMark,
} from "../controllers/markController.js";

const router = express.Router();

// Get teacher's assigned subjects
router.get("/teacher/:userId/subjects", getTeacherAssignedSubjects);

// Get students for teacher's subject
router.get(
  "/teacher/:userId/subject/:subjectId/students",
  getStudentsForSubject
);

// Get marks for subject + exam
router.get(
  "/teacher/:userId/subject/:subjectId/exam/:examId",
  getTeacherMarks
);

// Add or update mark
router.post("/", addOrUpdateMark);

export default router;