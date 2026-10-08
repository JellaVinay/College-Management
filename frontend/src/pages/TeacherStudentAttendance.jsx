import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TeacherStudentAttendance.css";

const TeacherStudentAttendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getTodayDate = () => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
  };

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [classStatus, setClassStatus] = useState("Conducted");
  const [reason, setReason] = useState("");

  const [classSessionId, setClassSessionId] = useState(null);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [holiday, setHoliday] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
    ============================================================
    LOAD TEACHER SUBJECTS
    ============================================================
  */

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/student-attendance/teacher/${user.userId}/subjects`
        );

        setSubjects(response.data.subjects || []);

        if (response.data.subjects?.length > 0) {
          setSelectedSubject(
            response.data.subjects[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Load subjects error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load subjects"
        );
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (user?.role === "teacher") {
      loadSubjects();
    }
  }, []);

  /*
    ============================================================
    LOAD STUDENTS + EXISTING ATTENDANCE
    ============================================================
  */

  useEffect(() => {
    if (!selectedSubject || !date) {
      return;
    }

    const loadAttendanceData = async () => {
      try {
        setLoadingStudents(true);
        setError("");
        setMessage("");

        setHoliday(null);
        setClassSessionId(null);
        setClassStatus("Conducted");
        setReason("");
        setAttendance({});

        const response = await axios.get(
          `http://localhost:5000/api/student-attendance/teacher/${user.userId}/subject/${selectedSubject}/date/${date}`
        );

        /*
          College holiday
        */

        if (response.data.isHoliday) {
          setHoliday(response.data.holiday);
          setStudents([]);
          return;
        }

        const studentList =
          response.data.students || [];

        setStudents(studentList);

        /*
          Existing class session
        */

        const session =
          response.data.classSession;

        if (session) {
          setClassSessionId(session._id);
          setClassStatus(session.status);
          setReason(session.reason || "");
        }

        /*
          Existing student attendance
        */

        const existingAttendance =
          response.data.attendance || [];

        const attendanceMap = {};

        existingAttendance.forEach((record) => {
          attendanceMap[record.student] =
            record.status;
        });

        /*
          Students without existing attendance
          default to Present.
        */

        studentList.forEach((student) => {
          if (!attendanceMap[student._id]) {
            attendanceMap[student._id] =
              "Present";
          }
        });

        setAttendance(attendanceMap);
      } catch (error) {
        console.error(
          "Load attendance error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load attendance"
        );
      } finally {
        setLoadingStudents(false);
      }
    };

    loadAttendanceData();
  }, [selectedSubject, date]);

  /*
    ============================================================
    CHANGE STUDENT STATUS
    ============================================================
  */

  const handleAttendanceChange = (
    studentId,
    status
  ) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  /*
    ============================================================
    SAVE CLASS SESSION
    ============================================================
  */

  const saveAttendance = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!selectedSubject) {
        setError("Please select a subject.");
        return;
      }

      if (holiday) {
        setError(
          "Attendance cannot be marked on a college holiday."
        );
        return;
      }

      if (
        classStatus === "Not Conducted" &&
        !reason.trim()
      ) {
        setError(
          "Please enter the reason for the class not being conducted."
        );
        return;
      }

      /*
        First create/update the class session.
      */

      const sessionResponse =
        await axios.post(
          `http://localhost:5000/api/student-attendance/teacher/${user.userId}/class-session`,
          {
            subjectId: selectedSubject,
            date,
            status: classStatus,
            reason:
              classStatus === "Not Conducted"
                ? reason
                : "",
          }
        );

      const session =
        sessionResponse.data.classSession;

      setClassSessionId(session._id);

      /*
        If class was not conducted,
        there is no student attendance to save.
      */

      if (classStatus === "Not Conducted") {
        setMessage(
          "Class marked as Not Conducted successfully."
        );
        setAttendance({});
        return;
      }

      /*
        Prepare student attendance.
      */

      const attendanceData = students.map(
        (student) => ({
          studentId: student._id,
          status:
            attendance[student._id] ||
            "Present",
        })
      );

      /*
        Save student attendance.
      */

      await axios.post(
        `http://localhost:5000/api/student-attendance/teacher/${user.userId}/class-session/${session._id}/attendance`,
        {
          attendance: attendanceData,
        }
      );

      setMessage(
        "Student attendance saved successfully."
      );
    } catch (error) {
      console.error(
        "Save attendance error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
    ============================================================
    FORMAT DATE FOR DISPLAY
    ============================================================
  */

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const [year, month, day] =
      dateString.split("-");

    return `${day}-${month}-${year}`;
  };

  /*
    ============================================================
    ACCESS CHECK
    ============================================================
  */

  if (!user || user.role !== "teacher") {
    return (
      <div className="attendance-error">
        Access Denied
      </div>
    );
  }

  return (
    <div className="teacher-student-attendance">
      <div className="attendance-page-header">
        <h1>Student Attendance</h1>

        <p>
          Mark attendance for your assigned
          subject.
        </p>
      </div>

      {/* SUBJECT + DATE */}

      <div className="attendance-controls">
        <div className="control-group">
          <label>Select Subject</label>

          {loadingSubjects ? (
            <p>Loading subjects...</p>
          ) : (
            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Subject
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject._id}
                  value={subject._id}
                >
                  {subject.subjectName} (
                  {subject.subjectCode})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="control-group">
          <label>Select Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <small>
            Selected: {formatDate(date)}
          </small>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="attendance-message error">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div className="attendance-message success">
          {message}
        </div>
      )}

      {/* HOLIDAY */}

      {holiday && (
        <div className="holiday-notice">
          <h3>🏖️ College Holiday</h3>

          <p>
            <strong>{holiday.name}</strong>
          </p>

          {holiday.reason && (
            <p>{holiday.reason}</p>
          )}

          <p>
            Student attendance cannot be
            marked on a college holiday.
          </p>
        </div>
      )}

      {/* CLASS STATUS */}

      {!holiday &&
        selectedSubject &&
        !loadingStudents && (
          <div className="class-status-section">
            <h2>Class Status</h2>

            <div className="class-status-options">
              <label>
                <input
                  type="radio"
                  value="Conducted"
                  checked={
                    classStatus ===
                    "Conducted"
                  }
                  onChange={(e) =>
                    setClassStatus(
                      e.target.value
                    )
                  }
                />

                Class Conducted
              </label>

              <label>
                <input
                  type="radio"
                  value="Not Conducted"
                  checked={
                    classStatus ===
                    "Not Conducted"
                  }
                  onChange={(e) =>
                    setClassStatus(
                      e.target.value
                    )
                  }
                />

                Class Not Conducted
              </label>
            </div>

            {classStatus ===
              "Not Conducted" && (
              <div className="reason-group">
                <label>
                  Reason
                </label>

                <input
                  type="text"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="Example: Teacher absent"
                />
              </div>
            )}
          </div>
        )}

      {/* STUDENTS */}

      {!holiday &&
        classStatus === "Conducted" &&
        selectedSubject && (
          <div className="student-attendance-section">
            <div className="section-header">
              <div>
                <h2>
                  Student List
                </h2>

                <p>
                  {formatDate(date)}
                </p>
              </div>

              <div className="student-count">
                Students:{" "}
                {students.length}
              </div>
            </div>

            {loadingStudents ? (
              <div className="attendance-loading">
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="no-students">
                No students found for this
                subject.
              </div>
            ) : (
              <div className="attendance-table-wrapper">
                <table className="student-attendance-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(
                      (
                        student,
                        index
                      ) => (
                        <tr
                          key={
                            student._id
                          }
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {
                              student.rollNo
                            }
                          </td>

                          <td>
                            {
                              student.name
                            }
                          </td>

                          <td>
                            <select
                              value={
                                attendance[
                                  student
                                    ._id
                                ] ||
                                "Present"
                              }
                              onChange={(
                                e
                              ) =>
                                handleAttendanceChange(
                                  student._id,
                                  e.target
                                    .value
                                )
                              }
                            >
                              <option value="Present">
                                Present
                              </option>

                              <option value="Absent">
                                Absent
                              </option>
                            </select>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {students.length > 0 && (
              <div className="attendance-actions">
                <button
                  onClick={
                    saveAttendance
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Attendance"}
                </button>
              </div>
            )}
          </div>
        )}

      {/* NOT CONDUCTED */}

      {!holiday &&
  classStatus === "Not Conducted" &&
  selectedSubject && (
    <div className="not-conducted-notice">
      <h3>Class Not Conducted</h3>

      <p>
        Student attendance will not be
        recorded because this class did
        not happen.
      </p>

      <button
        className="save-class-status-button"
        onClick={saveAttendance}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : "Save Class Status"}
      </button>
    </div>
  )}
    </div>
  );
};

export default TeacherStudentAttendance;