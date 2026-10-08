import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Holiday"],
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

// One attendance record per teacher per date
teacherAttendanceSchema.index(
  {
    teacher: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const TeacherAttendance = mongoose.model(
  "TeacherAttendance",
  teacherAttendanceSchema
);

export default TeacherAttendance;