import express from "express";

import {
  getTeacherAssignedSubjects,
  getStudentsForSubjectAssignment,
  saveClassSession,
  saveStudentAttendance,
  getClassAttendance,
  getStudentMonthlyAttendance,
} from "../controllers/studentAttendanceController.js";

const router = express.Router();

// Get teacher's assigned subjects
router.get(
  "/teacher/:userId/subjects",
  getTeacherAssignedSubjects
);

// Get students for a subject assignment
router.get(
  "/teacher/:userId/subject/:subjectId/students",
  getStudentsForSubjectAssignment
);

// Create / update class session
router.post(
  "/teacher/:userId/class-session",
  saveClassSession
);

// Save student attendance
router.post(
  "/teacher/:userId/class-session/:classSessionId/attendance",
  saveStudentAttendance
);

// Get class session + existing attendance
router.get(
  "/teacher/:userId/subject/:subjectId/date/:date",
  getClassAttendance
);

// Get student's monthly attendance
router.get(
  "/student/:studentId/month",
  getStudentMonthlyAttendance
);

export default router;