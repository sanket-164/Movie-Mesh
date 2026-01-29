import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchById } from "../api/search.api";
import type { MovieType } from "../types";
import MovieLoader from "../components/MovieLoader";
import fallbackImage from "../assets/Movie-Mesh.png";
import MovieComments from "../components/MovieComment";

const Movie = () => {
  const [showComments, setShowComments] = useState(false);
  const { movieId } = useParams<{ movieId: string }>();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieType | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;

      const response = await searchById(movieId);
      setMovie(response as MovieType);
      setLoading(false);
    };

    fetchMovie();
  }, [movieId]);

  return (
    <div className="container pt-5 pb-4">
      {loading && <MovieLoader />}
      {!loading && movie && (
        <>
          <div className="row g-4">
            {/* Poster */}
            <div className="col-12 col-md-4 col-lg-3">
              <img
                src={movie.poster || fallbackImage}
                alt={movie.title}
                className="img-fluid rounded shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            {/* Main Info */}
            <div className="col-12 col-md-8 col-lg-9">
              <h2 className="fw-semibold mb-1">{movie.title}</h2>

              <div className="text-muted mb-2">
                {movie.year} • {movie.runtime} min • {movie.rated || "N/A"}
              </div>

              {/* Ratings */}
              <div className="d-flex flex-wrap gap-3 mb-3">
                <span className="badge bg-dark">
                  IMDb ⭐ {movie.imdb?.rating ?? "N/A"}
                </span>

                {movie.tomatoes?.viewer && (
                  <span className="badge bg-secondary">
                    Tomatoes 🍅 {movie.tomatoes.viewer.meter}%
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="mb-3">
                {movie.genres?.map((genre, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-dark border me-2"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Short Plot */}
              <p className="text-muted">{movie.plot || "N/A"}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-5" />

          {/* Full Plot */}
          <div className="row mb-4">
            <div className="col">
              <h5 className="fw-semibold mb-2">Story</h5>
              <p className="text-muted">{movie.fullplot || "N/A"}</p>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Cast</h6>
              <ul className="list-unstyled text-muted small">
                {movie.cast?.map((actor, idx) => (
                  <li key={idx}>{actor}</li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Director</h6>
              <ul className="list-unstyled text-muted small">
                {movie.directors?.map((dir, idx) => (
                  <li key={idx}>{dir}</li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Writers</h6>
              <ul className="list-unstyled text-muted small">
                {movie.writers?.map((writer, idx) => (
                  <li key={idx}>{writer}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extra Info */}
          <hr className="my-4" />

          <div className="row text-muted small">
            <div className="col-6 col-md-3">
              <strong>Language:</strong> {movie.languages?.join(", ") || "N/A"}
            </div>
            <div className="col-6 col-md-3">
              <strong>Country:</strong> {movie.countries?.join(", ") || "N/A"}
            </div>
            <div className="col-6 col-md-3">
              <strong>Awards:</strong> {movie.awards?.text || "N/A"}
            </div>
            <div className="col-6 col-md-3">
              <strong>Released:</strong>{" "}
              {new Date(movie.released).toDateString()}
            </div>
          </div>
        </>
      )}

      <hr className="my-4" />

      <div className="text-center">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowComments((p) => !p)}
        >
          {showComments ? "Hide Comments" : "View Comments"}
        </button>
      </div>

      {showComments && movieId && <MovieComments movieId={movieId} />}
    </div>
  );
};

export default Movie;
