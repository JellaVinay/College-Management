import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddStudent.css";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    phoneNo: "",
    branch: "",
    academicYear: "",
    semester: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/students",
        student
      );

      setMessage(response.data.message);

      setStudent({
        name: "",
        rollNo: "",
        email: "",
        phoneNo: "",
        branch: "",
        academicYear: "",
        semester: "",
        password: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create student"
      );
    }
  };

  return (
    <div className="add-student-page">

      <div className="add-student-container">

        <div className="add-student-header">
          <h1>Add Student</h1>
          <p>Create a new student account</p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number / Student ID</label>

              <input
                type="text"
                name="rollNo"
                value={student.rollNo}
                onChange={handleChange}
                placeholder="Example: 23CS101"
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phoneNo"
                value={student.phoneNo}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Branch</label>

              <input
                type="text"
                name="branch"
                value={student.branch}
                onChange={handleChange}
                placeholder="Example: Computer Science"
                required
              />
            </div>

            <div className="form-group">
              <label>Academic Year</label>

              <input
                type="text"
                name="academicYear"
                value={student.academicYear}
                onChange={handleChange}
                placeholder="Example: 2026-27"
                required
              />
            </div>

          </div>

          {/* Semester */}

          <div className="form-group">
            <label>Semester</label>

            <select
              name="semester"
              value={student.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Initial Password</label>

            <input
              type="password"
              name="password"
              value={student.password}
              onChange={handleChange}
              placeholder="Enter initial password"
              required
            />
          </div>

          <div className="form-buttons">

            <button type="submit">
              Create Student
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddStudent;