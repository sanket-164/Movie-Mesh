import { useNavigate } from "react-router-dom";
import Logo from "../assets/Movie-Mesh-Logo.png";
import LogoText from "../assets/Movie-Mesh-Logo-Text.png";

const ExploreBar = () => {
  const navigate = useNavigate();

  return (
    <div className="border-bottom bg-white sticky-top shadow-sm">
      <div className="container py-2 py-md-3 d-flex justify-content-between align-items-center">
        {/* Logo Section - Responsive sizing and visibility */}
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/explore")}
          aria-label="Go to home page"
        >
          {/* Always visible icon logo - scales perfectly */}
          <img
            src={Logo}
            alt="Movie-Mesh Logo"
            className="img-fluid"
            style={{ height: "36px", maxHeight: "40px" }}
          />

          {/* Text logo: hidden on mobile, visible on medium+ screens */}
          <img
            src={LogoText}
            alt="Movie-Mesh"
            className="img-fluid"
            style={{ height: "20px", maxHeight: "24px" }}
          />
        </div>

        {/* Search Button - Responsive text and sizing */}
        <button
          className="btn btn-dark px-3 px-md-4 py-2 fw-medium"
          onClick={() => navigate("/search")}
          aria-label="Search movies"
        >
          <span className="d-none d-sm-inline">Search Movies</span>
          <span className="d-sm-none">Search</span>
        </button>
      </div>
    </div>
  );
};

export default ExploreBar;
