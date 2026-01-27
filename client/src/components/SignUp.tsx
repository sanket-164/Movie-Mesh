import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card border-0 shadow-sm p-4"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <h4 className="fw-semibold">Create Account</h4>
          <p className="text-muted small mb-0">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              required={true}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-dark w-100 py-2 mt-2" type="submit">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="small text-muted">
            Already have an account?{" "}
            <Link to="/signin" className="text-decoration-none">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
