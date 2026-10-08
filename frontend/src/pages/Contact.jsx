import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Contact.css";

function Contact() {
  return (
    <div className="contact-page">

        <Navbar />

      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>
          Get in touch with our college management team.
        </p>
      </section>

      <section className="contact-container">

        {/* Contact Information */}

        <div className="contact-info">

          <h2>College Information</h2>

          <div className="contact-item">
            <h3>Address</h3>
            <p>
              College Campus, Main Road,
              Telangana, India
            </p>
          </div>

          <div className="contact-item">
            <h3>Phone</h3>
            <p>
              +91 98765 43210
            </p>
          </div>

          <div className="contact-item">
            <h3>Email</h3>
            <p>
              college@example.com
            </p>
          </div>

          <div className="contact-item">
            <h3>Office Hours</h3>
            <p>
              Monday - Saturday
              <br />
              9:00 AM - 5:00 PM
            </p>
          </div>

        </div>


        {/* Contact Form */}

        <div className="contact-form">

          <h2>Send Us a Message</h2>

          <form>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                placeholder="Enter subject"
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                rows="5"
                placeholder="Enter your message"
              ></textarea>
            </div>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </section>


      {/* Navigation */}

      <section className="contact-navigation">

        <Link to="/" className="nav-button">
          Back to Home
        </Link>

        <Link to="/login" className="nav-button">
          Login
        </Link>

      </section>

    </div>
  );
}

export default Contact;


