import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

/*
  GET ALL TEACHERS
*/
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "userId role")
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);

    res.status(500).json({
      message: "Failed to fetch teachers",
    });
  }
};

/*
  GET ONE TEACHER
*/
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("user", "userId role");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Get teacher error:", error);

    res.status(500).json({
      message: "Failed to fetch teacher",
    });
  }
};

/*
  UPDATE TEACHER
*/
export const updateTeacher = async (req, res) => {
  try {
    const {
      name,
      teacherId,
      email,
      phoneNo,
      department,
      designation,
    } = req.body;

    if (
      !name ||
      !teacherId ||
      !email ||
      !phoneNo ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const existingTeacher = await Teacher.findOne({
      teacherId,
      _id: { $ne: req.params.id },
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Another teacher already uses this ID",
      });
    }

    const existingUser = await User.findOne({
      userId: teacherId,
      _id: { $ne: teacher.user },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This Teacher ID is already being used",
      });
    }

    teacher.name = name;
    teacher.teacherId = teacherId;
    teacher.email = email;
    teacher.phoneNo = phoneNo;
    teacher.department = department;
    teacher.designation = designation;

    await teacher.save();

    const user = await User.findById(teacher.user);

    if (user) {
      user.name = name;
      user.userId = teacherId;

      await user.save();
    }

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("Update teacher error:", error);

    res.status(500).json({
      message: "Failed to update teacher",
    });
  }
};

/*
  DELETE TEACHER
*/
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Delete linked login account
    if (teacher.user) {
      await User.findByIdAndDelete(teacher.user);
    }

    // Delete teacher profile
    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Delete teacher error:", error);

    res.status(500).json({
      message: "Failed to delete teacher",
    });
  }
};

/*
  CREATE TEACHER
*/
export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      teacherId,
      email,
      phoneNo,
      department,
      designation,
      password,
    } = req.body;

    if (
      !name ||
      !teacherId ||
      !email ||
      !phoneNo ||
      !department ||
      !designation ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Teacher ID
    const existingTeacher = await Teacher.findOne({
      teacherId,
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher with this ID already exists",
      });
    }

    // Check User ID
    const existingUser = await User.findOne({
      userId: teacherId,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User ID already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login account
    const user = await User.create({
      name,
      userId: teacherId,
      password: hashedPassword,
      role: "teacher",
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      user: user._id,
      teacherId,
      name,
      email,
      phoneNo,
      department,
      designation,
    });

    res.status(201).json({
      message: "Teacher created successfully",

      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        email: teacher.email,
        phoneNo: teacher.phoneNo,
        department: teacher.department,
        designation: teacher.designation,
      },
    });
  } catch (error) {
    console.error("Create teacher error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};