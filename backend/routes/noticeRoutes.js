import express from "express";

import {
  getNotices,
  getNoticeById,
  createNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

const router = express.Router();

// Get all notices
router.get("/", getNotices);

// Get notice by ID
router.get("/:id", getNoticeById);

// Create notice
router.post("/", createNotice);

// Delete notice
router.delete("/:id", deleteNotice);

export default router;