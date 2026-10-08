import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import router from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import subjectRouts from "./routes/subjectRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import teacherAttendanceRoutes from "./routes/teacherAttendanceRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import studentAttendanceRoutes from "./routes/studentAttendanceRoutes.js";
import subjectAssignmentRoutes from "./routes/subjectAssignmentRoutes.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());

app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", router);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRouts)
app.use("/api/exams", examRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/teacher-attendance", teacherAttendanceRoutes)
app.use("/api/holidays", holidayRoutes)
app.use("/api/student-attendance", studentAttendanceRoutes);  
app.use("/api/subject-assignments", subjectAssignmentRoutes);



// Test route
app.get("/", (req, res) => {
  res.json({
    message: "College Management System Backend is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});