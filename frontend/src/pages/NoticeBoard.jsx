import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/NoticeBoard.css";

function NoticeBoard() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "student") {
      navigate("/student");
    } else if (user?.role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="notice-board-page">

      <div className="notice-board-container">

        {/* Header */}

        <div className="notice-board-header">

          <div>
            <h1>College Notice Board</h1>
            <p>Latest college announcements</p>
          </div>

          <button onClick={handleBack}>
            ← Back
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <div className="notice-status">
            Loading notices...
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="notice-error">
            {error}
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          notices.length === 0 && (
            <div className="no-notices">
              <h3>No notices available</h3>
              <p>
                There are currently no college announcements.
              </p>
            </div>
          )}

        {/* Notices */}

        {!loading &&
          !error &&
          notices.length > 0 && (

            <div className="notice-list">

              {notices.map((notice) => (

                <div
                  className="notice-board-card"
                  key={notice._id}
                >

                  <div className="notice-card-top">

                    <h2>{notice.title}</h2>

                    <span>
                      {new Date(
                        notice.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <p>
                    {notice.description}
                  </p>

                  <div className="notice-publisher">
                    Published by{" "}
                    {notice.createdBy?.name || "Admin"}
                  </div>

                </div>

              ))}

            </div>
          )}

      </div>

    </div>
  );
}

export default NoticeBoard;