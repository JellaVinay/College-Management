import Subject from "../models/Subject.js";
import User from "../models/User.js";

// =====================================================
// VALIDATE ADMIN
// =====================================================

const validateAdmin = async (adminUserId) => {
  if (!adminUserId) return null;

  const admin = await User.findOne({
    userId: adminUserId,
    role: "admin",
  });

  return admin;
};

// =====================================================
// GET ALL SUBJECTS
// =====================================================

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({
      branch: 1,
      semester: 1,
      subjectCode: 1,
    });

    res.json(subjects);
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
};

// =====================================================
// GET SINGLE SUBJECT
// =====================================================

export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(subject);
  } catch (error) {
    console.error("Get subject error:", error);

    res.status(500).json({
      message: "Failed to fetch subject",
    });
  }
};

// =====================================================
// CREATE SUBJECT
// =====================================================

export const createSubject = async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      branch,
      semester,
      adminUserId,
    } = req.body;

    // Validate Admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can create subjects",
      });
    }

    // Validate required fields
    if (
      !subjectName ||
      !subjectCode ||
      !branch ||
      !semester
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check duplicate subject code
    const existingSubject = await Subject.findOne({
      subjectCode: subjectCode.trim(),
    });

    if (existingSubject) {
      return res.status(400).json({
        message: "Subject code already exists",
      });
    }

    const subject = await Subject.create({
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim(),
      branch: branch.trim(),
      semester: semester.trim(),
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SUBJECT
// =====================================================

export const updateSubject = async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      branch,
      semester,
      adminUserId,
    } = req.body;

    // Validate Admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can update subjects",
      });
    }

    // Validate required fields
    if (
      !subjectName ||
      !subjectCode ||
      !branch ||
      !semester
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check subject exists
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Check duplicate subject code
    const duplicateSubject = await Subject.findOne({
      subjectCode: subjectCode.trim(),
      _id: { $ne: req.params.id },
    });

    if (duplicateSubject) {
      return res.status(400).json({
        message: "Subject code already exists",
      });
    }

    subject.subjectName = subjectName.trim();
    subject.subjectCode = subjectCode.trim();
    subject.branch = branch.trim();
    subject.semester = semester.trim();

    await subject.save();

    res.json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error("Update subject error:", error);

    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SUBJECT
// =====================================================

export const deleteSubject = async (req, res) => {
  try {
    const { adminUserId } = req.body;

    // Validate Admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can delete subjects",
      });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};