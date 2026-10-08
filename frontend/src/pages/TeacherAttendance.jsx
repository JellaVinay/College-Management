import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TeacherAttendance.css";

const TeacherAttendance = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `http://localhost:5000/api/teacher-attendance/today?adminUserId=${user.userId}&date=${date}`
      );

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to load teacher attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadAttendance();
    }
  }, [date]);

  const saveAttendance = async (teacherId, status) => {
    try {
      setMessage("");

      await axios.post(
        "http://localhost:5000/api/teacher-attendance",
        {
          adminUserId: user.userId,
          teacherId,
          date,
          status,
        }
      );

      setMessage("Teacher attendance saved successfully.");

      loadAttendance();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to save teacher attendance"
      );
    }
  };

  if (!user || user.role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  return (
    <div className="teacher-attendance-page">
      <h1>Teacher Attendance</h1>

      <div className="attendance-controls">
        <label>Select Date:</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={loadAttendance}>
          Load Attendance
        </button>
      </div>

      {message && (
        <p className="attendance-message">
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((item) => (
                <tr key={item.teacher.id}>
                  <td>{item.teacher.teacherId}</td>

                  <td>{item.teacher.name}</td>

                  <td>{item.teacher.department}</td>

                  <td>{item.teacher.designation}</td>

                  <td>
                    <select
                      value={item.attendance?.status || ""}
                      onChange={(e) =>
                        saveAttendance(
                          item.teacher.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                      <option value="Holiday">Holiday</option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/teacher-attendance/${item.teacher.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherAttendance;