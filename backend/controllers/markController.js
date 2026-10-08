import Mark from "../models/Mark.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Exam from "../models/Exam.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

// =====================================================
// GET TEACHER'S ASSIGNED SUBJECTS
// =====================================================

export const getTeacherAssignedSubjects = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find logged-in User
    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can access this information",
      });
    }

    // Find Teacher profile connected to this User
    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // Find subjects assigned to this teacher
    const subjects = await Subject.find({
      teacher: teacher._id,
    }).populate("teacher", "name teacherId");

    res.status(200).json({
      teacher,
      subjects,
    });
  } catch (error) {
    console.error("Get teacher subjects error:", error);

    res.status(500).json({
      message: "Failed to fetch teacher subjects",
    });
  }
};

// =====================================================
// GET STUDENTS FOR TEACHER'S SUBJECT
// =====================================================

export const getStudentsForSubject = async (req, res) => {
  try {
    const {
      userId,
      subjectId,
    } = req.params;

    // -----------------------------------------------
    // Check User
    // -----------------------------------------------

    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can access student marks",
      });
    }

    // -----------------------------------------------
    // Find Teacher
    // -----------------------------------------------

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // -----------------------------------------------
    // Find Subject
    // -----------------------------------------------

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // -----------------------------------------------
    // IMPORTANT SECURITY CHECK
    // -----------------------------------------------

    if (
      subject.teacher.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to manage this subject",
      });
    }

    // -----------------------------------------------
    // Find Students
    // -----------------------------------------------

    const students = await Student.find({
      branch: subject.branch,
      academicYear: subject.academicYear,
    }).sort({
      rollNo: 1,
    });

    res.status(200).json({
      subject,
      students,
    });
  } catch (error) {
    console.error(
      "Get subject students error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// =====================================================
// GET MARKS FOR A SUBJECT + EXAM
// =====================================================

export const getTeacherMarks = async (req, res) => {
  try {
    const {
      userId,
      subjectId,
      examId,
    } = req.params;

    // -----------------------------------------------
    // Check User
    // -----------------------------------------------

    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can access marks",
      });
    }

    // -----------------------------------------------
    // Find Teacher
    // -----------------------------------------------

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // -----------------------------------------------
    // Find Subject
    // -----------------------------------------------

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // -----------------------------------------------
    // SECURITY CHECK
    // -----------------------------------------------

    if (
      subject.teacher.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to manage this subject",
      });
    }

    // -----------------------------------------------
    // Find Exam
    // -----------------------------------------------

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // -----------------------------------------------
    // Check Exam matches Subject
    // -----------------------------------------------

    if (
      exam.branch !== subject.branch ||
      exam.academicYear !== subject.academicYear ||
      exam.semester !== subject.semester
    ) {
      return res.status(400).json({
        message:
          "This exam does not belong to this subject",
      });
    }

    // -----------------------------------------------
    // Get Students
    // -----------------------------------------------

    const students = await Student.find({
      branch: subject.branch,
      academicYear: subject.academicYear,
    }).sort({
      rollNo: 1,
    });

    // -----------------------------------------------
    // Get Existing Marks
    // -----------------------------------------------

    const marks = await Mark.find({
      subject: subject._id,
      exam: exam._id,
    });

    // -----------------------------------------------
    // Combine Students + Marks
    // -----------------------------------------------

    const studentMarks = students.map((student) => {
      const existingMark = marks.find(
        (mark) =>
          mark.student.toString() ===
          student._id.toString()
      );

      return {
        student,
        marks: existingMark
          ? existingMark.marks
          : "",
        maxMarks: existingMark
          ? existingMark.maxMarks
          : 100,
        markId: existingMark
          ? existingMark._id
          : null,
      };
    });

    res.status(200).json({
      subject,
      exam,
      students: studentMarks,
    });
  } catch (error) {
    console.error(
      "Get teacher marks error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch marks",
    });
  }
};

// =====================================================
// ADD / UPDATE MARK
// =====================================================

export const addOrUpdateMark = async (req, res) => {
  try {
    const {
      userId,
      studentId,
      subjectId,
      examId,
      marks,
      maxMarks,
    } = req.body;

    // -----------------------------------------------
    // Validate input
    // -----------------------------------------------

    if (
      !userId ||
      !studentId ||
      !subjectId ||
      !examId ||
      marks === undefined ||
      !maxMarks
    ) {
      return res.status(400).json({
        message: "All mark details are required",
      });
    }

    // -----------------------------------------------
    // Check User
    // -----------------------------------------------

    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can manage marks",
      });
    }

    // -----------------------------------------------
    // Find Teacher
    // -----------------------------------------------

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // -----------------------------------------------
    // Find Subject
    // -----------------------------------------------

    const subject = await Subject.findById(
      subjectId
    );

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // -----------------------------------------------
    // SECURITY CHECK
    // -----------------------------------------------

    if (
      subject.teacher.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to enter marks for this subject",
      });
    }

    // -----------------------------------------------
    // Find Student
    // -----------------------------------------------

    const student = await Student.findById(
      studentId
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // -----------------------------------------------
    // Make sure student belongs to subject
    // -----------------------------------------------

    if (
      student.branch !== subject.branch ||
      student.academicYear !== subject.academicYear
    ) {
      return res.status(400).json({
        message:
          "This student does not belong to this subject",
      });
    }

    // -----------------------------------------------
    // Find Exam
    // -----------------------------------------------

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // -----------------------------------------------
    // Make sure exam matches subject
    // -----------------------------------------------

    if (
      exam.branch !== subject.branch ||
      exam.academicYear !== subject.academicYear ||
      exam.semester !== subject.semester
    ) {
      return res.status(400).json({
        message:
          "This exam does not belong to this subject",
      });
    }

    // -----------------------------------------------
    // Validate Marks
    // -----------------------------------------------

    const numericMarks = Number(marks);
    const numericMaxMarks = Number(maxMarks);

    if (
      Number.isNaN(numericMarks) ||
      Number.isNaN(numericMaxMarks)
    ) {
      return res.status(400).json({
        message: "Marks must be numbers",
      });
    }

    if (
      numericMarks < 0 ||
      numericMarks > numericMaxMarks
    ) {
      return res.status(400).json({
        message:
          "Marks must be between 0 and maximum marks",
      });
    }

    // -----------------------------------------------
    // Find Existing Mark
    // -----------------------------------------------

    let mark = await Mark.findOne({
      student: student._id,
      subject: subject._id,
      exam: exam._id,
    });

    // -----------------------------------------------
    // Update Existing Mark
    // -----------------------------------------------

    if (mark) {
      mark.marks = numericMarks;
      mark.maxMarks = numericMaxMarks;
      mark.enteredBy = user._id;

      await mark.save();

      return res.status(200).json({
        message: "Marks updated successfully",
        mark,
      });
    }

    // -----------------------------------------------
    // Create New Mark
    // -----------------------------------------------

    mark = await Mark.create({
      student: student._id,
      subject: subject._id,
      exam: exam._id,
      marks: numericMarks,
      maxMarks: numericMaxMarks,
      enteredBy: user._id,
    });

    res.status(201).json({
      message: "Marks added successfully",
      mark,
    });
  } catch (error) {
    console.error(
      "Add/update marks error:",
      error
    );

    res.status(500).json({
      message: "Failed to save marks",
    });
  }
};