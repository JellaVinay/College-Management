import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditStudent.css";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    phoneNo: "",
    branch: "",
    academicYear: "",
    semester: "",  
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );

      const data = response.data;

      setStudent({
        name: data.name || "",
        rollNo: data.rollNo || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        branch: data.branch || "",
        academicYear: data.academicYear || "",
        semester: data.semester || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${id}`,
        student
      );

      setMessage(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-student-page">
        <div className="edit-student-container">
          <p>Loading student...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-student-page">

      <div className="edit-student-container">

        <div className="edit-header">
          <h1>Edit Student</h1>
          <p>Update student information</p>
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

          <div className="form-buttons">

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Student"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/admin/students/${id}`)
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditStudent;