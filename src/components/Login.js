import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginAttempt() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [, setErrorMessage] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const synth = window.speechSynthesis;
    const instruction = new SpeechSynthesisUtterance("Welcome to One4All. Navigation through the app for visually impaired users can be done through arrow keys.")
    synth.speak(instruction);
    return() => synth.cancel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");

      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      }, {
        withCredentials:true
      });

      if (response.status === 200) {
        navigate("/Home");
      }
    } catch (error) {
      console.error("Error:", error);

      setErrorMessage(
        "Your email and/or password are incorrect. Please try again."
      );
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
        <h3>Sign In</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </form>
    </div>
  );
}
