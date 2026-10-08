import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
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

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
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

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// One student can have only one mark
// for a particular subject in a particular exam.

markSchema.index(
  {
    student: 1,
    subject: 1,
    exam: 1,
  },
  {
    unique: true,
  }
);


const Mark = mongoose.model("Mark", markSchema);

export default Mark;