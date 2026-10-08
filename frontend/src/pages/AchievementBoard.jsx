import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AchievementBoard.css";

function AchievementBoard() {
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/achievements"
      );

      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);

      setError("Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleBack = () => {
    if (user?.role === "student") {
      navigate("/student");
    } else if (user?.role === "teacher") {
      navigate("/teacher");
    } else if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="achievement-board-page">

      <div className="achievement-board-header">
        <div>
          <h1>Achievements</h1>
          <p>College achievements and student accomplishments</p>
        </div>

        <button
          className="achievement-board-back-btn"
          onClick={handleBack}
        >
          Back to Dashboard
        </button>
      </div>

      {loading && (
        <p className="achievement-loading">
          Loading achievements...
        </p>
      )}

      {error && (
        <p className="achievement-board-error">
          {error}
        </p>
      )}

      {!loading && !error && achievements.length === 0 && (
        <div className="no-achievement-board">
          <h2>No Achievements Available</h2>
          <p>
            There are no achievements uploaded by the admin yet.
          </p>
        </div>
      )}

      {!loading && !error && achievements.length > 0 && (
        <div className="achievement-board-list">

          {achievements.map((achievement) => (
            <div
              className="achievement-board-card"
              key={achievement._id}
            >

              {achievement.image && (
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="achievement-board-image"
                />
              )}

              <div className="achievement-board-content">

                <h2>{achievement.title}</h2>

                <p className="achievement-student">
                  <strong>Student ID:</strong>{" "}
                  {achievement.studentId}
                </p>

                <p className="achievement-date">
                  <strong>Date:</strong>{" "}
                  {new Date(
                    achievement.date
                  ).toLocaleDateString()}
                </p>

                <p className="achievement-description">
                  {achievement.description}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AchievementBoard;