import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/StudentDetails.css";

function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/students/${id}`
            );

            setStudent(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load student details"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/students/${id}`
            );

            alert("Student deleted successfully");

            navigate("/admin/students");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete student"
            );
        }
    };

    if (loading) {
        return (
            <div className="student-details-page">
                <div className="details-container">
                    <p>Loading student details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-details-page">
                <div className="details-container">

                    <div className="error-message">
                        {error}
                    </div>

                    <button
                        onClick={() => navigate("/admin/students")}
                    >
                        ← Back to Student List
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="student-details-page">

            <div className="details-container">

                {/* Header */}

                <div className="details-header">

                    <div>
                        <h1>Student Details</h1>
                        <p>Complete student profile</p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/students")}
                    >
                        ← Back to List
                    </button>

                </div>

                {/* Student Information */}

                <div className="student-profile">

                    <div className="profile-section">

                        <h2>Basic Information</h2>

                        <div className="details-grid">

                            <div className="detail-item">
                                <span>Student Name</span>
                                <strong>{student.name}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Student ID</span>
                                <strong>
                                    {student.user?.userId || student.rollNo}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Roll Number</span>
                                <strong>{student.rollNo}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Email</span>
                                <strong>{student.email}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Phone Number</span>
                                <strong>{student.phoneNo}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Branch</span>
                                <strong>{student.branch}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Academic Year</span>
                                <strong>{student.academicYear}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Role</span>
                                <strong>{student.user?.role}</strong>
                            </div>

                        </div>

                    </div>

                    {/* Future Academic Information */}

                    <div className="profile-section">

                        <h2>Academic Information</h2>

                        <p className="coming-soon">
                            Attendance, subject-wise marks, previous academic
                            records and assignments will be added here later.
                        </p>

                    </div>

                    {/* Actions */}

                    <div className="student-actions">

                    <button
                        className="edit-button"
                        onClick={() =>
                            navigate(`/admin/students/${id}/edit`)
                        }
                    >
                        Edit Student
                    </button>

                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        Delete Student
                    </button>
                    </div>

                </div>

            </div>

        </div >
    );
}

export default StudentDetails;