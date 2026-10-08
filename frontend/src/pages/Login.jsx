import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      );

      const { token, user } = response.data;

      // Store login information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "teacher") {
        navigate("/teacher");
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">

          <h1>College Management System</h1>

          <p>
            Login to access your account
          </p>

        </div>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Login As
            </label>

            <select
              name="role"
              value={loginData.role}
              onChange={handleChange}
            >

              <option value="student">
                Student
              </option>

              <option value="teacher">
                Teacher
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              ID
            </label>

            <input
              type="text"
              name="userId"
              value={loginData.userId}
              onChange={handleChange}
              placeholder="Enter your ID"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

          </div>


          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        <div className="login-links">

          <Link to="/">
            Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;