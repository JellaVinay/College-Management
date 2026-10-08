import StudentAttendance from "../models/StudentAttendance.js";
import ClassSession from "../models/ClassSession.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import SubjectAssignment from "../models/SubjectAssignment.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import CollegeHoliday from "../models/CollegeHoliday.js";

// ============================================================
// HELPER: Convert YYYY-MM-DD into local midnight
// ============================================================

const getLocalDate = (dateString) => {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

// ============================================================
// 1. GET TEACHER'S ASSIGNED SUBJECTS
// ============================================================

export const getTeacherAssignedSubjects = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      userId,
      role: "teacher",
    });

    if (!user) {
      return res.status(403).json({
        message: "Teacher access denied",
      });
    }

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    const assignments =
      await SubjectAssignment.find({
        teacher: teacher._id,
      })
        .populate(
          "subject",
          "subjectName subjectCode branch semester"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        )
        .sort({
          academicYear: -1,
          semester: 1,
        });

    const subjects = assignments.map(
      (assignment) => ({
        _id: assignment._id,

        assignmentId: assignment._id,

        subjectId:
          assignment.subject?._id,

        subjectName:
          assignment.subject?.subjectName,

        subjectCode:
          assignment.subject?.subjectCode,

        branch: assignment.branch,

        semester: assignment.semester,

        academicYear:
          assignment.academicYear,

        teacher: assignment.teacher
          ? {
              _id: assignment.teacher._id,
              teacherId:
                assignment.teacher.teacherId,
              name: assignment.teacher.name,
              department:
                assignment.teacher.department,
              designation:
                assignment.teacher.designation,
            }
          : null,
      })
    );

    res.status(200).json({
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
      },

      subjects,
    });
  } catch (error) {
    console.error(
      "Get teacher assigned subjects error:",
      error
    );

    res.status(500).json({
      message: "Failed to get teacher subjects",
      error: error.message,
    });
  }
};

// ============================================================
// 2. GET STUDENTS FOR A SUBJECT ASSIGNMENT
// ============================================================

export const getStudentsForSubjectAssignment = async (
  req,
  res
) => {
  try {
    const {
      userId,
      subjectId,
    } = req.params;

    const user = await User.findOne({
      userId,
      role: "teacher",
    });

    if (!user) {
      return res.status(403).json({
        message: "Teacher access denied",
      });
    }

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // subjectId represents SubjectAssignment ID.

    const assignment =
      await SubjectAssignment.findById(
        subjectId
      )
        .populate(
          "subject",
          "subjectName subjectCode branch semester"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        );

    if (!assignment) {
      return res.status(404).json({
        message: "Subject assignment not found",
      });
    }

    // Teacher ownership check.

    if (
      assignment.teacher._id.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not assigned to this subject",
      });
    }

    // Students are selected using:
    // Branch + Semester + Academic Year

    const students = await Student.find({
      branch: assignment.branch,
      academicYear:
        assignment.academicYear,
      semester: assignment.semester,
    }).sort({
      rollNo: 1,
    });

    res.status(200).json({
      subject: {
        id: assignment.subject._id,

        assignmentId: assignment._id,

        subjectName:
          assignment.subject.subjectName,

        subjectCode:
          assignment.subject.subjectCode,

        branch: assignment.branch,

        academicYear:
          assignment.academicYear,

        semester:
          assignment.semester,

        teacher: assignment.teacher
          ? {
              id: assignment.teacher._id,
              teacherId:
                assignment.teacher.teacherId,
              name: assignment.teacher.name,
            }
          : null,
      },

      students,
    });
  } catch (error) {
    console.error(
      "Get subject assignment students error:",
      error
    );

    res.status(500).json({
      message: "Failed to get students",
      error: error.message,
    });
  }
};

// ============================================================
// 3. CREATE / UPDATE CLASS SESSION
// ============================================================

