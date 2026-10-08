import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Students.css";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="students-page">

      <div className="students-container">

        {/* Header */}
        <div className="students-header">
          <div>
            <h1>Student List</h1>
            <p>Manage registered students</p>
          </div>

          <button
            className="add-student-button"
            onClick={() => navigate("/admin/add-student")}
          >
            + Add Student
          </button>
        </div>

        {/* Back button */}
        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        {/* Loading */}
        {loading && (
          <p className="status-message">
            Loading students...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Student count */}
        {!loading && !error && (
          <div className="student-count">
            Total Students: <strong>{students.length}</strong>
          </div>
        )}

        {/* Table */}
        {!loading && !error && students.length > 0 && (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Branch</th>
                  <th>Academic Year</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {students.map((student, index) => (
                  <tr key={student._id}>

                    <td>{index + 1}</td>

                    <td>
                      {student.user?.userId || student.rollNo}
                    </td>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.phoneNo}</td>

                    <td>{student.branch}</td>

                    <td>{student.academicYear}</td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(`/admin/students/${student._id}`)
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* No students */}
        {!loading &&
          !error &&
          students.length === 0 && (
            <div className="no-students">
              <h3>No students found</h3>

              <p>
                Add your first student to see them here.
              </p>

              <button
                onClick={() => navigate("/admin/add-student")}
              >
                Add Student
              </button>
            </div>
          )}

      </div>

    </div>
  );
}

export default Students;