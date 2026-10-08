import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";

// =====================================================
// GET ALL STUDENTS
// =====================================================

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "userId")
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// =====================================================
// GET STUDENT BY USER ID
// =====================================================

export const getStudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      userId,
      role: "student",
    });

    if (!user) {
      return res.status(404).json({
        message: "Student user account not found",
      });
    }

    const student = await Student.findOne({
      user: user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get student by user ID error:", error);

    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// =====================================================
// GET STUDENT BY ID
// =====================================================

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("user", "userId role");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get student error:", error);

    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
};

// =====================================================
// UPDATE STUDENT
// =====================================================

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      email,
      phoneNo,
      branch,
      academicYear,
      semester,
    } = req.body;

    if (
      !name ||
      !rollNo ||
      !email ||
      !phoneNo ||
      !branch ||
      !academicYear ||
      !semester
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check whether another student already uses this roll number
    const existingStudent = await Student.findOne({
      rollNo,
      _id: { $ne: req.params.id },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Another student already uses this roll number",
      });
    }

    // Check User ID
    const existingUser = await User.findOne({
      userId: rollNo,
      _id: { $ne: student.user },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This Student ID is already being used",
      });
    }

    // Update Student profile
    student.name = name;
    student.rollNo = rollNo;
    student.email = email;
    student.phoneNo = phoneNo;
    student.branch = branch;
    student.academicYear = academicYear;
    student.semester = semester;

    await student.save();

    // Update login account
    const user = await User.findById(student.user);

    if (user) {
      user.name = name;
      user.userId = rollNo;

      await user.save();
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE STUDENT
// =====================================================

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Delete the student's login account
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }

    // Delete the student's profile
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
};

// =====================================================
// CREATE STUDENT
// =====================================================

export const createStudent = async (req, res) => {
  let createdUser = null;

  try {
    const {
      name,
      rollNo,
      email,
      phoneNo,
      branch,
      academicYear,
      semester,
      password,
    } = req.body;

    if (
      !name ||
      !rollNo ||
      !email ||
      !phoneNo ||
      !branch ||
      !academicYear ||
      !semester ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check whether roll number already exists
    const existingStudent = await Student.findOne({ rollNo });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this roll number already exists",
      });
    }

    // Check whether User ID already exists
    const existingUser = await User.findOne({
      userId: rollNo,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User ID already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login account
    createdUser = await User.create({
      name,
      userId: rollNo,
      password: hashedPassword,
      role: "student",
    });

    // Create student profile
    const student = await Student.create({
      user: createdUser._id,
      rollNo,
      name,
      email,
      phoneNo,
      branch,
      academicYear,
      semester,
    });

    res.status(201).json({
      message: "Student created successfully",
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        phoneNo: student.phoneNo,
        branch: student.branch,
        academicYear: student.academicYear,
        semester: student.semester,
      },
    });
  } catch (error) {
    console.error("Create student error:", error);

    // If User was created but Student creation failed,
    // delete the User to prevent an orphan account.
    if (createdUser) {
      try {
        await User.findByIdAndDelete(createdUser._id);
        console.log("Orphan student user account deleted");
      } catch (cleanupError) {
        console.error(
          "Failed to clean up user account:",
          cleanupError
        );
      }
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};