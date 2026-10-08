import TeacherAttendance from "../models/TeacherAttendance.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import CollegeHoliday from "../models/CollegeHoliday.js";

// =====================================================
// ADMIN - GET TODAY'S TEACHER ATTENDANCE
// =====================================================

export const getTodayTeacherAttendance = async (req, res) => {
  try {
    const { adminUserId, date } = req.query;

    // -----------------------------------------------
    // Check Admin
    // -----------------------------------------------

    if (!adminUserId) {
      return res.status(400).json({
        message: "Admin user ID is required",
      });
    }

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can manage teacher attendance",
      });
    }

    // -----------------------------------------------
    // Date
    // -----------------------------------------------

    const selectedDate = date
      ? new Date(date)
      : new Date();

    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    // -----------------------------------------------
    // Get All Teachers
    // -----------------------------------------------

    const teachers = await Teacher.find()
      .sort({ teacherId: 1 });

    // -----------------------------------------------
    // Get Attendance
    // -----------------------------------------------

    const attendance =
      await TeacherAttendance.find({
        date: {
          $gte: selectedDate,
          $lt: nextDate,
        },
      });

    // -----------------------------------------------
    // Combine Teachers + Attendance
    // -----------------------------------------------

    const result = teachers.map((teacher) => {
      const record = attendance.find(
        (item) =>
          item.teacher.toString() ===
          teacher._id.toString()
      );

      return {
        teacher: {
          id: teacher._id,
          teacherId: teacher.teacherId,
          name: teacher.name,
          department: teacher.department,
          designation: teacher.designation,
        },

        attendance: record
          ? {
              id: record._id,
              status: record.status,
            }
          : {
              id: null,
              status: null,
            },
      };
    });

    res.status(200).json(result);

  } catch (error) {
    console.error(
      "Get teacher attendance error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch teacher attendance",
    });
  }
};

// =====================================================
// ADMIN - ADD / UPDATE TEACHER ATTENDANCE
// =====================================================

export const saveTeacherAttendance = async (req, res) => {
  try {
    const {
      adminUserId,
      teacherId,
      date,
      status,
    } = req.body;

    // -----------------------------------------------
    // Validate Admin
    // -----------------------------------------------

    if (!adminUserId) {
      return res.status(400).json({
        message: "Admin user ID is required",
      });
    }

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can manage teacher attendance",
      });
    }

    // -----------------------------------------------
    // Validate Data
    // -----------------------------------------------

    if (!teacherId || !date || !status) {
      return res.status(400).json({
        message:
          "Teacher, date and attendance status are required",
      });
    }

    const validStatuses = [
      "Present",
      "Absent",
      "Leave",
      "Holiday",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status",
      });
    }

    // -----------------------------------------------
    // Find Teacher
    // -----------------------------------------------

    const teacher = await Teacher.findById(
      teacherId
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // -----------------------------------------------
    // Normalize Date
    // -----------------------------------------------

    const attendanceDate = new Date(date);

    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    attendanceDate.setHours(0, 0, 0, 0);

    // -----------------------------------------------
    // Create or Update Attendance
    // -----------------------------------------------

    const attendance =
      await TeacherAttendance.findOneAndUpdate(
        {
          teacher: teacher._id,
          date: attendanceDate,
        },
        {
          teacher: teacher._id,
          date: attendanceDate,
          status,
          markedBy: admin._id,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Teacher attendance saved successfully",
      attendance,
    });

  } catch (error) {
    console.error(
      "Save teacher attendance error:",
      error
    );

    res.status(500).json({
      message: "Failed to save teacher attendance",
    });
  }
};

// =====================================================
// ADMIN - GET INDIVIDUAL TEACHER ATTENDANCE
// INCLUDING COLLEGE HOLIDAYS
// =====================================================

export const getTeacherAttendance = async (req, res) => {
  try {
    const {
      teacherId,
      startDate,
      endDate,
      adminUserId,
    } = {
      teacherId: req.params.teacherId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      adminUserId: req.query.adminUserId,
    };

    // -----------------------------------------------
    // Check Admin
    // -----------------------------------------------

    const admin = await User.findOne({
      userId: adminUserId,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only Admin can view teacher attendance",
      });
    }

    // -----------------------------------------------
    // Find Teacher
    // -----------------------------------------------

    const teacher = await Teacher.findById(
      teacherId
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // -----------------------------------------------
    // Date Filter
    // -----------------------------------------------

    const filter = {
      teacher: teacher._id,
    };

    let start = null;
    let end = null;

    if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    // -----------------------------------------------
    // Get Teacher Attendance
    // -----------------------------------------------

    const attendance =
      await TeacherAttendance.find(filter)
        .sort({ date: 1 });

    // -----------------------------------------------
    // Get College Holidays
    // -----------------------------------------------

    let holidays = [];

    if (start && end) {
      holidays = await CollegeHoliday.find({
        date: {
          $gte: start,
          $lte: end,
        },
      }).sort({ date: 1 });
    }

    // -----------------------------------------------
    // Summary
    // -----------------------------------------------

    const summary = {
      present: 0,
      absent: 0,
      leave: 0,
      holiday: holidays.length,
    };

    attendance.forEach((record) => {
      if (record.status === "Present") {
        summary.present++;
      }

      if (record.status === "Absent") {
        summary.absent++;
      }

      if (record.status === "Leave") {
        summary.leave++;
      }
    });

    // -----------------------------------------------
    // College Working Days
    // -----------------------------------------------

    let workingDays = 0;

    if (start && end) {
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const dayOfWeek =
          currentDate.getDay();

        // Sunday is not a working day
        if (dayOfWeek !== 0) {
          const isHoliday =
            holidays.some((holiday) => {
              const holidayDate =
                new Date(holiday.date);

              return (
                holidayDate.getFullYear() ===
                  currentDate.getFullYear() &&
                holidayDate.getMonth() ===
                  currentDate.getMonth() &&
                holidayDate.getDate() ===
                  currentDate.getDate()
              );
            });

          if (!isHoliday) {
            workingDays++;
          }
        }

        currentDate.setDate(
          currentDate.getDate() + 1
        );
      }
    }

    // -----------------------------------------------
    // Attendance Percentage
    // -----------------------------------------------

    const attendancePercentage =
      workingDays > 0
        ? Number(
            (
              (summary.present / workingDays) *
              100
            ).toFixed(2)
          )
        : 0;

    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    res.status(200).json({
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
        department: teacher.department,
        designation: teacher.designation,
      },

      summary,

      workingDays,

      attendancePercentage,

      attendance,

      holidays,
    });

  } catch (error) {
    console.error(
      "Get individual teacher attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch individual teacher attendance",
    });
  }
};