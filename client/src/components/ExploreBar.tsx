import { useNavigate } from "react-router-dom";
import Logo from "../assets/Movie-Mesh-Logo.png";

const ExploreBar = () => {
  const navigate = useNavigate();

  return (
    <div className="border-bottom bg-white sticky-top">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <img
            src={Logo}
            alt="Movie-Mesh"
            height={36}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/explore")}
          />

          <div>
            <h5 className="mb-0 fw-semibold">21,349 movies available</h5>
          </div>
        </div>

        <button className="btn btn-dark" onClick={() => navigate("/search")}>
          Search Movies
        </button>
      </div>
    </div>
  );
};

export default ExploreBar;