export const saveClassSession = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const {
      subjectId,
      date,
      status,
      reason,
    } = req.body;

    const user = await User.findOne({
      userId,
      role: "teacher",
    });

    if (!user) {
      return res.status(403).json({
        message: "Teacher access denied",
      });
    }

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // subjectId = SubjectAssignment ID

    const assignment =
      await SubjectAssignment.findById(
        subjectId
      )
        .populate(
          "subject",
          "subjectName subjectCode branch semester"
        )
        .populate(
          "teacher",
          "teacherId name department designation"
        );

    if (!assignment) {
      return res.status(404).json({
        message: "Subject assignment not found",
      });
    }

    // Teacher ownership check.

    if (
      assignment.teacher._id.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not assigned to this subject",
      });
    }

    if (
      !["Conducted", "Not Conducted"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message: "Invalid class status",
      });
    }

    const classDate =
      getLocalDate(date);

    if (!classDate) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // College holiday check.

    const nextDate =
      new Date(classDate);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    const holiday =
      await CollegeHoliday.findOne({
        date: {
          $gte: classDate,
          $lt: nextDate,
        },
      });

    if (holiday) {
      return res.status(400).json({
        message:
          `College holiday: ${holiday.name}`,
      });
    }

    // ClassSession currently stores Subject.
    // This preserves the existing route behavior.

    const classSession =
      await ClassSession.findOneAndUpdate(
        {
          subject:
            assignment.subject._id,
          date: classDate,
        },
        {
          subject:
            assignment.subject._id,

          teacher: teacher._id,

          date: classDate,

          status,

          reason:
            status === "Not Conducted"
              ? reason || ""
              : "",

          markedBy: user._id,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    // If class changes to Not Conducted,
    // remove previous student attendance.

    if (status === "Not Conducted") {
      await StudentAttendance.deleteMany({
        classSession:
          classSession._id,
      });
    }

    res.status(200).json({
      message:
        "Class session saved successfully",

      classSession,

      assignment: {
        assignmentId:
          assignment._id,

        subjectId:
          assignment.subject._id,

        subjectName:
          assignment.subject.subjectName,

        subjectCode:
          assignment.subject.subjectCode,

        branch:
          assignment.branch,

        semester:
          assignment.semester,

        academicYear:
          assignment.academicYear,
      },
    });
  } catch (error) {
    console.error(
      "Create class session error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to save class session",

      error: error.message,
    });
  }
};

// ============================================================
// 4. SAVE STUDENT ATTENDANCE
// ============================================================

export const saveStudentAttendance = async (
  req,
  res
) => {
  try {
    const {
      userId,
      classSessionId,
    } = req.params;

    const { attendance } =
      req.body;

    if (!Array.isArray(attendance)) {
      return res.status(400).json({
        message:
          "Attendance must be an array",
      });
    }

    const user = await User.findOne({
      userId,
      role: "teacher",
    });

    if (!user) {
      return res.status(403).json({
        message: "Teacher access denied",
      });
    }

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    const classSession =
      await ClassSession.findById(
        classSessionId
      );

    if (!classSession) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }

    if (
      classSession.status !== "Conducted"
    ) {
      return res.status(400).json({
        message:
          "Attendance cannot be marked because the class was not conducted",
      });
    }

    // Teacher ownership.

    if (
      classSession.teacher.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot mark attendance for this class",
      });
    }

    const subject =
      await Subject.findById(
        classSession.subject
      );

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Find assignment for this teacher and subject.

    const assignment =
      await SubjectAssignment.findOne({
        subject: subject._id,
        teacher: teacher._id,
      });

    if (!assignment) {
      return res.status(404).json({
        message:
          "Subject assignment not found",
      });
    }

    const savedAttendance = [];

    for (const record of attendance) {
      const {
        studentId,
        status,
      } = record;

      if (
        !["Present", "Absent"].includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid student attendance status",
        });
      }

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            `Student not found: ${studentId}`,
        });
      }

      // Student must match:
      // Branch + Semester + Academic Year

      if (
        student.branch !==
          assignment.branch ||
        student.semester !==
          assignment.semester ||
        student.academicYear !==
          assignment.academicYear
      ) {
        return res.status(400).json({
          message:
            `${student.name} does not belong to this subject assignment`,
        });
      }

      const attendanceRecord =
        await StudentAttendance.findOneAndUpdate(
          {
            student: student._id,

            subject: subject._id,

            classSession:
              classSession._id,
          },
          {
            student: student._id,

            subject: subject._id,

            teacher: teacher._id,

            classSession:
              classSession._id,

            date: classSession.date,

            status,

            markedBy: user._id,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      savedAttendance.push(
        attendanceRecord
      );
    }

    res.status(200).json({
      message:
        "Student attendance saved successfully",

      classSession,

      attendance:
        savedAttendance,
    });
  } catch (error) {
    console.error(
      "Save student attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to save student attendance",

      error: error.message,
    });
  }
};

