import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Subjects.css";

function Subjects() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // SUBJECT STATE
  // =========================

  const [subjects, setSubjects] = useState([]);

  const [subjectForm, setSubjectForm] = useState({
    subjectName: "",
    subjectCode: "",
    branch: "",
    semester: "",
  });

  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // =========================
  // ASSIGNMENT STATE
  // =========================

  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [assignmentForm, setAssignmentForm] = useState({
    subjectId: "",
    teacherId: "",
    branch: "",
    semester: "",
    academicYear: "",
  });

  const [editingAssignmentId, setEditingAssignmentId] =
    useState(null);

  // =========================
  // COMMON STATE
  // =========================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH SUBJECTS
  // =========================

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subjects"
      );

      setSubjects(response.data);
    } catch (error) {
      console.error("Fetch subjects error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load subjects."
      );
    }
  };

  // =========================
  // FETCH TEACHERS
  // =========================

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/teachers"
      );

      setTeachers(response.data);
    } catch (error) {
      console.error("Fetch teachers error:", error);

      setError("Failed to load teachers.");
    }
  };

  // =========================
  // FETCH ASSIGNMENTS
  // =========================

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subject-assignments"
      );

      setAssignments(response.data);
    } catch (error) {
      console.error(
        "Fetch assignments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load subject assignments."
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
    fetchAssignments();
  }, []);

  // =========================
  // SUBJECT FORM CHANGE
  // =========================

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;

    setSubjectForm({
      ...subjectForm,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  // =========================
  // ASSIGNMENT FORM CHANGE
  // =========================

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;

    setAssignmentForm({
      ...assignmentForm,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  // =========================
  // RESET SUBJECT FORM
  // =========================

  const resetSubjectForm = () => {
    setSubjectForm({
      subjectName: "",
      subjectCode: "",
      branch: "",
      semester: "",
    });

    setEditingSubjectId(null);
  };

  // =========================
  // RESET ASSIGNMENT FORM
  // =========================

  const resetAssignmentForm = () => {
    setAssignmentForm({
      subjectId: "",
      teacherId: "",
      branch: "",
      semester: "",
      academicYear: "",
    });

    setEditingAssignmentId(null);
  };

  // =========================
  // CREATE / UPDATE SUBJECT
  // =========================

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !subjectForm.subjectName ||
      !subjectForm.subjectCode ||
      !subjectForm.branch ||
      !subjectForm.semester
    ) {
      setError("Please fill all subject fields.");
      return;
    }

    setLoading(true);

    try {
      if (editingSubjectId) {
        await axios.put(
          `http://localhost:5000/api/subjects/${editingSubjectId}`,
          {
            ...subjectForm,
            adminUserId: user.userId,
          }
        );

        setMessage(
          "Subject updated successfully."
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/subjects",
          {
            ...subjectForm,
            adminUserId: user.userId,
          }
        );

        setMessage(
          "Subject created successfully."
        );
      }

      resetSubjectForm();
      await fetchSubjects();
    } catch (error) {
      console.error(
        "Save subject error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save subject."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT SUBJECT
  // =========================

  const handleEditSubject = (subject) => {
    setEditingSubjectId(subject._id);

    setSubjectForm({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      branch: subject.branch,
      semester: subject.semester,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE SUBJECT
  // =========================

  const handleDeleteSubject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/subjects/${id}`,
        {
          data: {
            adminUserId: user.userId,
          },
        }
      );

      setMessage(
        "Subject deleted successfully."
      );

      await fetchSubjects();
      await fetchAssignments();
    } catch (error) {
      console.error(
        "Delete subject error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete subject."
      );
    }
  };

  // =========================
  // CREATE / UPDATE ASSIGNMENT
  // =========================

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !assignmentForm.subjectId ||
      !assignmentForm.teacherId ||
      !assignmentForm.branch ||
      !assignmentForm.semester ||
      !assignmentForm.academicYear
    ) {
      setError(
        "Please fill all assignment fields."
      );

      return;
    }

    setLoading(true);

    try {
      const data = {
        ...assignmentForm,
        adminUserId: user.userId,
      };

      if (editingAssignmentId) {
        await axios.put(
          `http://localhost:5000/api/subject-assignments/${editingAssignmentId}`,
          data
        );

        setMessage(
          "Subject assignment updated successfully."
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/subject-assignments",
          data
        );

        setMessage(
          "Subject assigned successfully."
        );
      }

      resetAssignmentForm();

      await fetchAssignments();
    } catch (error) {
      console.error(
        "Save assignment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save subject assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT ASSIGNMENT
  // =========================

  const handleEditAssignment = (assignment) => {
    setEditingAssignmentId(
      assignment._id
    );

    setAssignmentForm({
      subjectId:
        assignment.subject?._id || "",
      teacherId:
        assignment.teacher?._id || "",
      branch: assignment.branch || "",
      semester: assignment.semester || "",
      academicYear:
        assignment.academicYear || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE ASSIGNMENT
  // =========================

  const handleDeleteAssignment = async (
    id
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject assignment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/subject-assignments/${id}`,
        {
          params: {
            adminUserId: user.userId,
          },
        }
      );

      setMessage(
        "Subject assignment deleted successfully."
      );

      await fetchAssignments();
    } catch (error) {
      console.error(
        "Delete assignment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete subject assignment."
      );
    }
  };

  // =========================
  // AUTO-FILL ASSIGNMENT
  // =========================

  const handleAssignmentSubjectChange = (e) => {
    const subjectId = e.target.value;

    const selectedSubject = subjects.find(
      (subject) => subject._id === subjectId
    );

    setAssignmentForm({
      ...assignmentForm,
      subjectId,
      branch:
        selectedSubject?.branch || "",
      semester:
        selectedSubject?.semester || "",
    });

    setMessage("");
    setError("");
  };

  return (
    <div className="subjects-page">
      <div className="subjects-header">
        <div>
          <h1>Subject Management</h1>

          <p>
            Manage subjects and academic-year
            teacher assignments
          </p>
        </div>

        <button
          className="subjects-back-btn"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* =========================
          MESSAGES
      ========================= */}

      {message && (
        <p className="subject-success">
          {message}
        </p>
      )}

      {error && (
        <p className="subject-error">
          {error}
        </p>
      )}

      {/* =========================
          SUBJECT MANAGEMENT
      ========================= */}

      <div className="subject-form-card">
        <h2>
          {editingSubjectId
            ? "Update Subject"
            : "Create Subject"}
        </h2>

        <p>
          Create the permanent subject
          information.
        </p>

        <form
          onSubmit={handleSubjectSubmit}
        >
          <div className="subject-form-grid">
            {/* Subject Name */}

            <div className="subject-form-group">
              <label>
                Subject Name
              </label>

              <input
                type="text"
                name="subjectName"
                value={
                  subjectForm.subjectName
                }
                onChange={
                  handleSubjectChange
                }
                placeholder="Example: Database Management"
              />
            </div>

            {/* Subject Code */}

            <div className="subject-form-group">
              <label>
                Subject Code
              </label>

              <input
                type="text"
                name="subjectCode"
                value={
                  subjectForm.subjectCode
                }
                onChange={
                  handleSubjectChange
                }
                placeholder="Example: CS301"
              />
            </div>

            {/* Branch */}

            <div className="subject-form-group">
              <label>Branch</label>

              <select
                name="branch"
                value={
                  subjectForm.branch
                }
                onChange={
                  handleSubjectChange
                }
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

            {/* Semester */}

            <div className="subject-form-group">
              <label>Semester</label>

              <select
                name="semester"
                value={
                  subjectForm.semester
                }
                onChange={
                  handleSubjectChange
                }
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

                <option value="Semester 7">
                  Semester 7
                </option>

                <option value="Semester 8">
                  Semester 8
                </option>
              </select>
            </div>
          </div>

          <div className="subject-form-buttons">
            <button
              type="submit"
              className="save-subject-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingSubjectId
                ? "Update Subject"
                : "Create Subject"}
            </button>

            {editingSubjectId && (
              <button
                type="button"
                className="cancel-subject-btn"
                onClick={
                  resetSubjectForm
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          SUBJECT LIST
      ========================= */}

      <div className="subjects-list-card">
        <h2>Subjects</h2>

        {subjects.length === 0 ? (
          <p className="no-subjects">
            No subjects created yet.
          </p>
        ) : (
          <div className="subjects-table-container">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map(
                  (subject, index) => (
                    <tr key={subject._id}>
                      <td>{index + 1}</td>

                      <td>
                        {subject.subjectName}
                      </td>

                      <td>
                        {subject.subjectCode}
                      </td>

                      <td>
                        {subject.branch}
                      </td>

                      <td>
                        {subject.semester}
                      </td>

                      <td>
                        <button
                          className="edit-subject-btn"
                          onClick={() =>
                            handleEditSubject(
                              subject
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-subject-btn"
                          onClick={() =>
                            handleDeleteSubject(
                              subject._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          SUBJECT ASSIGNMENT
      ========================= */}

      <div className="subject-form-card">
        <h2>
          {editingAssignmentId
            ? "Update Subject Assignment"
            : "Assign Subject to Teacher"}
        </h2>

        <p>
          Assign a subject to a teacher for a
          specific academic year.
        </p>

        <form
          onSubmit={
            handleAssignmentSubmit
          }
        >
          <div className="subject-form-grid">
            {/* Subject */}

            <div className="subject-form-group">
              <label>Subject</label>

              <select
                name="subjectId"
                value={
                  assignmentForm.subjectId
                }
                onChange={
                  handleAssignmentSubjectChange
                }
              >
                <option value="">
                  Select Subject
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.subjectName} (
                    {subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher */}

            <div className="subject-form-group">
              <label>Teacher</label>

              <select
                name="teacherId"
                value={
                  assignmentForm.teacherId
                }
                onChange={
                  handleAssignmentChange
                }
              >
                <option value="">
                  Select Teacher
                </option>

                {teachers.map((teacher) => (
                  <option
                    key={teacher._id}
                    value={teacher._id}
                  >
                    {teacher.name} (
                    {teacher.teacherId})
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}

            <div className="subject-form-group">
              <label>Branch</label>

              <input
                type="text"
                name="branch"
                value={
                  assignmentForm.branch
                }
                readOnly
              />
            </div>

            {/* Semester */}

            <div className="subject-form-group">
              <label>Semester</label>

              <input
                type="text"
                name="semester"
                value={
                  assignmentForm.semester
                }
                readOnly
              />
            </div>

            {/* Academic Year */}

            <div className="subject-form-group">
              <label>
                Academic Year
              </label>

              <input
                type="text"
                name="academicYear"
                value={
                  assignmentForm.academicYear
                }
                onChange={
                  handleAssignmentChange
                }
                placeholder="Example: 2026-2027"
              />
            </div>
          </div>

          <div className="subject-form-buttons">
            <button
              type="submit"
              className="save-subject-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingAssignmentId
                ? "Update Assignment"
                : "Assign Subject"}
            </button>

            {editingAssignmentId && (
              <button
                type="button"
                className="cancel-subject-btn"
                onClick={
                  resetAssignmentForm
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          ASSIGNMENT LIST
      ========================= */}

      <div className="subjects-list-card">
        <h2>
          Subject Assignments
        </h2>

        {assignments.length === 0 ? (
          <p className="no-subjects">
            No subject assignments
            created yet.
          </p>
        ) : (
          <div className="subjects-table-container">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>
                    Academic Year
                  </th>
                  <th>Teacher</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map(
                  (assignment, index) => (
                    <tr
                      key={
                        assignment._id
                      }
                    >
                      <td>{index + 1}</td>

                      <td>
                        {
                          assignment
                            .subject
                            ?.subjectName
                        }
                      </td>

                      <td>
                        {
                          assignment
                            .subject
                            ?.subjectCode
                        }
                      </td>

                      <td>
                        {
                          assignment.branch
                        }
                      </td>

                      <td>
                        {
                          assignment.semester
                        }
                      </td>

                      <td>
                        {
                          assignment.academicYear
                        }
                      </td>

                      <td>
                        {assignment.teacher
                          ? `${assignment.teacher.name} (${assignment.teacher.teacherId})`
                          : "Not assigned"}
                      </td>

                      <td>
                        <button
                          className="edit-subject-btn"
                          onClick={() =>
                            handleEditAssignment(
                              assignment
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-subject-btn"
                          onClick={() =>
                            handleDeleteAssignment(
                              assignment._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjects;