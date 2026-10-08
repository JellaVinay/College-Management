import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditTeacher.css";

function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    name: "",
    teacherId: "",
    email: "",
    phoneNo: "",
    department: "",
    designation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teachers/${id}`
      );

      const data = response.data;

      setTeacher({
        name: data.name || "",
        teacherId: data.teacherId || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        department: data.department || "",
        designation: data.designation || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTeacher({
      ...teacher,
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
        `http://localhost:5000/api/teachers/${id}`,
        teacher
      );

      setMessage(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update teacher"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-teacher-page">
        <div className="edit-teacher-container">
          <p>Loading teacher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-teacher-page">

      <div className="edit-teacher-container">

        <div className="edit-teacher-header">
          <h1>Edit Teacher</h1>
          <p>Update teacher information</p>
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
                required
              />
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Teacher"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/admin/teachers/${id}`)
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

export default EditTeacher;