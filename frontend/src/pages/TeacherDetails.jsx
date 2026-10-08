import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/TeacherDetails.css";

function TeacherDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teachers/${id}`
      );

      setTeacher(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load teacher details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/teachers/${id}`
      );

      alert("Teacher deleted successfully");

      navigate("/admin/teachers");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete teacher"
      );
    }
  };

  if (loading) {
    return (
      <div className="teacher-details-page">
        <div className="teacher-details-container">
          <p>Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-details-page">
        <div className="teacher-details-container">

          <div className="error-message">
            {error}
          </div>

          <button
            onClick={() => navigate("/admin/teachers")}
          >
            ← Back to Teacher List
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="teacher-details-page">

      <div className="teacher-details-container">

        <div className="teacher-details-header">

          <div>
            <h1>Teacher Details</h1>
            <p>Complete teacher profile</p>
          </div>

          <button
            onClick={() => navigate("/admin/teachers")}
          >
            ← Back to List
          </button>

        </div>

        <div className="teacher-section">

          <h2>Basic Information</h2>

          <div className="teacher-details-grid">

            <div className="detail-item">
              <span>Teacher Name</span>
              <strong>{teacher.name}</strong>
            </div>

            <div className="detail-item">
              <span>Teacher ID</span>
              <strong>
                {teacher.user?.userId || teacher.teacherId}
              </strong>
            </div>

            <div className="detail-item">
              <span>Email</span>
              <strong>{teacher.email}</strong>
            </div>

            <div className="detail-item">
              <span>Phone Number</span>
              <strong>{teacher.phoneNo}</strong>
            </div>

            <div className="detail-item">
              <span>Department</span>
              <strong>{teacher.department}</strong>
            </div>

            <div className="detail-item">
              <span>Designation</span>
              <strong>{teacher.designation}</strong>
            </div>

            <div className="detail-item">
              <span>Role</span>
              <strong>{teacher.user?.role}</strong>
            </div>

          </div>

        </div>

        <div className="teacher-section">

          <h2>Teaching Information</h2>

          <p className="coming-soon">
            Subjects, classrooms, room numbers, teaching
            timings, attendance and marks will be added
            later.
          </p>

        </div>

        <div className="teacher-actions">

          <button
            className="edit-button"
            onClick={() =>
              navigate(`/admin/teachers/${id}/edit`)
            }
          >
            Edit Teacher
          </button>

          <button
            className="delete-button"
            onClick={handleDelete}
          >
            Delete Teacher
          </button>

        </div>

      </div>

    </div>
  );
}

export default TeacherDetails;