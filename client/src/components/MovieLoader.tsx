const MovieLoader = () => {
  return (
    <div className="container py-5">
      {/* Top Section */}
      <div className="row g-4">
        {/* Poster Skeleton */}
        <div className="col-12 col-md-4 col-lg-3">
          <div
            className="bg-light placeholder-glow rounded shadow-sm"
            style={{ height: "420px" }}
          >
            <span className="placeholder col-12 h-100 d-block"></span>
          </div>
        </div>

        {/* Main Info Skeleton */}
        <div className="col-12 col-md-8 col-lg-9">
          <h2 className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </h2>

          <p className="placeholder-glow">
            <span className="placeholder col-5"></span>
          </p>

          {/* Ratings */}
          <div className="d-flex gap-2 mb-3 placeholder-glow">
            <span className="placeholder col-2"></span>
            <span className="placeholder col-2"></span>
          </div>

          {/* Genres */}
          <div className="mb-3 d-flex gap-2 placeholder-glow">
            <span className="placeholder col-2"></span>
            <span className="placeholder col-2"></span>
            <span className="placeholder col-2"></span>
          </div>

          {/* Plot */}
          <p className="placeholder-glow">
            <span className="placeholder col-12"></span>
            <span className="placeholder col-10"></span>
            <span className="placeholder col-8"></span>
          </p>
        </div>
      </div>

      <hr className="my-5" />

      {/* Full Plot */}
      <div className="placeholder-glow mb-4">
        <span className="placeholder col-3 mb-2 d-block"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-11"></span>
        <span className="placeholder col-10"></span>
      </div>

      {/* Cast & Crew */}
      <div className="row g-4">
        {[1, 2, 3].map((_, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <span className="placeholder col-5 mb-2 d-block"></span>
            <span className="placeholder col-8 d-block mb-1"></span>
            <span className="placeholder col-7 d-block mb-1"></span>
            <span className="placeholder col-6 d-block"></span>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      {/* Extra Info */}
      <div className="row placeholder-glow">
        {[1, 2, 3, 4].map((_, idx) => (
          <div className="col-6 col-md-3 mb-2" key={idx}>
            <span className="placeholder col-10"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieLoader;
