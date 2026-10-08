import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Notices.css";

function Notices() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [notices, setNotices] = useState([]);

  const [notice, setNotice] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notices"
      );

      setNotices(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load notices"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNotice({
      ...notice,
      [name]: value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/notices",
        {
          ...notice,
          adminUserId: user.userId,
        }
      );

      setMessage(response.data.message);

      setNotice({
        title: "",
        description: "",
      });

      fetchNotices();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create notice"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/notices/${id}`
      );

      fetchNotices();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete notice"
      );
    }
  };

  return (
    <div className="notices-page">

      <div className="notices-container">

        {/* Header */}

        <div className="notices-header">

          <div>
            <h1>Notice Management</h1>
            <p>Create and manage college notices</p>
          </div>

          <button
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

        </div>


        {/* Create Notice */}

        <div className="notice-form-section">

          <h2>Create Notice</h2>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Notice Title</label>

              <input
                type="text"
                name="title"
                value={notice.title}
                onChange={handleChange}
                placeholder="Enter notice title"
                required
              />

            </div>


            <div className="form-group">

              <label>Notice Description</label>

              <textarea
                name="description"
                value={notice.description}
                onChange={handleChange}
                placeholder="Enter notice details"
                rows="5"
                required
              />

            </div>


            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Publishing..."
                : "Publish Notice"}
            </button>

          </form>

        </div>


        {/* Notice List */}

        <div className="notice-list-section">

          <h2>Published Notices</h2>

          {loading && (
            <p>Loading notices...</p>
          )}

          {!loading && notices.length === 0 && (
            <div className="no-notices">
              No notices available.
            </div>
          )}

          {!loading &&
            notices.map((item) => (

              <div
                className="notice-card"
                key={item._id}
              >

                <div className="notice-card-content">

                  <h3>{item.title}</h3>

                  <p>
                    {item.description}
                  </p>

                  <small>
                    Published by{" "}
                    {item.createdBy?.name || "Admin"}
                    {" • "}
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>

                <button
                  className="delete-notice-button"
                  onClick={() =>
                    handleDelete(item._id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default Notices;