import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Achievements.css";

function Achievements() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    studentId: "",
    description: "",
    date: "",
    image: "",
  });

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Get all achievements
  const fetchAchievements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/achievements"
      );

      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Failed to load achievements");
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Limit image size to 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  // Submit achievement
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/achievements", {
        ...formData,
        adminUserId: user.userId,
      });

      setMessage("Achievement added successfully!");

      setFormData({
        title: "",
        studentId: "",
        description: "",
        date: "",
        image: "",
      });

      // Reset file input
      document.getElementById("achievement-image").value = "";

      fetchAchievements();
    } catch (error) {
      console.error("Add achievement error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add achievement"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete achievement
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this achievement?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/achievements/${id}`
      );

      setMessage("Achievement deleted successfully!");

      fetchAchievements();
    } catch (error) {
      console.error("Delete achievement error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete achievement"
      );
    }
  };

  return (
    <div className="achievements-page">

      <div className="achievements-header">
        <div>
          <h1>Achievement Management</h1>
          <p>Upload and manage student achievements</p>
        </div>

        <button
          className="achievement-back-btn"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Add Achievement */}
      <div className="achievement-form-card">
        <h2>Add Achievement</h2>

        {message && (
          <p className="achievement-success">
            {message}
          </p>
        )}

        {error && (
          <p className="achievement-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="achievement-form-grid">

            <div className="achievement-form-group">
              <label>Achievement Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: State Level Cricket Winner"
                required
              />
            </div>

            <div className="achievement-form-group">
              <label>Student ID</label>

              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Example: 23CS101"
                required
              />
            </div>

            <div className="achievement-form-group">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="achievement-form-group">
              <label>Achievement Image</label>

              <input
                id="achievement-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

          </div>

          <div className="achievement-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter achievement details..."
              rows="5"
              required
            ></textarea>
          </div>

          {formData.image && (
            <div className="achievement-preview">
              <p>Image Preview</p>

              <img
                src={formData.image}
                alt="Achievement Preview"
              />
            </div>
          )}

          <button
            type="submit"
            className="achievement-submit-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Achievement"}
          </button>

        </form>
      </div>

      {/* Achievement List */}
      <div className="achievement-list-card">

        <h2>Uploaded Achievements</h2>

        {achievements.length === 0 ? (
          <p className="no-achievements">
            No achievements uploaded yet.
          </p>
        ) : (
          <div className="achievement-list">

            {achievements.map((achievement) => (
              <div
                className="achievement-item"
                key={achievement._id}
              >

                {achievement.image && (
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="achievement-image"
                  />
                )}

                <div className="achievement-content">

                  <h3>{achievement.title}</h3>

                  <p>
                    <strong>Student ID:</strong>{" "}
                    {achievement.studentId}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      achievement.date
                    ).toLocaleDateString()}
                  </p>

                  <p>{achievement.description}</p>

                  <button
                    className="achievement-delete-btn"
                    onClick={() =>
                      handleDelete(achievement._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Achievements;