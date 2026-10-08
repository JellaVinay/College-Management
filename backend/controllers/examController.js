import Exam from "../models/Exam.js";
import User from "../models/User.js";

// =====================================================
// GET ALL EXAMS
// =====================================================

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("createdBy", "name userId")
      .sort({ examDate: -1 });

    res.status(200).json(exams);
  } catch (error) {
    console.error("Get exams error:", error);

    res.status(500).json({
      message: "Failed to fetch exams",
    });
  }
};

// =====================================================
// GET SINGLE EXAM
// =====================================================

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("createdBy", "name userId");

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Get exam error:", error);

    res.status(500).json({
      message: "Failed to fetch exam",
    });
  }
};

// =====================================================
// CREATE EXAM
// =====================================================

export const createExam = async (req, res) => {
  try {
    const {
      examName,
      examCode,
      branch,
      academicYear,
      semester,
      examDate,
      adminUserId,
    } = req.body;

    if (
      !examName ||
      !examCode ||
      !branch ||
      !academicYear ||
      !semester ||
      !examDate ||
      !adminUserId
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Admin
    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can create exams",
      });
    }

    // Check duplicate exam code
    const existingExam = await Exam.findOne({
      examCode: examCode.trim(),
    });

    if (existingExam) {
      return res.status(400).json({
        message: "Exam code already exists",
      });
    }

    const exam = await Exam.create({
      examName: examName.trim(),
      examCode: examCode.trim(),
      branch: branch.trim(),
      academicYear: academicYear.trim(),
      semester: semester.trim(),
      examDate,
      createdBy: admin._id,
    });

    const populatedExam = await Exam.findById(exam._id)
      .populate("createdBy", "name userId");

    res.status(201).json({
      message: "Exam created successfully",
      exam: populatedExam,
    });
  } catch (error) {
    console.error("Create exam error:", error);

    res.status(500).json({
      message: "Failed to create exam",
    });
  }
};

// =====================================================
// UPDATE EXAM
// =====================================================

export const updateExam = async (req, res) => {
  try {
    const {
      examName,
      examCode,
      branch,
      academicYear,
      semester,
      examDate,
      adminUserId,
    } = req.body;

    if (
      !examName ||
      !examCode ||
      !branch ||
      !academicYear ||
      !semester ||
      !examDate ||
      !adminUserId
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Admin
    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can update exams",
      });
    }

    // Check duplicate exam code
    const duplicateExam = await Exam.findOne({
      examCode: examCode.trim(),
      _id: { $ne: req.params.id },
    });

    if (duplicateExam) {
      return res.status(400).json({
        message: "Exam code already exists",
      });
    }

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    exam.examName = examName.trim();
    exam.examCode = examCode.trim();
    exam.branch = branch.trim();
    exam.academicYear = academicYear.trim();
    exam.semester = semester.trim();
    exam.examDate = examDate;

    await exam.save();

    const updatedExam = await Exam.findById(exam._id)
      .populate("createdBy", "name userId");

    res.status(200).json({
      message: "Exam updated successfully",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Update exam error:", error);

    res.status(500).json({
      message: "Failed to update exam",
    });
  }
};

// =====================================================
// DELETE EXAM
// =====================================================

export const deleteExam = async (req, res) => {
  try {
    const { adminUserId } = req.body;

    if (!adminUserId) {
      return res.status(400).json({
        message: "Admin user ID is required",
      });
    }

    // Check Admin
    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can delete exams",
      });
    }

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    await Exam.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error);

    res.status(500).json({
      message: "Failed to delete exam",
    });
  }
};