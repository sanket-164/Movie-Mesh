import React from "react";

type SearchLoaderProps = {
  count?: number;
};

const SearchLoader: React.FC<SearchLoaderProps> = ({ count = 4 }) => {
  return (
    <div className="container">
      <div className="row g-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              {/* Poster Skeleton */}
              <div
                className="bg-light placeholder-glow"
                style={{
                  height: "320px",
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                }}
              />

              <div className="card-body">
                <h6 className="placeholder-glow">
                  <span className="placeholder col-8"></span>
                </h6>

                <p className="placeholder-glow mb-2">
                  <span className="placeholder col-4"></span>
                </p>

                <p className="placeholder-glow">
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-10"></span>
                </p>

                <div className="d-flex gap-2 mt-3">
                  <span className="placeholder col-3"></span>
                  <span className="placeholder col-3"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchLoader;
