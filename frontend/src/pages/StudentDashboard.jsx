import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>Student Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      <p>User ID: {user?.userId}</p>

      <p>Role: {user?.role}</p>

      <div className="dashboard-actions">

        <button
          onClick={() => navigate("/notices")}
          className="dashboard-button"
        >
          Notice Board
        </button>

        <button
          onClick={() => navigate("/achievements")}
          className="dashboard-button"
        >
          Achievements
        </button>

        {/* Attendance */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/student/attendance")}
        >
          <h3>Attendance</h3>
          <p>View your subject-wise attendance</p>
        </div>

        {/* Results */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/student/results")}
        >
          <h3>My Results</h3>
          <p>View your exam-wise and subject-wise results</p>
        </div>

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

export default StudentDashboard;