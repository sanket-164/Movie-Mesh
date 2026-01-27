import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../api/auth.api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const data = await signIn(user.email, user.password);
      console.log("Sign In Successful:", data);

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      navigate("/search");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.error || "Sign In Failed");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
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

        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <button
            className="btn btn-dark w-100 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
