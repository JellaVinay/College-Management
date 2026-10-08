import mongoose from "mongoose";

const collegeHolidaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
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

const CollegeHoliday = mongoose.model(
  "CollegeHoliday",
  collegeHolidaySchema
);

export default CollegeHoliday;