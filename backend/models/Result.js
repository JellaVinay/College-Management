import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    studentId: {
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

    subjects: {
      type: [subjectSchema],
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    maxTotalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
    },

    resultStatus: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;