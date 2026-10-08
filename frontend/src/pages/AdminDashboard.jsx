import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>College Management System</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="admin-profile">
          <span>Welcome, {user?.name}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="admin-content">

        <div className="dashboard-title">
          <h2>Admin Control Panel</h2>
          <p>Manage college information and academic records</p>
        </div>

        {/* Dashboard Cards */}
        <div className="admin-grid">

          <div
            className="admin-card"
            onClick={() => navigate("/admin/add-student")}
          >
            <div className="card-icon">👨‍🎓</div>
            <h3>Add Student</h3>
            <p>Create a new student account and academic profile.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/add-teacher")}
          >
            <div className="card-icon">👨‍🏫</div>
            <h3>Add Teacher</h3>
            <p>Create a new teacher account and profile.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/students")}
          >
            <div className="card-icon">📚</div>
            <h3>Student List</h3>
            <p>View, search and manage student records.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/teachers")}
          >
            <div className="card-icon">👩‍🏫</div>
            <h3>Teacher List</h3>
            <p>View and manage teacher records.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/notices")}
          >
            <div className="card-icon">📢</div>
            <h3>Notices</h3>
            <p>Create and manage college notices.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/achievements")}
          >

            <div className="card-icon">🏆</div>
            <h3>Achievements</h3>
            <p>Upload and manage student achievements.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/results")}
          >
            <div className="card-icon">📊</div>
            <h3>Results</h3>
            <p>View academic results and top performers.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/subjects")}
          >
            <div className="card-icon">📚</div>
            <h3>Subjects</h3>
            <p>Create subjects and assign teachers</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/exams")}
          >
            <div className="card-icon">🤯</div>
            <h3>Exams</h3>
            <p>Create and manage examinations</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/events")}
          >
            <div className="card-icon">📅</div>
            <h3>Events</h3>
            <p>Upload and manage college events.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/college-holidays")}
          >
            <div className="card-icon">🏖️</div>
            <h3>College Holidays</h3>
            <p>Add and manage college-wide holidays.</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/teacher-attendance")}
          >
            <div className="card-icon">📋</div>
            <h3>Teacher Attendance</h3>
            <p>Manage and view teacher attendance.</p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;