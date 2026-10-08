import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Teachers.css";

function Teachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/teachers"
      );

      setTeachers(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teachers-page">

      <div className="teachers-container">

        {/* Header */}
        <div className="teachers-header">

          <div>
            <h1>Teacher List</h1>
            <p>Manage registered teachers</p>
          </div>

          <button
            className="add-teacher-button"
            onClick={() => navigate("/admin/add-teacher")}
          >
            + Add Teacher
          </button>

        </div>

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        {/* Loading */}
        {loading && (
          <p className="status-message">
            Loading teachers...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Count */}
        {!loading && !error && (
          <div className="teacher-count">
            Total Teachers: <strong>{teachers.length}</strong>
          </div>
        )}

        {/* Table */}
        {!loading && !error && teachers.length > 0 && (

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {teachers.map((teacher, index) => (

                  <tr key={teacher._id}>

                    <td>{index + 1}</td>

                    <td>
                      {teacher.user?.userId ||
                        teacher.teacherId}
                    </td>

                    <td>{teacher.name}</td>

                    <td>{teacher.email}</td>

                    <td>{teacher.phoneNo}</td>

                    <td>{teacher.department}</td>

                    <td>{teacher.designation}</td>

                    <td>

                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(
                            `/admin/teachers/${teacher._id}`
                          )
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

        {/* No teachers */}
        {!loading &&
          !error &&
          teachers.length === 0 && (

            <div className="no-teachers">

              <h3>No teachers found</h3>

              <p>
                Add your first teacher to see them here.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/add-teacher")
                }
              >
                Add Teacher
              </button>

            </div>
          )}

      </div>

    </div>
  );
}

export default Teachers;