// ============================================================
// 5. GET CLASS SESSION + EXISTING ATTENDANCE
// ============================================================

export const getClassAttendance = async (
  req,
  res
) => {
  try {
    const {
      userId,
      subjectId,
      date,
    } = req.params;

    const user = await User.findOne({
      userId,
      role: "teacher",
    });

    if (!user) {
      return res.status(403).json({
        message: "Teacher access denied",
      });
    }

    const teacher = await Teacher.findOne({
      user: user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // subjectId = SubjectAssignment ID

    const assignment =
      await SubjectAssignment.findById(
        subjectId
      )
        .populate(
          "subject",
          "subjectName subjectCode branch semester"
        )
        .populate(
          "teacher",
          "teacherId name"
        );

    if (!assignment) {
      return res.status(404).json({
        message:
          "Subject assignment not found",
      });
    }

    if (
      assignment.teacher._id.toString() !==
      teacher._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not assigned to this subject",
      });
    }

    const selectedDate =
      getLocalDate(date);

    if (!selectedDate) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    const nextDate =
      new Date(selectedDate);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    const holiday =
      await CollegeHoliday.findOne({
        date: {
          $gte: selectedDate,
          $lt: nextDate,
        },
      });

    if (holiday) {
      return res.status(200).json({
        isHoliday: true,

        holiday,

        classSession: null,

        attendance: [],

        students: [],
      });
    }

    const classSession =
      await ClassSession.findOne({
        subject:
          assignment.subject._id,

        date: selectedDate,
      });

    const students =
      await Student.find({
        branch:
          assignment.branch,

        academicYear:
          assignment.academicYear,

        semester:
          assignment.semester,
      }).sort({
        rollNo: 1,
      });

    if (!classSession) {
      return res.status(200).json({
        isHoliday: false,

        classSession: null,

        attendance: [],

        students,

        assignment: {
          assignmentId:
            assignment._id,

          subjectId:
            assignment.subject._id,

          subjectName:
            assignment.subject.subjectName,

          subjectCode:
            assignment.subject.subjectCode,

          branch:
            assignment.branch,

          semester:
            assignment.semester,

          academicYear:
            assignment.academicYear,
        },
      });
    }

    const attendance =
      await StudentAttendance.find({
        classSession:
          classSession._id,
      });

    res.status(200).json({
      isHoliday: false,

      classSession,

      attendance,

      students,

      assignment: {
        assignmentId:
          assignment._id,

        subjectId:
          assignment.subject._id,

        subjectName:
          assignment.subject.subjectName,

        subjectCode:
          assignment.subject.subjectCode,

        branch:
          assignment.branch,

        semester:
          assignment.semester,

        academicYear:
          assignment.academicYear,
      },
    });
  } catch (error) {
    console.error(
      "Get class attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get class attendance",

      error: error.message,
    });
  }
};

// ============================================================
// 6. STUDENT MONTHLY ATTENDANCE DETAILS
// ============================================================

