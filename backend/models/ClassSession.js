import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema(
  {
    subjectAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectAssignment",
      required: true,
    },

    // Keep these for easy access and compatibility
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

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Conducted", "Not Conducted"],
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

classSessionSchema.index(
  { subjectAssignment: 1, date: 1 },
  { unique: true }
);

const ClassSession = mongoose.model("ClassSession", classSessionSchema);

export default ClassSession;