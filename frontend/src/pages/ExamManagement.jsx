import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ExamManagement.css";

function ExamManagement() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    examName: "",
    examCode: "",
    branch: "",
    academicYear: "",
    semester: "",
    examDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // Get Admin ID
  const user = JSON.parse(localStorage.getItem("user"));
  const adminUserId = user?.userId;


  // ================================
  // FETCH EXAMS
  // ================================

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/exams"
      );

      setExams(response.data);
    } catch (error) {
      console.error("Fetch exams error:", error);

      setError("Failed to load exams");
    }
  };


  useEffect(() => {
    fetchExams();
  }, []);


  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };


  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {
    setFormData({
      examName: "",
      examCode: "",
      branch: "",
      academicYear: "",
      semester: "",
      examDate: "",
    });

    setEditingId(null);
    setMessage("");
    setError("");
  };


  // ================================
  // CREATE / UPDATE EXAM
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {

      const data = {
        ...formData,
        adminUserId,
      };


      if (editingId) {

        const response = await axios.put(
          `http://localhost:5000/api/exams/${editingId}`,
          data
        );

        setMessage(
          response.data.message ||
          "Exam updated successfully"
        );

      } else {

        const response = await axios.post(
          "http://localhost:5000/api/exams",
          data
        );

        setMessage(
          response.data.message ||
          "Exam created successfully"
        );
      }


      resetForm();

      await fetchExams();

    } catch (error) {

      console.error("Save exam error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to save exam"
      );

    } finally {

      setLoading(false);

    }
  };


  // ================================
  // EDIT EXAM
  // ================================

  const handleEdit = (exam) => {

    setEditingId(exam._id);

    setFormData({
      examName: exam.examName,
      examCode: exam.examCode,
      branch: exam.branch,
      academicYear: exam.academicYear,
      semester: exam.semester,
      examDate: exam.examDate
        ? exam.examDate.split("T")[0]
        : "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ================================
  // DELETE EXAM
  // ================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      setError("");
      setMessage("");

      const response = await axios.delete(
        `http://localhost:5000/api/exams/${id}`,
        {
          data: {
            adminUserId,
          },
        }
      );

      setMessage(
        response.data.message ||
        "Exam deleted successfully"
      );

      await fetchExams();

    } catch (error) {

      console.error("Delete exam error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to delete exam"
      );
    }
  };


  return (
    <div className="exams-page">

      {/* Header */}

      <div className="exams-header">

        <div>
          <h1>Exam Management</h1>

          <p>
            Create and manage college examinations
          </p>
        </div>

        <button
          className="exams-back-btn"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </div>


      {/* Form */}

      <div className="exam-form-card">

        <h2>
          {editingId
            ? "Update Exam"
            : "Add Exam"}
        </h2>


        {message && (
          <p className="exam-success">
            {message}
          </p>
        )}


        {error && (
          <p className="exam-error">
            {error}
          </p>
        )}


        <form onSubmit={handleSubmit}>

          <div className="exam-form-grid">

            {/* Exam Name */}

            <div className="exam-form-group">

              <label>
                Exam Name
              </label>

              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                placeholder="Example: Mid-1 Examination"
                required
              />

            </div>


            {/* Exam Code */}

            <div className="exam-form-group">

              <label>
                Exam Code
              </label>

              <input
                type="text"
                name="examCode"
                value={formData.examCode}
                onChange={handleChange}
                placeholder="Example: MID1-2026"
                required
              />

            </div>


            {/* Branch */}

            <div className="exam-form-group">

              <label>
                Branch
              </label>

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Branch
                </option>

                <option value="CSE">
                  CSE
                </option>

                <option value="ECE">
                  ECE
                </option>

                <option value="EEE">
                  EEE
                </option>

                <option value="MECH">
                  MECH
                </option>

                <option value="CIVIL">
                  CIVIL
                </option>

              </select>

            </div>


            {/* Academic Year */}

            <div className="exam-form-group">

              <label>
                Academic Year
              </label>

              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Example: 2025-2026"
                required
              />

            </div>


            {/* Semester */}

            <div className="exam-form-group">

              <label>
                Semester
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Semester
                </option>

                <option value="Semester 1">
                  Semester 1
                </option>

                <option value="Semester 2">
                  Semester 2
                </option>

                <option value="Semester 3">
                  Semester 3
                </option>

                <option value="Semester 4">
                  Semester 4
                </option>

                <option value="Semester 5">
                  Semester 5
                </option>

                <option value="Semester 6">
                  Semester 6
                </option>

              </select>

            </div>


            {/* Exam Date */}

            <div className="exam-form-group">

              <label>
                Exam Date
              </label>

              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Buttons */}

          <div className="exam-form-buttons">

            <button
              type="submit"
              className="save-exam-btn"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : editingId
                ? "Update Exam"
                : "Create Exam"}

            </button>


            {editingId && (

              <button
                type="button"
                className="cancel-exam-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* Exam List */}

      <div className="exams-list-card">

        <h2>
          Examination List
        </h2>


        {exams.length === 0 ? (

          <p className="no-exams">
            No exams created yet.
          </p>

        ) : (

          <div className="exams-table-container">

            <table className="exams-table">

              <thead>

                <tr>

                  <th>S.No</th>
                  <th>Exam</th>
                  <th>Code</th>
                  <th>Branch</th>
                  <th>Academic Year</th>
                  <th>Semester</th>
                  <th>Exam Date</th>
                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {exams.map((exam, index) => (

                  <tr key={exam._id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {exam.examName}
                    </td>

                    <td>
                      {exam.examCode}
                    </td>

                    <td>
                      {exam.branch}
                    </td>

                    <td>
                      {exam.academicYear}
                    </td>

                    <td>
                      {exam.semester}
                    </td>

                    <td>
                      {exam.examDate
                        ? new Date(
                            exam.examDate
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td>

                      <button
                        className="edit-exam-btn"
                        onClick={() =>
                          handleEdit(exam)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-exam-btn"
                        onClick={() =>
                          handleDelete(exam._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default ExamManagement;