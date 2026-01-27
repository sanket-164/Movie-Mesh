import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card border-0 shadow-sm p-4"
        style={{ width: "100%", maxWidth: "380px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <h4 className="fw-semibold">Welcome Back</h4>
          <p className="text-muted small mb-0">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            {/* <a href="#" className="small text-decoration-none">
              Forgot password?
            </a> */}
          </div>

          <button className="btn btn-dark w-100 py-2" type="submit">
            Sign In
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="small text-muted">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
