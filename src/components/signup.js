import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accessibility: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");

      const response = await axios.post(
        "http://localhost:4000/register",
        formData, {withCredentials:true}
      );

      if (response.status === 201 && formData.accessibility === "") {
        navigate("/Home");
      } else {
        if (response.status === 201 && formData.accessibility === "vi") {
          navigate("/VISetup");
        } else if (response.status === 201 && formData.accessibility === "hi") {
          navigate("/HISetup");
        } else if (response.status === 201 && formData.accessibility === "nd") {
          navigate("/NDSetup");
        }
      }
    } catch (error) {
      console.error("Error:", error);

      setErrorMessage("Your signup failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>One4All</h1>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            name="firstName"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            name="lastName"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Please indicate any accessibility requirements you have</label>
          <select
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
          >
            <option value="">Not Applicable</option>
            <option value="vi">Visually impaired</option>
            <option value="hi">Hearing impaired</option>
            <option value="nd">Neurodivergent</option>
          </select>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
