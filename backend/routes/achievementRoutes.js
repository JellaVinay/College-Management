import express from "express";

import {
  getAchievements,
  getAchievementById,
  createAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

const router = express.Router();

// Get all achievements
router.get("/", getAchievements);

// Get achievement by ID
router.get("/:id", getAchievementById);

// Create achievement
router.post("/", createAchievement);

// Delete achievement
router.delete("/:id", deleteAchievement);

export default router;