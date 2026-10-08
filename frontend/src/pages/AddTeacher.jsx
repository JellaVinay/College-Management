import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddTeacher.css";

function AddTeacher() {
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    name: "",
    teacherId: "",
    email: "",
    phoneNo: "",
    department: "",
    designation: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTeacher({
      ...teacher,
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
        "http://localhost:5000/api/teachers",
        teacher
      );

      setMessage(response.data.message);

      setTeacher({
        name: "",
        teacherId: "",
        email: "",
        phoneNo: "",
        department: "",
        designation: "",
        password: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create teacher"
      );
    }
  };

  return (
    <div className="add-teacher-page">

      <div className="add-teacher-container">

        <div className="add-teacher-header">
          <h1>Add Teacher</h1>
          <p>Create a new teacher account</p>
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
              <label>Teacher Name</label>

              <input
                type="text"
                name="name"
                value={teacher.name}
                onChange={handleChange}
                placeholder="Enter teacher name"
                required
              />
            </div>

            <div className="form-group">
              <label>Teacher ID</label>

              <input
                type="text"
                name="teacherId"
                value={teacher.teacherId}
                onChange={handleChange}
                placeholder="Example: TCH001"
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
                value={teacher.email}
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
                value={teacher.phoneNo}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Department</label>

              <input
                type="text"
                name="department"
                value={teacher.department}
                onChange={handleChange}
                placeholder="Example: Computer Science"
                required
              />
            </div>

            <div className="form-group">
              <label>Designation</label>

              <input
                type="text"
                name="designation"
                value={teacher.designation}
                onChange={handleChange}
                placeholder="Example: Assistant Professor"
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Initial Password</label>

            <input
              type="password"
              name="password"
              value={teacher.password}
              onChange={handleChange}
              placeholder="Enter initial password"
              required
            />
          </div>

          <div className="form-buttons">

            <button type="submit">
              Create Teacher
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

export default AddTeacher;