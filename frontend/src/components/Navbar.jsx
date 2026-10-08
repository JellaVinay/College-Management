import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        College Management System
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link to="/contact">
          Contact
        </Link>

        <Link to="/login">
          Login
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;