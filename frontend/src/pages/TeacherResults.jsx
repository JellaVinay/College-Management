import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TeacherResults.css";

function TeacherResults() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    studentId: "",
    semester: "",
    academicYear: "",
  });

  const [subjects, setSubjects] = useState([
    {
      subjectName: "",
      marks: "",
      maxMarks: 100,
    },
  ]);

  const [results, setResults] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [totalMarks, setTotalMarks] = useState(0);
  const [maxTotalMarks, setMaxTotalMarks] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [grade, setGrade] = useState("");
  const [resultStatus, setResultStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all results
  const fetchResults = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/results"
      );

      setResults(response.data);
    } catch (error) {
      console.error("Fetch results error:", error);

      setError("Failed to load results.");
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Calculate result
  useEffect(() => {
    let total = 0;
    let maxTotal = 0;

    subjects.forEach((subject) => {
      total += Number(subject.marks) || 0;
      maxTotal += Number(subject.maxMarks) || 0;
    });

    const calculatedPercentage =
      maxTotal > 0 ? (total / maxTotal) * 100 : 0;

    let calculatedGrade = "";

    if (calculatedPercentage >= 90) {
      calculatedGrade = "A+";
    } else if (calculatedPercentage >= 80) {
      calculatedGrade = "A";
    } else if (calculatedPercentage >= 70) {
      calculatedGrade = "B";
    } else if (calculatedPercentage >= 60) {
      calculatedGrade = "C";
    } else if (calculatedPercentage >= 50) {
      calculatedGrade = "D";
    } else if (calculatedPercentage >= 40) {
      calculatedGrade = "E";
    } else {
      calculatedGrade = "F";
    }

    const failedSubject = subjects.some((subject) => {
      if (subject.marks === "") {
        return false;
      }

      return (
        Number(subject.marks) <
        Number(subject.maxMarks) * 0.4
      );
    });

    const calculatedStatus =
      calculatedPercentage >= 40 && !failedSubject
        ? "Pass"
        : "Fail";

    setTotalMarks(total);
    setMaxTotalMarks(maxTotal);
    setPercentage(
      Number(calculatedPercentage.toFixed(2))
    );
    setGrade(calculatedGrade);
    setResultStatus(calculatedStatus);
  }, [subjects]);

  // Basic form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  // Subject change
  const handleSubjectChange = (
    index,
    field,
    value
  ) => {
    const updatedSubjects = [...subjects];

    updatedSubjects[index][field] = value;

    setSubjects(updatedSubjects);

    setMessage("");
    setError("");
  };

  // Add subject
  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        subjectName: "",
        marks: "",
        maxMarks: 100,
      },
    ]);
  };

  // Remove subject
  const removeSubject = (index) => {
    if (subjects.length === 1) {
      return;
    }

    setSubjects(
      subjects.filter(
        (_, subjectIndex) => subjectIndex !== index
      )
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      studentId: "",
      semester: "",
      academicYear: "",
    });

    setSubjects([
      {
        subjectName: "",
        marks: "",
        maxMarks: 100,
      },
    ]);

    setEditingId(null);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.studentId.trim()) {
      return "Please enter Student ID.";
    }

    if (!formData.semester) {
      return "Please select a semester.";
    }

    if (!formData.academicYear.trim()) {
      return "Please enter academic year.";
    }

    for (const subject of subjects) {
      if (!subject.subjectName.trim()) {
        return "Please enter all subject names.";
      }

      if (subject.marks === "") {
        return "Please enter marks for all subjects.";
      }

      if (Number(subject.marks) < 0) {
        return "Marks cannot be negative.";
      }

      if (
        Number(subject.marks) >
        Number(subject.maxMarks)
      ) {
        return "Marks cannot be greater than maximum marks.";
      }
    }

    return null;
  };

  // Add / Update result
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const resultData = {
      studentId: formData.studentId,
      semester: formData.semester,
      academicYear: formData.academicYear,

      subjects: subjects.map((subject) => ({
        subjectName: subject.subjectName,
        marks: Number(subject.marks),
        maxMarks: Number(subject.maxMarks),
      })),

      totalMarks,
      maxTotalMarks,
      percentage,
      grade,
      resultStatus,

      teacherUserId: user.userId,
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/results/${editingId}`,
          resultData
        );

        setMessage("Result updated successfully.");
      } else {
        await axios.post(
          "http://localhost:5000/api/results",
          resultData
        );

        setMessage("Result added successfully.");
      }

      resetForm();
      fetchResults();
    } catch (error) {
      console.error("Save result error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save result."
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit result
  const handleEdit = (result) => {
    setEditingId(result._id);

    setFormData({
      studentId: result.studentId,
      semester: result.semester,
      academicYear: result.academicYear,
    });

    setSubjects(
      result.subjects.map((subject) => ({
        subjectName: subject.subjectName,
        marks: subject.marks,
        maxMarks: subject.maxMarks,
      }))
    );

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="teacher-results-page">

      {/* Header */}
      <div className="teacher-results-header">

        <div>
          <h1>Student Results</h1>

          <p>
            Add and update examination results
          </p>
        </div>

        <button
          className="teacher-results-back-btn"
          onClick={() => navigate("/teacher")}
        >
          Back to Dashboard
        </button>

      </div>

      {/* Result Form */}
      <div className="teacher-result-form-card">

        <h2>
          {editingId
            ? "Update Student Result"
            : "Add Student Result"}
        </h2>

        {message && (
          <p className="teacher-result-success">
            {message}
          </p>
        )}

        {error && (
          <p className="teacher-result-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Student Details */}
          <div className="teacher-result-basic-grid">

            <div className="teacher-result-form-group">

              <label>
                Student ID
              </label>

              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleFormChange}
                placeholder="Example: 23CS101"
              />

            </div>

            <div className="teacher-result-form-group">

              <label>
                Semester
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleFormChange}
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

            <div className="teacher-result-form-group">

              <label>
                Academic Year
              </label>

              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleFormChange}
                placeholder="Example: 2025-2026"
              />

            </div>

          </div>

          {/* Subjects */}
          <div className="teacher-subjects-section">

            <div className="teacher-subjects-title">

              <h3>
                Subject Marks
              </h3>

              <button
                type="button"
                className="teacher-add-subject-btn"
                onClick={addSubject}
              >
                + Add Subject
              </button>

            </div>

            {subjects.map((subject, index) => (

              <div
                className="teacher-subject-row"
                key={index}
              >

                <div className="teacher-result-form-group">

                  <label>
                    Subject Name
                  </label>

                  <input
                    type="text"
                    value={subject.subjectName}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "subjectName",
                        e.target.value
                      )
                    }
                    placeholder="Subject name"
                  />

                </div>

                <div className="teacher-result-form-group">

                  <label>
                    Marks
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={subject.marks}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "marks",
                        e.target.value
                      )
                    }
                    placeholder="Marks"
                  />

                </div>

                <div className="teacher-result-form-group">

                  <label>
                    Maximum Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={subject.maxMarks}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "maxMarks",
                        e.target.value
                      )
                    }
                  />

                </div>

                <button
                  type="button"
                  className="teacher-remove-subject-btn"
                  onClick={() =>
                    removeSubject(index)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          {/* Calculated Result */}
          <div className="teacher-calculated-result">

            <div>
              <span>Total</span>

              <strong>
                {totalMarks} / {maxTotalMarks}
              </strong>
            </div>

            <div>
              <span>Percentage</span>

              <strong>
                {percentage}%
              </strong>
            </div>

            <div>
              <span>Grade</span>

              <strong>
                {grade}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong
                className={
                  resultStatus === "Pass"
                    ? "teacher-status-pass"
                    : "teacher-status-fail"
                }
              >
                {resultStatus}
              </strong>
            </div>

          </div>

          <div className="teacher-result-form-buttons">

            <button
              type="submit"
              className="teacher-save-result-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Result"
                : "Save Result"}
            </button>

            {editingId && (
              <button
                type="button"
                className="teacher-cancel-edit-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Existing Results */}
      <div className="teacher-results-list-card">

        <h2>
          Student Results
        </h2>

        {results.length === 0 ? (

          <p className="teacher-no-results">
            No results available.
          </p>

        ) : (

          <div className="teacher-results-table-container">

            <table className="teacher-results-table">

              <thead>

                <tr>
                  <th>S.No</th>
                  <th>Student ID</th>
                  <th>Semester</th>
                  <th>Academic Year</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {results.map((result, index) => (

                  <tr key={result._id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {result.studentId}
                    </td>

                    <td>
                      {result.semester}
                    </td>

                    <td>
                      {result.academicYear}
                    </td>

                    <td>
                      {result.totalMarks} /{" "}
                      {result.maxTotalMarks}
                    </td>

                    <td>
                      {result.percentage}%
                    </td>

                    <td>
                      {result.grade}
                    </td>

                    <td>
                      {result.resultStatus}
                    </td>

                    <td>

                      <button
                        className="teacher-edit-result-btn"
                        onClick={() =>
                          handleEdit(result)
                        }
                      >
                        Edit
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

export default TeacherResults;