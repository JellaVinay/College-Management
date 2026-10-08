import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminResults.css";

function AdminResults() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const adminUserId = user?.userId;

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);

  const [filters, setFilters] = useState({
    branch: "",
    academicYear: "",
    rollNo: "",
    name: "",
    examId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH EXAMS
  // ==========================================

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


  // ==========================================
  // FETCH RESULTS
  // ==========================================

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("adminUserId", adminUserId);

      if (filters.branch) {
        params.append("branch", filters.branch);
      }

      if (filters.academicYear) {
        params.append(
          "academicYear",
          filters.academicYear
        );
      }

      if (filters.rollNo) {
        params.append("rollNo", filters.rollNo);
      }

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.examId) {
        params.append("examId", filters.examId);
      }


      const response = await axios.get(
        `http://localhost:5000/api/results/admin?${params.toString()}`
      );

      setResults(response.data);

    } catch (error) {
      console.error("Fetch results error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load results"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (adminUserId) {
      fetchExams();
      fetchResults();
    }
  }, [adminUserId]);


  // ==========================================
  // HANDLE FILTER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters({
      ...filters,
      [name]: value,
    });
  };


  // ==========================================
  // APPLY FILTER
  // ==========================================

  const handleSearch = () => {
    fetchResults();
  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setFilters({
      branch: "",
      academicYear: "",
      rollNo: "",
      name: "",
      examId: "",
    });

    setTimeout(() => {
      fetchResults();
    }, 0);
  };


  return (
    <div className="admin-results-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-results-header">

        <div>
          <h1>
            Student Results
          </h1>

          <p>
            View student examination results
          </p>
        </div>


        <button
          className="admin-results-back-btn"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </div>


      {/* =====================================
          FILTER CARD
      ===================================== */}

      <div className="results-filter-card">

        <h2>
          Search & Filter Results
        </h2>


        <div className="results-filter-grid">

          {/* Branch */}

          <div className="results-filter-group">

            <label>
              Branch
            </label>

            <select
              name="branch"
              value={filters.branch}
              onChange={handleChange}
            >

              <option value="">
                All Branches
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

          <div className="results-filter-group">

            <label>
              Academic Year
            </label>

            <input
              type="text"
              name="academicYear"
              value={filters.academicYear}
              onChange={handleChange}
              placeholder="Example: 2025-2026"
            />

          </div>


          {/* Roll Number */}

          <div className="results-filter-group">

            <label>
              Roll Number
            </label>

            <input
              type="text"
              name="rollNo"
              value={filters.rollNo}
              onChange={handleChange}
              placeholder="Search roll number"
            />

          </div>


          {/* Student Name */}

          <div className="results-filter-group">

            <label>
              Student Name
            </label>

            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              placeholder="Search student name"
            />

          </div>


          {/* Exam */}

          <div className="results-filter-group">

            <label>
              Exam
            </label>

            <select
              name="examId"
              value={filters.examId}
              onChange={handleChange}
            >

              <option value="">
                All Exams
              </option>

              {exams.map((exam) => (

                <option
                  key={exam._id}
                  value={exam._id}
                >
                  {exam.examName} ({exam.examCode})
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* Filter Buttons */}

        <div className="results-filter-buttons">

          <button
            className="search-results-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search Results"}
          </button>


          <button
            className="clear-results-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      </div>


      {/* =====================================
          RESULTS
      ===================================== */}

      <div className="admin-results-list-card">

        <div className="results-list-header">

          <h2>
            Results
          </h2>

          <span>
            {results.length} result(s)
          </span>

        </div>


        {error && (
          <p className="admin-results-error">
            {error}
          </p>
        )}


        {loading ? (

          <p className="results-loading">
            Loading results...
          </p>

        ) : results.length === 0 ? (

          <p className="no-results">
            No results found.
          </p>

        ) : (

          <div className="admin-results-table-container">

            <table className="admin-results-table">

              <thead>

                <tr>

                  <th>S.No</th>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>Academic Year</th>
                  <th>Exam</th>
                  <th>Subject-wise Marks</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {results.map((result, index) => (

                  <tr key={`${result.student.id}-${result.exam.id}`}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {result.student.rollNo}
                    </td>

                    <td>
                      {result.student.name}
                    </td>

                    <td>
                      {result.student.branch}
                    </td>

                    <td>
                      {result.student.academicYear}
                    </td>

                    <td>
                      {result.exam.examName}
                    </td>

                    <td>

                      <div className="subject-marks-list">

                        {result.subjects.map((subject) => (

                          <div
                            key={subject.subjectId}
                            className="subject-mark-item"
                          >

                            <strong>
                              {subject.subjectCode}
                            </strong>

                            <span>
                              {subject.marks}/
                              {subject.maxMarks}
                            </span>

                          </div>

                        ))}

                      </div>

                    </td>

                    <td>
                      {result.totalMarks}/
                      {result.maxTotalMarks}
                    </td>

                    <td>
                      {result.percentage}%
                    </td>

                    <td>
                      <span
                        className={`grade-badge grade-${result.grade.replace(
                          "+",
                          "plus"
                        )}`}
                      >
                        {result.grade}
                      </span>
                    </td>

                    <td>

                      <span
                        className={
                          result.resultStatus === "Pass"
                            ? "status-pass"
                            : "status-fail"
                        }
                      >
                        {result.resultStatus}
                      </span>

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

export default AdminResults;