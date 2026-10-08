import { useNavigate } from "react-router-dom";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="teacher-dashboard">

      {/* Header */}
      <div className="teacher-dashboard-header">
        <h1>Teacher Dashboard</h1>

        <p>
          Welcome, {user?.name}
        </p>

        <p>
          User ID: {user?.userId}
        </p>

        <p>
          Role: {user?.role}
        </p>
      </div>


      {/* Dashboard Actions */}
      <div className="dashboard-actions">

        {/* Subject Marks */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/teacher/marks")}
        >
          <div className="card-icon">📋</div>

          <h3>My Subject Marks</h3>
          <p>
            Enter and update marks for your assigned subjects
          </p>
        </div>

        {/* Student Attendance  */}

        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/teacher/student-attendance")
          }
        >
          <div className="card-icon">🧾</div>

          <h3>Student Attendance</h3>

          <p>
            Mark attendance for students in your
            assigned subjects.
          </p>
        </div>


        {/* Notice Board */}
        <button
          onClick={() => navigate("/notices")}
          className="dashboard-button"
        >
          <div className="card-icon">🪧</div>

          Notice Board
        </button>


        {/* Achievements */}
        <button
          onClick={() => navigate("/achievements")}
          className="dashboard-button"
        >
          <div className="card-icon">🏅</div>

          Achievements
        </button>


        {/* Logout */}
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default TeacherDashboard;