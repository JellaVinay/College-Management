import express from "express";

import {
  getAdminResults,
  getStudentResults,
} from "../controllers/resultController.js";

const router = express.Router();

// Admin results
router.get("/admin", getAdminResults);

// Student results
router.get("/student/:studentId", getStudentResults);

export default router;