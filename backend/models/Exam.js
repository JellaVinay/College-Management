import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },

    examCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      trim: true,
    },

    examDate: {
      type: Date,
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

const Exam = mongoose.model("Exam", examSchema);

export default Exam;