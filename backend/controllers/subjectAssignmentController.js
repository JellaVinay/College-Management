import SubjectAssignment from "../models/SubjectAssignment.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

// =====================================================
// ADMIN VALIDATION
// =====================================================

const validateAdmin = async (adminUserId) => {
  if (!adminUserId) {
    return null;
  }

  const admin = await User.findOne({
    userId: adminUserId,
    role: "admin",
  });

  return admin;
};

// =====================================================
// GET ALL SUBJECT ASSIGNMENTS
// =====================================================

export const getSubjectAssignments = async (req, res) => {
  try {
    const assignments = await SubjectAssignment.find()
      .populate(
        "subject",
        "subjectName subjectCode"
      )
      .populate(
        "teacher",
        "teacherId name department designation"
      )
      .populate(
        "createdBy",
        "userId name"
      )
      .sort({
        academicYear: -1,
        semester: 1,
      });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(
      "Get subject assignments error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch subject assignments",
      error: error.message,
    });
  }
};

// =====================================================
// GET ASSIGNMENTS FOR A TEACHER
// =====================================================

export const getTeacherSubjectAssignments = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const assignments = await SubjectAssignment.find({
      teacher: teacher._id,
    })
      .populate(
        "subject",
        "subjectName subjectCode"
      )
      .populate(
        "teacher",
        "teacherId name department designation"
      )
      .sort({
        academicYear: -1,
        semester: 1,
      });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(
      "Get teacher subject assignments error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch teacher assignments",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE SUBJECT ASSIGNMENT
// =====================================================

export const getSubjectAssignmentById = async (req, res) => {
  try {
    const assignment =
      await SubjectAssignment.findById(req.params.id)
        .populate(
          "subject",
          "subjectName subjectCode"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        )
        .populate(
          "createdBy",
          "userId name"
        );

    if (!assignment) {
      return res.status(404).json({
        message: "Subject assignment not found",
      });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error(
      "Get subject assignment error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch subject assignment",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE SUBJECT ASSIGNMENT
// =====================================================

export const createSubjectAssignment = async (req, res) => {
  try {
    const {
      subjectId,
      teacherId,
      branch,
      semester,
      academicYear,
      adminUserId,
    } = req.body;

    // Validate admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    // Validate required fields
    if (
      !subjectId ||
      !teacherId ||
      !branch ||
      !semester ||
      !academicYear
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check subject
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Check teacher
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Check duplicate assignment
    const existingAssignment =
      await SubjectAssignment.findOne({
        subject: subjectId,
        teacher: teacherId,
        branch,
        semester,
        academicYear,
      });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "This subject assignment already exists",
      });
    }

    // Create assignment
    const assignment =
      await SubjectAssignment.create({
        subject: subjectId,
        teacher: teacherId,
        branch,
        semester,
        academicYear,
        createdBy: admin._id,
      });

    const populatedAssignment =
      await SubjectAssignment.findById(
        assignment._id
      )
        .populate(
          "subject",
          "subjectName subjectCode"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        );

    res.status(201).json({
      message:
        "Subject assigned successfully",
      assignment: populatedAssignment,
    });
  } catch (error) {
    console.error(
      "Create subject assignment error:",
      error
    );

    res.status(500).json({
      message: "Failed to create subject assignment",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SUBJECT ASSIGNMENT
// =====================================================

export const updateSubjectAssignment = async (req, res) => {
  try {
    const {
      subjectId,
      teacherId,
      branch,
      semester,
      academicYear,
      adminUserId,
    } = req.body;

    // Validate admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    if (
      !subjectId ||
      !teacherId ||
      !branch ||
      !semester ||
      !academicYear
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const assignment =
      await SubjectAssignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        message: "Subject assignment not found",
      });
    }

    // Check subject
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Check teacher
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Check duplicate assignment
    const existingAssignment =
      await SubjectAssignment.findOne({
        subject: subjectId,
        teacher: teacherId,
        branch,
        semester,
        academicYear,
        _id: {
          $ne: req.params.id,
        },
      });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "This subject assignment already exists",
      });
    }

    assignment.subject = subjectId;
    assignment.teacher = teacherId;
    assignment.branch = branch;
    assignment.semester = semester;
    assignment.academicYear = academicYear;

    await assignment.save();

    const updatedAssignment =
      await SubjectAssignment.findById(
        assignment._id
      )
        .populate(
          "subject",
          "subjectName subjectCode"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        );

    res.status(200).json({
      message:
        "Subject assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(
      "Update subject assignment error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update subject assignment",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SUBJECT ASSIGNMENT
// =====================================================

export const deleteSubjectAssignment = async (req, res) => {
  try {
    const { adminUserId } = req.query;

    // Validate admin
    const admin = await validateAdmin(adminUserId);

    if (!admin) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    const assignment =
      await SubjectAssignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        message: "Subject assignment not found",
      });
    }

    await SubjectAssignment.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Subject assignment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete subject assignment error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete subject assignment",
      error: error.message,
    });
  }
};