import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../api/auth.api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const data = await signUp(user.name, user.email, user.password);
      console.log("Sign Up Successful:", data);
      navigate("/signin");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.error || "Sign Up Failed");
      } else {
        alert("An unexpected error occurred.");
      }
    }
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

        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              name="name"
              value={user.name}
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              name="email"
              value={user.email}
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              name="password"
              value={user.password}
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              name="confirmPassword"
              value={user.confirmPassword}
              required={true}
              onChange={handleChange}
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
