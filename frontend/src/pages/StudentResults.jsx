import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StudentResults.css";

function StudentResults() {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => { 
    const fetchResults = async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.id) {
          setError("Student information not found.");
          return;
        }

        // Get student record using logged-in User ID
        const studentResponse = await axios.get(
          `http://localhost:5000/api/students/user/${user.id}`
        );

        const studentData = studentResponse.data;

        setStudent(studentData);

        // Get student's results
        const resultResponse = await axios.get(
          `http://localhost:5000/api/results/student/${studentData._id}`
        );

        setResults(resultResponse.data.results || []);

      } catch (error) {
        console.error(
          "Student results error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="student-results-page">
        <h1>My Results</h1>
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="student-results-page">

      <div className="student-results-header">
        <h1>My Results</h1>
        <p>
          View your examination results
        </p>
      </div>

      {error && (
        <div className="student-results-error">
          {error}
        </div>
      )}

      {student && (
        <div className="student-info-card">

          <h2>Student Information</h2>

          <div className="student-info-grid">

            <p>
              <strong>Name:</strong>{" "}
              {student.name}
            </p>

            <p>
              <strong>Roll No:</strong>{" "}
              {student.rollNo}
            </p>

            <p>
              <strong>Branch:</strong>{" "}
              {student.branch}
            </p>

            <p>
              <strong>Academic Year:</strong>{" "}
              {student.academicYear}
            </p>

          </div>

        </div>
      )}

      {results.length === 0 && !error && (
        <div className="no-results-card">
          <h2>No Results Available</h2>
          <p>
            Your marks have not been published yet.
          </p>
        </div>
      )}

      {results.map((result) => (

        <div
          className="student-result-card"
          key={result.exam.id}
        >

          <div className="result-exam-header">

            <div>
              <h2>
                {result.exam.examName}
              </h2>

              <p>
                Exam Code: {result.exam.examCode}
              </p>

              <p>
                Semester: {result.exam.semester}
              </p>

            </div>

            <div className="result-summary">

              <h3>
                {result.percentage}%
              </h3>

              <span>
                Grade: {result.grade}
              </span>

              <span>
                {result.resultStatus}
              </span>

            </div>

          </div>

          <div className="student-results-table-container">

            <table className="student-results-table">

              <thead>

                <tr>
                  <th>S.No</th>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                </tr>

              </thead>

              <tbody>

                {result.subjects.map(
                  (subject, index) => (

                    <tr
                      key={subject.subjectId}
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {subject.subjectName}
                      </td>

                      <td>
                        {subject.subjectCode}
                      </td>

                      <td>
                        {subject.marks}
                      </td>

                      <td>
                        {subject.maxMarks}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          <div className="result-total">

            <p>
              <strong>Total:</strong>{" "}
              {result.totalMarks} /{" "}
              {result.maxTotalMarks}
            </p>

            <p>
              <strong>Percentage:</strong>{" "}
              {result.percentage}%
            </p>

            <p>
              <strong>Grade:</strong>{" "}
              {result.grade}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {result.resultStatus}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
}

export default StudentResults;