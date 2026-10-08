import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/TeacherAttendanceDetails.css";

const TeacherAttendanceDetails = () => {
  const { teacherId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [month, setMonth] = useState(() => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const [teacher, setTeacher] = useState(null);

  const [attendance, setAttendance] = useState([]);

  const [holidays, setHolidays] = useState([]);

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
  });

  const [workingDays, setWorkingDays] = useState(0);

  const [attendancePercentage, setAttendancePercentage] =
    useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD TEACHER ATTENDANCE
  // =====================================================

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const [year, selectedMonth] = month.split("-");

      const startDate = `${year}-${selectedMonth}-01`;

      const lastDay = new Date(
        Number(year),
        Number(selectedMonth),
        0
      ).getDate();

      const endDate = `${year}-${selectedMonth}-${String(
        lastDay
      ).padStart(2, "0")}`;

      const response = await axios.get(
        `http://localhost:5000/api/teacher-attendance/teacher/${teacherId}`,
        {
          params: {
            adminUserId: user.userId,
            startDate,
            endDate,
          },
        }
      );

      // -----------------------------------------------
      // Teacher
      // -----------------------------------------------

      setTeacher(response.data.teacher);

      // -----------------------------------------------
      // Attendance
      // -----------------------------------------------

      setAttendance(response.data.attendance || []);

      // -----------------------------------------------
      // Summary
      // -----------------------------------------------

      setSummary(
        response.data.summary || {
          present: 0,
          absent: 0,
          leave: 0,
          holiday: 0,
        }
      );

      // -----------------------------------------------
      // Working Days
      // -----------------------------------------------

      setWorkingDays(
        Number(response.data.workingDays) || 0
      );

      // -----------------------------------------------
      // Attendance Percentage
      // -----------------------------------------------

      setAttendancePercentage(
        Number(response.data.attendancePercentage) || 0
      );

      // -----------------------------------------------
      // College Holidays
      // -----------------------------------------------

      setHolidays(response.data.holidays || []);

    } catch (error) {

      console.error(
        "Teacher attendance error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load attendance"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN TEACHER OR MONTH CHANGES
  // =====================================================

  useEffect(() => {
    if (user?.role === "admin") {
      loadAttendance();
    }
  }, [teacherId, month]);

  // =====================================================
  // GET STATUS FOR PARTICULAR DATE
  // =====================================================

  const getStatusForDate = (date) => {

    // -----------------------------------------------
    // First check college-wide holiday
    // -----------------------------------------------

    const holiday = holidays.find((item) => {

      const holidayDate = new Date(item.date);

      return (
        holidayDate.getFullYear() ===
          date.getFullYear() &&
        holidayDate.getMonth() ===
          date.getMonth() &&
        holidayDate.getDate() ===
          date.getDate()
      );
    });

    if (holiday) {
      return "Holiday";
    }

    // -----------------------------------------------
    // Then check teacher attendance
    // -----------------------------------------------

    const record = attendance.find((item) => {

      const recordDate = new Date(item.date);

      return (
        recordDate.getFullYear() ===
          date.getFullYear() &&
        recordDate.getMonth() ===
          date.getMonth() &&
        recordDate.getDate() ===
          date.getDate()
      );
    });

    return record?.status || "";
  };

  // =====================================================
  // GET HOLIDAY NAME
  // =====================================================

  const getHolidayName = (date) => {

    const holiday = holidays.find((item) => {

      const holidayDate = new Date(item.date);

      return (
        holidayDate.getFullYear() ===
          date.getFullYear() &&
        holidayDate.getMonth() ===
          date.getMonth() &&
        holidayDate.getDate() ===
          date.getDate()
      );
    });

    return holiday?.name || "Holiday";
  };

  // =====================================================
  // MONTH INFORMATION
  // =====================================================

  const [year, selectedMonth] = month.split("-");

  const totalDays = new Date(
    Number(year),
    Number(selectedMonth),
    0
  ).getDate();

  const firstDay = new Date(
    Number(year),
    Number(selectedMonth) - 1,
    1
  ).getDay();

  // =====================================================
  // CREATE CALENDAR DAYS
  // =====================================================

  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {

    calendarDays.push(
      new Date(
        Number(year),
        Number(selectedMonth) - 1,
        day
      )
    );

  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="attendance-loading">
        Loading teacher attendance...
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="attendance-error">
        {error}
      </div>
    );
  }

  // =====================================================
  // ACCESS CHECK
  // =====================================================

  if (!user || user.role !== "admin") {
    return (
      <div className="attendance-error">
        Access Denied
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teacher-attendance-details">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <h1>Teacher Attendance Details</h1>

      {/* =================================================
          TEACHER INFORMATION
      ================================================= */}

      {teacher && (
        <div className="teacher-info">

          <h2>{teacher.name}</h2>

          <p>
            <strong>Teacher ID:</strong>{" "}
            {teacher.teacherId}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {teacher.department}
          </p>

          <p>
            <strong>Designation:</strong>{" "}
            {teacher.designation}
          </p>

        </div>
      )}

      {/* =================================================
          MONTH SELECTOR
      ================================================= */}

      <div className="month-selector">

        <label>
          Select Month:
        </label>

        <input
          type="month"
          value={month}
          onChange={(e) =>
            setMonth(e.target.value)
          }
        />

      </div>

      {/* =================================================
          MONTHLY OVERVIEW
      ================================================= */}

      <h2 className="section-title">
        Monthly Attendance Overview
      </h2>

      <div className="attendance-summary">

        {/* Working Days */}

        <div className="summary-card working">

          <span className="summary-label">
            College Working Days
          </span>

          <strong>
            {workingDays}
          </strong>

        </div>

        {/* Present */}

        <div className="summary-card present">

          <span className="summary-label">
            Present
          </span>

          <strong>
            {summary.present}
          </strong>

        </div>

        {/* Absent */}

        <div className="summary-card absent">

          <span className="summary-label">
            Absent
          </span>

          <strong>
            {summary.absent}
          </strong>

        </div>

        {/* Leave */}

        <div className="summary-card leave">

          <span className="summary-label">
            Leave
          </span>

          <strong>
            {summary.leave}
          </strong>

        </div>

        {/* Holidays */}

        <div className="summary-card holiday">

          <span className="summary-label">
            Holidays
          </span>

          <strong>
            {summary.holiday}
          </strong>

        </div>

        {/* Attendance Percentage */}

        <div className="summary-card percentage">

          <span className="summary-label">
            Attendance %
          </span>

          <strong>
            {attendancePercentage}%
          </strong>

        </div>

      </div>

      {/* =================================================
          ATTENDANCE LEGEND
      ================================================= */}

      <div className="attendance-legend">

        <div>
          <span className="legend-box present-color"></span>
          Present
        </div>

        <div>
          <span className="legend-box absent-color"></span>
          Absent
        </div>

        <div>
          <span className="legend-box leave-color"></span>
          Leave
        </div>

        <div>
          <span className="legend-box holiday-color"></span>
          Holiday
        </div>

      </div>

      {/* =================================================
          MONTHLY CALENDAR
      ================================================= */}

      <h2 className="section-title">
        Monthly Attendance Calendar
      </h2>

      <div className="attendance-calendar">

        {/* Calendar Header */}

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (

          <div
            key={day}
            className="calendar-header"
          >
            {day}
          </div>

        ))}

        {/* Calendar Days */}

        {calendarDays.map((date, index) => {

          // Empty calendar cell

          if (!date) {

            return (
              <div
                key={`empty-${index}`}
                className="calendar-empty"
              />
            );

          }

          // ---------------------------------------------
          // Get Status
          // ---------------------------------------------

          const status =
            getStatusForDate(date);

          // ---------------------------------------------
          // Status CSS Class
          // ---------------------------------------------

          let statusClass = "";

          if (status === "Present") {
            statusClass = "status-present";
          }

          if (status === "Absent") {
            statusClass = "status-absent";
          }

          if (status === "Leave") {
            statusClass = "status-leave";
          }

          if (status === "Holiday") {
            statusClass = "status-holiday";
          }

          // ---------------------------------------------
          // Status Text
          // ---------------------------------------------

          let statusText = "Not marked";

          if (status === "Present") {
            statusText = "Present";
          }

          if (status === "Absent") {
            statusText = "Absent";
          }

          if (status === "Leave") {
            statusText = "Leave";
          }

          if (status === "Holiday") {
            statusText = getHolidayName(date);
          }

          // ---------------------------------------------
          // Calendar Cell
          // ---------------------------------------------

          return (

            <div
              key={date.toISOString()}
              className={`calendar-day ${statusClass}`}
            >

              <div className="date-number">
                {date.getDate()}
              </div>

              <div className="attendance-status">
                {statusText}
              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default TeacherAttendanceDetails;