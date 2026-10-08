import Mark from "../models/Mark.js";
import Student from "../models/Student.js";
import Exam from "../models/Exam.js";
import User from "../models/User.js";

// =====================================================
// CALCULATE GRADE
// =====================================================

const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 40) return "E";

  return "F";
};

// =====================================================
// CALCULATE RESULT STATUS
// =====================================================

const calculateStatus = (percentage) => {
  return percentage >= 40 ? "Pass" : "Fail";
};

// =====================================================
// ADMIN - GET ALL RESULTS
// =====================================================

export const getAdminResults = async (req, res) => {
  try {
    const {
      adminUserId,
      branch,
      academicYear,
      rollNo,
      name,
      examId,
    } = req.query;

    // -------------------------------------------------
    // Check Admin
    // -------------------------------------------------

    if (!adminUserId) {
      return res.status(400).json({
        message: "Admin user ID is required",
      });
    }

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can view all results",
      });
    }

    // -------------------------------------------------
    // Student Filters
    // -------------------------------------------------

    const studentFilter = {};

    if (branch) {
      studentFilter.branch = branch;
    }

    if (academicYear) {
      studentFilter.academicYear = academicYear;
    }

    if (rollNo) {
      studentFilter.rollNo = {
        $regex: rollNo,
        $options: "i",
      };
    }

    if (name) {
      studentFilter.name = {
        $regex: name,
        $options: "i",
      };
    }

    const students = await Student.find(
      studentFilter
    ).sort({
      rollNo: 1,
    });

    if (students.length === 0) {
      return res.status(200).json([]);
    }

    // -------------------------------------------------
    // Exam Filter
    // -------------------------------------------------

    const examFilter = {};

    if (examId) {
      examFilter._id = examId;
    }

    // -------------------------------------------------
    // Get Exams
    // -------------------------------------------------

    const exams = await Exam.find(examFilter);

    if (exams.length === 0) {
      return res.status(200).json([]);
    }

    // -------------------------------------------------
    // Create Result List
    // -------------------------------------------------

    const results = [];

    for (const student of students) {
      for (const exam of exams) {
        const marks = await Mark.find({
          student: student._id,
          exam: exam._id,
        })
          .populate(
            "subject",
            "subjectName subjectCode"
          )
          .sort({
            "subject.subjectName": 1,
          });

        // No marks entered yet
        if (marks.length === 0) {
          continue;
        }

        let totalMarks = 0;
        let maxTotalMarks = 0;

        const subjects = marks.map((mark) => {
          totalMarks += mark.marks;
          maxTotalMarks += mark.maxMarks;

          return {
            subjectId: mark.subject?._id,
            subjectName:
              mark.subject?.subjectName || "Unknown",
            subjectCode:
              mark.subject?.subjectCode || "Unknown",
            marks: mark.marks,
            maxMarks: mark.maxMarks,
          };
        });

        const percentage =
          maxTotalMarks > 0
            ? Number(
                (
                  (totalMarks / maxTotalMarks) *
                  100
                ).toFixed(2)
              )
            : 0;

        const grade =
          calculateGrade(percentage);

        const resultStatus =
          calculateStatus(percentage);

        results.push({
          student: {
            id: student._id,
            name: student.name,
            rollNo: student.rollNo,
            branch: student.branch,
            academicYear:
              student.academicYear,
          },

          exam: {
            id: exam._id,
            examName: exam.examName,
            examCode: exam.examCode,
            semester: exam.semester,
            examDate: exam.examDate,
          },

          subjects,

          totalMarks,

          maxTotalMarks,

          percentage,

          grade,

          resultStatus,
        });
      }
    }

    res.status(200).json(results);

  } catch (error) {
    console.error(
      "Admin results error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch results",
    });
  }
};

// =====================================================
// STUDENT - GET OWN RESULTS
// =====================================================

export const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    // -------------------------------------------------
    // Find Student
    // -------------------------------------------------

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // -------------------------------------------------
    // Find Exams For Student
    // -------------------------------------------------

    const exams = await Exam.find({
      branch: student.branch,
      academicYear: student.academicYear,
    }).sort({
      examDate: -1,
    });

    const results = [];

    // -------------------------------------------------
    // Create Result For Each Exam
    // -------------------------------------------------

    for (const exam of exams) {
      const marks = await Mark.find({
        student: student._id,
        exam: exam._id,
      })
        .populate(
          "subject",
          "subjectName subjectCode"
        )
        .sort({
          "subject.subjectName": 1,
        });

      // No marks entered for this exam
      if (marks.length === 0) {
        continue;
      }

      let totalMarks = 0;
      let maxTotalMarks = 0;

      const subjects = marks.map((mark) => {
        totalMarks += mark.marks;
        maxTotalMarks += mark.maxMarks;

        return {
          subjectId: mark.subject?._id,
          subjectName:
            mark.subject?.subjectName || "Unknown",
          subjectCode:
            mark.subject?.subjectCode || "Unknown",
          marks: mark.marks,
          maxMarks: mark.maxMarks,
        };
      });

      // -------------------------------------------------
      // Calculate Percentage
      // -------------------------------------------------

      const percentage =
        maxTotalMarks > 0
          ? Number(
              (
                (totalMarks / maxTotalMarks) *
                100
              ).toFixed(2)
            )
          : 0;

      // -------------------------------------------------
      // Calculate Grade & Status
      // -------------------------------------------------

      const grade =
        calculateGrade(percentage);

      const resultStatus =
        calculateStatus(percentage);

      // -------------------------------------------------
      // Add Result
      // -------------------------------------------------

      results.push({
        exam: {
          id: exam._id,
          examName: exam.examName,
          examCode: exam.examCode,
          semester: exam.semester,
          examDate: exam.examDate,
        },

        subjects,

        totalMarks,

        maxTotalMarks,

        percentage,

        grade,

        resultStatus,
      });
    }

    // -------------------------------------------------
    // Send Response
    // -------------------------------------------------

    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        academicYear:
          student.academicYear,
      },

      results,
    });

  } catch (error) {
    console.error(
      "Student results error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch student results",
    });
  }
};