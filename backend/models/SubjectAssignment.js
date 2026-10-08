import mongoose from "mongoose";

const subjectAssignmentSchema = new mongoose.Schema(
  {
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

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent the same subject from being assigned
// twice to the same teacher/batch combination.
subjectAssignmentSchema.index(
  {
    subject: 1,
    teacher: 1,
    branch: 1,
    semester: 1,
    academicYear: 1,
  },
  { unique: true }
);

const SubjectAssignment = mongoose.model(
  "SubjectAssignment",
  subjectAssignmentSchema
);

export default SubjectAssignment;