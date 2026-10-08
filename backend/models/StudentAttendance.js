import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    classSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

studentAttendanceSchema.index(
  {
    student: 1,
    subject: 1,
    classSession: 1,
  },
  {
    unique: true,
  }
);

const StudentAttendance = mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema
);

export default StudentAttendance;