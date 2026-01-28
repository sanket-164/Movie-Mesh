import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          {/* Left Content */}
          <div className="col-md-6">
            <span className="badge bg-dark mb-3">
              🎬 Movie Discovery Platform
            </span>

            <h1 className="display-5 fw-bold mb-3">
              Discover Movies <br />
              <span className="text-primary">Beyond the Obvious</span>
            </h1>

            <p className="text-muted fs-5 mb-4">
              Search movies by title, plot, cast, directors and more. Movie-Mesh
              helps you uncover hidden gems and cinematic stories.
            </p>
          </div>

          {/* Right Visual */}
          <div className="col-md-6 text-center">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
                alt="Cinema"
                className="img-fluid rounded-4 shadow"
              />
              <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white px-3 py-2 mb-2 rounded-pill shadow-sm small">
                🍿 Search Filter Discover
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row text-center mb-4">
          <h2 className="fw-bold">Why Movie-Mesh?</h2>
          <p className="text-muted">
            A smarter way to explore the world of cinema
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: "bi-search",
              title: "Advanced Search",
              desc: "Search across title, plot, cast, genres & more.",
            },
            {
              icon: "bi-funnel",
              title: "Powerful Filters",
              desc: "Refine results with precision and ease.",
            },
            {
              icon: "bi-lightning-charge",
              title: "Fast & Lightweight",
              desc: "Optimized for speed and smooth experience.",
            },
          ].map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body text-center p-4">
                  <i className={`bi ${item.icon} fs-1 text-primary mb-3`}></i>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-dark text-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to explore cinema differently?</h3>
          <p className="text-secondary mb-4">
            Start searching and let Movie-Mesh guide you.
          </p>
          <button
            className="btn btn-light btn-lg rounded-pill px-5"
            onClick={() => navigate("/search")}
          >
            Search Movies
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
