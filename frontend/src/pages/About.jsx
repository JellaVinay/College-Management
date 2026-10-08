import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

        <Navbar />

      {/* Header */}

      <section className="about-header">
        <h1>About Our College</h1>

        <p>
          Learn more about our College Management System
          and how it helps manage college activities.
        </p>
      </section>


      {/* About College */}

      <section className="about-content">

        <div className="about-card">

          <h2>College Management System</h2>

          <p>
            The College Management System is a web-based application
            designed to manage important college activities in one place.
          </p>

          <p>
            The system helps administrators, teachers and students
            access and manage information according to their roles.
          </p>

        </div>


        {/* Mission */}

        <div className="about-card">

          <h2>Our Mission</h2>

          <p>
            Our mission is to provide a simple and organized digital
            platform for managing students, teachers, academic records,
            attendance, marks, assignments and college activities.
          </p>

        </div>


        {/* What We Manage */}

        <div className="about-card">

          <h2>What We Manage</h2>

          <div className="management-list">

            <div>
              <h3>Students</h3>
              <p>
                Student details, academic records, attendance,
                marks and assignments.
              </p>
            </div>

            <div>
              <h3>Teachers</h3>
              <p>
                Teacher details, subjects, classrooms,
                timings and academic responsibilities.
              </p>
            </div>

            <div>
              <h3>Administration</h3>
              <p>
                Student and teacher management, notices,
                events, achievements and results.
              </p>
            </div>

          </div>

        </div>


        {/* User Roles */}

        <div className="about-card">

          <h2>Our Users</h2>

          <div className="roles-container">

            <div className="role-card">
              <h3>Admin</h3>

              <p>
                Manages students, teachers, notices,
                events, achievements and results.
              </p>
            </div>

            <div className="role-card">
              <h3>Student</h3>

              <p>
                Views personal information, academic details,
                attendance, marks and assignments.
              </p>
            </div>

            <div className="role-card">
              <h3>Teacher</h3>

              <p>
                Manages attendance, marks, teaching details
                and leave applications.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Navigation */}

      <section className="about-navigation">

        <Link to="/" className="about-button">
          Back to Home
        </Link>

        <Link to="/contact" className="about-button">
          Contact Us
        </Link>

        <Link to="/login" className="about-button">
          Login
        </Link>

      </section>

    </div>
  );
}

export default About;