export const getStudentMonthlyAttendance =
  async (req, res) => {
    try {
      const { studentId } =
        req.params;

      const { year, month } =
        req.query;

      // -------------------------------------------------
      // 1. Validate year/month
      // -------------------------------------------------

      const selectedYear =
        Number(year);

      const selectedMonth =
        Number(month);

      if (
        !Number.isInteger(
          selectedYear
        ) ||
        !Number.isInteger(
          selectedMonth
        ) ||
        selectedMonth < 1 ||
        selectedMonth > 12
      ) {
        return res.status(400).json({
          message:
            "Valid year and month are required.",
        });
      }

      // -------------------------------------------------
      // 2. Find student
      // -------------------------------------------------

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found.",
        });
      }

      // -------------------------------------------------
      // 3. Create month date range
      // -------------------------------------------------

      const startDate =
        new Date(
          `${selectedYear}-${String(
            selectedMonth
          ).padStart(
            2,
            "0"
          )}-01T00:00:00`
        );

      const nextMonthDate =
        new Date(
          selectedYear,
          selectedMonth,
          1,
          0,
          0,
          0,
          0
        );

      const endDate =
        new Date(nextMonthDate);

      endDate.setMilliseconds(-1);

      // -------------------------------------------------
      // 4. Get subject assignments
      // -------------------------------------------------

      const assignments =
        await SubjectAssignment.find({
          branch:
            student.branch,

          semester:
            student.semester,

          academicYear:
            student.academicYear,
        })
          .populate(
            "subject",
            "subjectName subjectCode branch semester"
          )
          .populate(
            "teacher",
            "teacherId name"
          )
          .sort({
            "subject.subjectName": 1,
          });

      // -------------------------------------------------
      // 5. Create subject list
      // -------------------------------------------------

      const subjectColumns =
        assignments.map(
          (assignment) => ({
            id:
              assignment.subject._id,

            assignmentId:
              assignment._id,

            subjectName:
              assignment.subject
                .subjectName,

            subjectCode:
              assignment.subject
                .subjectCode,

            semester:
              assignment.semester,

            teacher:
              assignment.teacher
                ? {
                    id:
                      assignment.teacher
                        ._id,

                    teacherId:
                      assignment.teacher
                        .teacherId,

                    name:
                      assignment.teacher
                        .name,
                  }
                : null,
          })
        );

      // -------------------------------------------------
      // Subject IDs
      // -------------------------------------------------

      const subjectIds =
        assignments.map(
          (assignment) =>
            assignment.subject._id
        );

      // -------------------------------------------------
      // 6. Get class sessions
      // -------------------------------------------------

      const classSessions =
        await ClassSession.find({
          subject: {
            $in: subjectIds,
          },

          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }).sort({
          date: 1,
        });

      // -------------------------------------------------
      // 7. Get attendance
      // -------------------------------------------------

      const studentAttendance =
        await StudentAttendance.find({
          student:
            student._id,

          subject: {
            $in: subjectIds,
          },

          date: {
            $gte: startDate,
            $lte: endDate,
          },
        });

      // -------------------------------------------------
      // 8. Get college holidays
      // -------------------------------------------------

      const holidays =
        await CollegeHoliday.find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }).sort({
          date: 1,
        });

      // -------------------------------------------------
      // 9. Date helpers
      // -------------------------------------------------

      const formatDateKey =
        (date) => {
          const year =
            date.getFullYear();

          const month =
            String(
              date.getMonth() + 1
            ).padStart(2, "0");

          const day =
            String(
              date.getDate()
            ).padStart(2, "0");

          return `${year}-${month}-${day}`;
        };

      const formatDisplayDate =
        (date) => {
          const day =
            String(
              date.getDate()
            ).padStart(2, "0");

          const month =
            String(
              date.getMonth() + 1
            ).padStart(2, "0");

          const year =
            date.getFullYear();

          return `${day}-${month}-${year}`;
        };

      // -------------------------------------------------
      // 10. Holiday map
      // -------------------------------------------------

      const holidayMap =
        new Map();

      holidays.forEach(
        (holiday) => {
          const date =
            new Date(
              holiday.date
            );

          holidayMap.set(
            formatDateKey(date),
            {
              name:
                holiday.name,

              reason:
                holiday.reason || "",
            }
          );
        }
      );

      // -------------------------------------------------
      // 11. Session map
      // Key: date + subject
      // -------------------------------------------------

      const sessionMap =
        new Map();

      classSessions.forEach(
        (session) => {
          const date =
            new Date(
              session.date
            );

          const key =
            `${formatDateKey(
              date
            )}_${session.subject.toString()}`;

          sessionMap.set(
            key,
            session
          );
        }
      );

      // -------------------------------------------------
      // 12. Attendance map
      // -------------------------------------------------

      const attendanceMap =
        new Map();

      studentAttendance.forEach(
        (attendance) => {
          const date =
            new Date(
              attendance.date
            );

          const key =
            `${formatDateKey(
              date
            )}_${attendance.subject.toString()}`;

          attendanceMap.set(
            key,
            attendance
          );
        }
      );

      // -------------------------------------------------
      // 13. Create every day
      // -------------------------------------------------

      const daysInMonth =
        new Date(
          selectedYear,
          selectedMonth,
          0
        ).getDate();

      const dailyRows = [];

      const subjectTotals = {};

      assignments.forEach(
        (assignment) => {
          const subjectId =
            assignment.subject._id.toString();

          subjectTotals[
            subjectId
          ] = {
            subjectId:
              assignment.subject._id,

            subjectName:
              assignment.subject
                .subjectName,

            subjectCode:
              assignment.subject
                .subjectCode,

            attended: 0,

            conducted: 0,

            percentage: 0,
          };
        }
      );

      let overallAttended = 0;

      let overallConducted = 0;

      let workingDays = 0;

      // -------------------------------------------------
      // 14. Process every day
      // -------------------------------------------------

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const currentDate =
          new Date(
            selectedYear,
            selectedMonth - 1,
            day,
            0,
            0,
            0,
            0
          );

        const dateKey =
          formatDateKey(
            currentDate
          );

        const dayOfWeek =
          currentDate.getDay();

        // Sunday

        if (dayOfWeek === 0) {
          dailyRows.push({
            date: dateKey,

            displayDate:
              formatDisplayDate(
                currentDate
              ),

            day:
              currentDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                }
              ),

            type: "Sunday",

            subjects: {},

            dailyTotal: {
              attended: 0,
              conducted: 0,
              display: "-",
            },
          });

          continue;
        }

        // College holiday

        const holiday =
          holidayMap.get(
            dateKey
          );

        if (holiday) {
          const holidaySubjects =
            {};

          assignments.forEach(
            (assignment) => {
              const subjectId =
                assignment.subject._id.toString();

              holidaySubjects[
                subjectId
              ] = {
                status: "Holiday",

                display:
                  holiday.name,

                reason:
                  holiday.reason,
              };
            }
          );

          dailyRows.push({
            date: dateKey,

            displayDate:
              formatDisplayDate(
                currentDate
              ),

            day:
              currentDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                }
              ),

            type: "Holiday",

            holiday: {
              name:
                holiday.name,

              reason:
                holiday.reason,
            },

            subjects:
              holidaySubjects,

            dailyTotal: {
              attended: 0,
              conducted: 0,
              display: "-",
            },
          });

          continue;
        }

        // Monday-Saturday = college working day.

        workingDays++;

        const dailySubjects =
          {};

        let dailyAttended = 0;

        let dailyConducted = 0;

        assignments.forEach(
          (assignment) => {
            const subjectId =
              assignment.subject._id.toString();

            const sessionKey =
              `${dateKey}_${subjectId}`;

            const session =
              sessionMap.get(
                sessionKey
              );

            // No class record.

            if (!session) {
              dailySubjects[
                subjectId
              ] = {
                status: "No Class",

                display: "-",
              };

              return;
            }

            // Not conducted.

            if (
              session.status ===
              "Not Conducted"
            ) {
              dailySubjects[
                subjectId
              ] = {
                status:
                  "Not Conducted",

                display:
                  `NC - ${
                    session.reason ||
                    "Class not conducted"
                  }`,

                reason:
                  session.reason ||
                  "Class not conducted",
              };

              return;
            }

            // Conducted class.

            const attendanceKey =
              `${dateKey}_${subjectId}`;

            const attendance =
              attendanceMap.get(
                attendanceKey
              );

            if (!attendance) {
              dailySubjects[
                subjectId
              ] = {
                status:
                  "Attendance Not Recorded",

                display: "N/R",
              };

              return;
            }

            dailyConducted++;

            overallConducted++;

            if (
              subjectTotals[
                subjectId
              ]
            ) {
              subjectTotals[
                subjectId
              ].conducted++;
            }

            if (
              attendance.status ===
              "Present"
            ) {
              dailyAttended++;

              overallAttended++;

              if (
                subjectTotals[
                  subjectId
                ]
              ) {
                subjectTotals[
                  subjectId
                ].attended++;
              }

              dailySubjects[
                subjectId
              ] = {
                status: "Present",

                display: "P",
              };
            } else {
              dailySubjects[
                subjectId
              ] = {
                status: "Absent",

                display: "A",
              };
            }
          }
        );

        dailyRows.push({
          date: dateKey,

          displayDate:
            formatDisplayDate(
              currentDate
            ),

          day:
            currentDate.toLocaleDateString(
              "en-US",
              {
                weekday: "long",
              }
            ),

          type: "Working Day",

          subjects:
            dailySubjects,

          dailyTotal: {
            attended:
              dailyAttended,

            conducted:
              dailyConducted,

            display:
              dailyConducted > 0
                ? `${dailyAttended}/${dailyConducted}`
                : "-",
          },
        });
      }

      // -------------------------------------------------
      // 15. Subject percentages
      // -------------------------------------------------

      Object.values(
        subjectTotals
      ).forEach(
        (subject) => {
          if (
            subject.conducted > 0
          ) {
            subject.percentage =
              Number(
                (
                  (subject.attended /
                    subject.conducted) *
                  100
                ).toFixed(2)
              );
          }
        }
      );

      // -------------------------------------------------
      // 16. Overall percentage
      // -------------------------------------------------

      const overallPercentage =
        overallConducted > 0
          ? Number(
              (
                (overallAttended /
                  overallConducted) *
                100
              ).toFixed(2)
            )
          : 0;

      // -------------------------------------------------
      // 17. Send response
      // -------------------------------------------------

      res.status(200).json({
        student: {
          id: student._id,

          rollNo:
            student.rollNo,

          name:
            student.name,

          branch:
            student.branch,

          academicYear:
            student.academicYear,

          semester:
            student.semester,
        },

        month: {
          year:
            selectedYear,

          month:
            selectedMonth,

          daysInMonth,
        },

        subjects:
          subjectColumns,

        workingDays,

        subjectTotals:
          Object.values(
            subjectTotals
          ),

        overall: {
          attended:
            overallAttended,

          conducted:
            overallConducted,

          percentage:
            overallPercentage,
        },

        holidays:
          holidays.map(
            (holiday) => ({
              id:
                holiday._id,

              date:
                formatDateKey(
                  new Date(
                    holiday.date
                  )
                ),

              name:
                holiday.name,

              reason:
                holiday.reason || "",
            })
          ),

        attendance:
          dailyRows,
      });
    } catch (error) {
      console.error(
        "Student monthly attendance error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to load student monthly attendance.",

        error:
          error.message,
      });
    }
  };