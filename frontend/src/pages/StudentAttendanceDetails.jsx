import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StudentAttendanceDetails.css";

function StudentAttendanceDetails() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    fetchStudentAndAttendance();
  }, [year, month]);

  const fetchStudentAndAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.userId) {
        setError("Student login information not found.");
        return;
      }

      // -----------------------------------------
      // 1. Get logged-in student's details
      // -----------------------------------------

      const studentResponse = await axios.get(
        `http://localhost:5000/api/students/user/${user.userId}`
      );

      const studentData = studentResponse.data;

      setStudent(studentData);

      // -----------------------------------------
      // 2. Get ONLY this student's attendance
      // -----------------------------------------

      const attendanceResponse = await axios.get(
        `http://localhost:5000/api/student-attendance/student/${studentData._id}/month`,
        {
          params: {
            year,
            month,
          },
        }
      );

      setAttendanceData(attendanceResponse.data);
    } catch (error) {
      console.error("Student attendance error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return <h2>Loading attendance...</h2>;
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (error) {
    return (
      <div>
        <h2>Attendance</h2>
        <p>{error}</p>
      </div>
    );
  }

  // -----------------------------------------
  // Month name
  // -----------------------------------------

  const monthName = new Date(
    year,
    month - 1,
    1
  ).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="student-attendance-page">

      <h1>Attendance</h1>

      {/* =========================================
          STUDENT DETAILS
      ========================================== */}

      <div className="student-attendance-student-details">

        <h2>Student Details</h2>

        <p>
          <strong>Name:</strong> {student?.name}
        </p>

        <p>
          <strong>Roll No:</strong> {student?.rollNo}
        </p>

        <p>
          <strong>Branch:</strong> {student?.branch}
        </p>

        <p>
          <strong>Academic Year:</strong>{" "}
          {student?.academicYear}
        </p>

      </div>

      {/* =========================================
          MONTH SELECTOR
      ========================================== */}

      <div className="attendance-month-selector">

        <label>
          <strong>Month:</strong>{" "}
        </label>

        <select
          value={month}
          onChange={(e) =>
            setMonth(Number(e.target.value))
          }
        >
          {Array.from(
            { length: 12 },
            (_, index) => index + 1
          ).map((monthNumber) => (
            <option
              key={monthNumber}
              value={monthNumber}
            >
              {new Date(
                year,
                monthNumber - 1,
                1
              ).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) =>
            setYear(Number(e.target.value))
          }
        >
          <option value={year - 1}>
            {year - 1}
          </option>

          <option value={year}>
            {year}
          </option>

          <option value={year + 1}>
            {year + 1}
          </option>
        </select>

      </div>

      <h2>
        {monthName} {year} Attendance
      </h2>

      {/* =========================================
          OVERALL SUMMARY
      ========================================== */}

      <div className="attendance-summary">

        <div className="attendance-summary-card">
          <h3>Overall Attendance</h3>

          <p>
            {attendanceData?.overall?.percentage ?? 0}%
          </p>
        </div>

        <div className="attendance-summary-card">
          <h3>Attended</h3>

          <p>
            {attendanceData?.overall?.attended ?? 0}
          </p>
        </div>

        <div className="attendance-summary-card">
          <h3>Conducted</h3>

          <p>
            {attendanceData?.overall?.conducted ?? 0}
          </p>
        </div>

      </div>

      {/* =========================================
          SUBJECT-WISE + DAILY ATTENDANCE
      ========================================== */}

      <div className="attendance-subject-summary">

        <h2>Daily Attendance</h2>

        {attendanceData?.subjects?.length > 0 ? (

          <div className="attendance-table-container">

            <table>

              {/* =====================================
                  TABLE HEADER
              ====================================== */}

              <thead>
                <tr>

                  {/* Date */}
                  <th>Date</th>

                  {/* Dynamic Subjects */}
                  {attendanceData?.subjects?.map(
                    (subject) => (
                      <th key={subject.id}>
                        {subject.subjectName}
                      </th>
                    )
                  )}

                  {/* Daily Total */}
                  <th>Daily Total</th>

                </tr>
              </thead>

              {/* =====================================
                  TABLE BODY
              ====================================== */}

              <tbody>

                {attendanceData?.attendance?.map(
                  (day) => (

                    <tr key={day.date}>

                      {/* ==========================
                          DATE
                      =========================== */}

                      <td>
                        {day.displayDate}
                      </td>

                      {/* ==========================
                          SUBJECT COLUMNS
                      =========================== */}

                      {attendanceData.subjects.map(
                        (subject) => {

                          const subjectAttendance =
                            day.subjects &&
                            typeof day.subjects === "object" &&
                            !Array.isArray(day.subjects)
                              ? day.subjects[subject.id]
                              : null;

                          // ---------------------------------
                          // SUNDAY
                          // ---------------------------------

                          if (
                            day.type === "Sunday"
                          ) {
                            return (
                              <td
                                key={subject.id}
                                className="attendance-no-classes"
                              >
                                -
                              </td>
                            );
                          }

                          // ---------------------------------
                          // COLLEGE HOLIDAY
                          // ---------------------------------

                          if (
                            day.type === "Holiday"
                          ) {
                            return (
                              <td
                                key={subject.id}
                                className="attendance-holiday"
                              >
                                Holiday
                              </td>
                            );
                          }

                          // ---------------------------------
                          // NO CLASS FOR THIS SUBJECT
                          // ---------------------------------

                          if (!subjectAttendance) {
                            return (
                              <td
                                key={subject.id}
                              >
                                -
                              </td>
                            );
                          }

                          // ---------------------------------
                          // NOT CONDUCTED
                          // ---------------------------------

                          if (
                            subjectAttendance.status ===
                            "Not Conducted"
                          ) {
                            return (
                              <td
                                key={subject.id}
                                className="attendance-not-conducted"
                              >
                                {
                                  subjectAttendance.display
                                }
                              </td>
                            );
                          }

                          // ---------------------------------
                          // PRESENT / ABSENT
                          // ---------------------------------

                          return (
                            <td
                              key={subject.id}
                              className={
                                subjectAttendance.status ===
                                "Present"
                                  ? "attendance-present"
                                  : "attendance-absent"
                              }
                            >
                              {
                                subjectAttendance.display
                              }
                            </td>
                          );
                        }
                      )}

                      {/* ==========================
                          DAILY TOTAL
                      =========================== */}

                      <td
                        className={
                          day.type === "Sunday" ||
                          day.type === "Holiday"
                            ? "attendance-no-classes"
                            : "attendance-daily-total"
                        }
                      >

                        {day.type === "Sunday" ||
                        day.type === "Holiday"
                          ? "No Classes"
                          : day.dailyTotal?.display ||
                            "-"}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <p>
            No subject attendance available.
          </p>

        )}

      </div>

    </div>
  );
}

export default StudentAttendanceDetails;