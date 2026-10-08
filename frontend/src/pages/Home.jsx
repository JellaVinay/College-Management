import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

        <Navbar />

      <section className="hero">

        <div className="hero-content">

          <h1>College Management System</h1>

          <p>
            Manage students, teachers, attendance, marks,
            assignments, notices and college activities
            in one place.
          </p>

          <div className="buttons">

            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/about" className="about-btn">
              Learn More
            </Link>

          </div>

        </div>

      </section>

      <section className="features">

        <h2>Our System</h2>

        <div className="feature-container">

          <div className="card">
            <h3>Admin</h3>
            <p>
              Manage students, teachers, notices,
              achievements, results and events.
            </p>
          </div>

          <div className="card">
            <h3>Student</h3>
            <p>
              View academic details, attendance,
              marks and assignments.
            </p>
          </div>

          <div className="card">
            <h3>Teacher</h3>
            <p>
              Manage attendance, marks,
              teaching details and leave applications.
            </p>
          </div>

        </div>

      </section>

      <section className="login-section">

        <h2>Access Your Account</h2>

        <p>
          Login to access your college dashboard.
        </p>

        <Link to="/login" className="login-btn">
          Login Now
        </Link>

      </section>

      <footer>
        <p>
          © 2026 College Management System
        </p>
      </footer>

    </div>
  );
}

export default Home;