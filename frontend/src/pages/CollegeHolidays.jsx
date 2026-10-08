import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CollegeHolidays.css";

const CollegeHolidays = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [holidays, setHolidays] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    name: "",
    reason: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadHolidays = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/holidays"
      );

      setHolidays(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load holidays"
      );
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      date: "",
      name: "",
      reason: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.date || !formData.name) {
      setError("Date and holiday name are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/holidays/${editingId}`,
          {
            adminUserId: user.userId,
            date: formData.date,
            name: formData.name,
            reason: formData.reason,
          }
        );

        setMessage("Holiday updated successfully.");
      } else {
        await axios.post(
          "http://localhost:5000/api/holidays",
          {
            adminUserId: user.userId,
            date: formData.date,
            name: formData.name,
            reason: formData.reason,
          }
        );

        setMessage("Holiday added successfully.");
      }

      resetForm();
      loadHolidays();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save holiday"
      );
    }
  };

  const handleEdit = (holiday) => {
    const date = new Date(holiday.date);

    const localDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

    setFormData({
      date: localDate,
      name: holiday.name,
      reason: holiday.reason || "",
    });

    setEditingId(holiday._id);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this holiday?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/holidays/${id}`,
        {
          params: {
            adminUserId: user.userId,
          },
        }
      );

      setMessage("Holiday deleted successfully.");

      loadHolidays();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete holiday"
      );
    }
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="college-holidays-page">

      <h1>College Holidays</h1>

      <p className="page-description">
        Manage college-wide holidays that apply to all
        teachers and students.
      </p>

      {/* FORM */}

      <div className="holiday-form-card">

        <h2>
          {editingId
            ? "Edit College Holiday"
            : "Add College Holiday"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Holiday Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Holiday Name</label>

            <input
              type="text"
              name="name"
              placeholder="Example: College Festival"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Reason</label>

            <input
              type="text"
              name="reason"
              placeholder="Example: Dussehra Festival"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">

            <button type="submit">
              {editingId
                ? "Update Holiday"
                : "Add Holiday"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {message && (
        <div className="holiday-success">
          {message}
        </div>
      )}

      {error && (
        <div className="holiday-error">
          {error}
        </div>
      )}

      {/* HOLIDAY LIST */}

      <div className="holiday-list-section">

        <h2>College Holiday List</h2>

        {holidays.length === 0 ? (
          <p>No holidays added yet.</p>
        ) : (
          <div className="holiday-table-container">

            <table>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {holidays.map((holiday) => (
                  <tr key={holiday._id}>

                    <td>
                      {formatDate(holiday.date)}
                    </td>

                    <td>
                      {holiday.name}
                    </td>

                    <td>
                      {holiday.reason || "-"}
                    </td>

                    <td className="holiday-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(holiday)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(holiday._id)
                        }
                      >
                        Delete
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
};

export default CollegeHolidays;