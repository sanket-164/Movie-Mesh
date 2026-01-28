import { useNavigate } from "react-router-dom";
import NotFoundImage from "../assets/Page-Not-Found.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container text-center">
        {/* Illustration */}
        <img
          src={NotFoundImage}
          alt="Page not found"
          className="img-fluid rounded-4 shadow-sm mb-4"
          style={{ maxWidth: 420 }}
        />

        {/* Text */}
        <h1 className="display-6 fw-bold mb-2">
          404 <br /> Page Not Found
        </h1>
        <p className="text-muted mb-4">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-dark rounded-pill px-4"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>

          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
