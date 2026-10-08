import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TeacherMarks.css";

function TeacherMarks() {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [marksLoading, setMarksLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ==========================================
  // FETCH TEACHER SUBJECTS
  // ==========================================

  const fetchSubjects = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/marks/teacher/${userId}/subjects`
      );

      setSubjects(response.data.subjects);

      

    } catch (error) {

      console.error(
        "Fetch teacher subjects error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load subjects"
      );

    } finally {

      setLoading(false);

    }
  };


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

      console.error(
        "Fetch exams error:",
        error
      );

      setError(
        "Failed to load exams"
      );
    }
  };


  useEffect(() => {

    if (userId) {
      fetchSubjects();
      fetchExams();
    }

  }, [userId]);


  // ==========================================
  // SUBJECT CHANGE
  // ==========================================

  const handleSubjectChange = (e) => {

    setSelectedSubject(e.target.value);

    setStudents([]);

    setMessage("");
    setError("");
  };


  // ==========================================
  // EXAM CHANGE
  // ==========================================

  const handleExamChange = (e) => {

    setSelectedExam(e.target.value);

    setStudents([]);

    setMessage("");
    setError("");
  };


  // ==========================================
  // LOAD STUDENTS + MARKS
  // ==========================================

  const loadMarks = async () => {

    if (!selectedSubject || !selectedExam) {

      setError(
        "Please select both subject and exam"
      );

      return;
    }


    try {

      setMarksLoading(true);

      setMessage("");
      setError("");


      const response = await axios.get(
        `http://localhost:5000/api/marks/teacher/${userId}/subject/${selectedSubject}/exam/${selectedExam}`
      );
;
      setStudents(response.data.students);

    } catch (error) {

      console.error(
        "Load marks error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load students"
      );

    } finally {

      setMarksLoading(false);

    }
  };


  // ==========================================
  // HANDLE MARK CHANGE
  // ==========================================

  const handleMarkChange = (studentId, value) => {

    setStudents((previousStudents) =>
      previousStudents.map((item) =>
        item.student._id === studentId
          ? {
              ...item,
              marks: value,
            }
          : item
      )
    );

    setMessage("");
    setError("");
  };


  // ==========================================
  // SAVE MARK
  // ==========================================

  const saveMark = async (student) => {

    if (
      student.marks === "" ||
      student.marks === null ||
      student.marks === undefined
    ) {

      setError(
        `Please enter marks for ${student.student.name}`
      );

      return;
    }


    try {

      setMessage("");
      setError("");


      const response = await axios.post(
        "http://localhost:5000/api/marks",
        {
          userId,
          studentId: student.student._id,
          subjectId: selectedSubject,
          examId: selectedExam,
          marks: Number(student.marks),
          maxMarks: Number(student.maxMarks || 100),
        }
      );


      setMessage(
        `${student.student.name}: ${response.data.message}`
      );


      // Reload latest marks

      await loadMarks();

    } catch (error) {

      console.error(
        "Save mark error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to save marks"
      );
    }
  };


  return (
    <div className="teacher-marks-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="teacher-marks-header">

        <div>

          <h1>
            Subject Marks
          </h1>

          <p>
            Enter and update marks for your assigned subjects
          </p>

        </div>

      </div>


      {/* ======================================
          SELECTION CARD
      ====================================== */}

      <div className="marks-selection-card">

        <h2>
          Select Subject & Exam
        </h2>


        {message && (
          <p className="marks-success">
            {message}
          </p>
        )}


        {error && (
          <p className="marks-error">
            {error}
          </p>
        )}


        <div className="marks-selection-grid">

          {/* SUBJECT */}

          <div className="marks-form-group">

            <label>
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
            >

              <option value="">
                Select Subject
              </option>

              {subjects.map((subject) => (

                <option
                  key={subject._id}
                  value={subject._id}
                >

                  {subject.subjectName}
                  {" "}
                  ({subject.subjectCode})

                </option>

              ))}

            </select>

          </div>


          {/* EXAM */}

          <div className="marks-form-group">

            <label>
              Exam
            </label>

            <select
              value={selectedExam}
              onChange={handleExamChange}
            >

              <option value="">
                Select Exam
              </option>

              {exams.map((exam) => (

                <option
                  key={exam._id}
                  value={exam._id}
                >

                  {exam.examName}
                  {" "}
                  ({exam.examCode})

                </option>

              ))}

            </select>

          </div>


          {/* LOAD BUTTON */}

          <div className="load-marks-wrapper">

            <button
              className="load-marks-btn"
              onClick={loadMarks}
              disabled={marksLoading}
            >

              {marksLoading
                ? "Loading..."
                : "Load Students"}

            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          STUDENT MARKS TABLE
      ====================================== */}

      {students.length > 0 && (

        <div className="teacher-marks-list-card">

          <h2>
            Student Marks
          </h2>


          <div className="teacher-marks-table-container">

            <table className="teacher-marks-table">

              <thead>

                <tr>

                  <th>
                    S.No
                  </th>

                  <th>
                    Roll No
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Branch
                  </th>

                  <th>
                    Marks
                  </th>

                  <th>
                    Max Marks
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.map((item, index) => (

                  <tr key={item.student._id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {item.student.rollNo}
                    </td>

                    <td>
                      {item.student.name}
                    </td>

                    <td>
                      {item.student.branch}
                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max={item.maxMarks || 100}
                        value={item.marks}
                        onChange={(e) =>
                          handleMarkChange(
                            item.student._id,
                            e.target.value
                          )
                        }
                        className="marks-input"
                      />

                    </td>

                    <td>
                      {item.maxMarks || 100}
                    </td>

                    <td>

                      <button
                        className="save-mark-btn"
                        onClick={() =>
                          saveMark(item)
                        }
                      >
                        Save
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* ======================================
          NO STUDENTS
      ====================================== */}

      {!marksLoading &&
        selectedSubject &&
        selectedExam &&
        students.length === 0 && (

          <div className="no-students-card">

            <p>
              No students found for this subject.
            </p>

          </div>

        )}

    </div>
  );
}

export default TeacherMarks;