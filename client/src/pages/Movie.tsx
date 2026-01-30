import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchMovieById, exploreMovieById } from "../api/search.api";
import type { MovieType } from "../types";
import MovieLoader from "../components/MovieLoader";
import fallbackImage from "../assets/Movie-Mesh.png";
import MovieComments from "../components/MovieComment";

// Helper to safely format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const Movie = () => {
  const [showComments, setShowComments] = useState(false);
  const { movieId } = useParams<{ movieId: string }>();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieType | null>(null);
  const isLoggedIn = !!(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  // Share handler with modern feedback
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: movie?.title || "Movie-Mesh",
      text: `Check out "${movie?.title}" on Movie-Mesh`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // Show subtle toast feedback instead of alert
        const toast = document.createElement("div");
        toast.innerHTML = `<div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body fw-medium">Link copied to clipboard!</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;

      try {
        const response = isLoggedIn
          ? await searchMovieById(movieId)
          : await exploreMovieById(movieId);
        setMovie(response as MovieType);
      } catch (error) {
        console.error("Failed to load movie:", error);
        // Consider adding error state handling here
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, isLoggedIn]);

  if (loading) return <MovieLoader />;

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <div className="text-muted">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row g-4 g-lg-5 mb-5">
        {/* Poster */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="position-relative">
            <img
              src={movie.poster || fallbackImage}
              alt={`${movie.title} poster`}
              className="img-fluid rounded-4 shadow"
              style={{
                width: "100%",
                aspectRatio: "2/3",
                objectFit: "cover",
                border: "1px solid var(--bs-border-color)",
              }}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
                e.currentTarget.style.borderColor = "var(--bs-border-color)";
              }}
            />
            {/* Subtle rating badge overlay */}
            {movie.imdb?.rating && (
              <div className="position-absolute bottom-0 start-0 m-3 bg-dark text-white px-2 py-1 rounded fw-medium fs-6">
                ⭐ {movie.imdb.rating}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-md-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold mb-2 lh-1">{movie.title}</h1>
              <div className="text-muted fs-5">
                {movie.year} • {movie.runtime} min • {movie.rated || "N/A"}
              </div>
            </div>

            <button
              className="btn d-flex align-items-center gap-2 px-3 py-2 justify-content-center"
              onClick={handleShare}
              aria-label="Share this movie"
              style={{
                backgroundColor: "#2563EB", // Tailwind blue-600
                color: "#ffffff",
                border: "none",
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2">
                <svg
                  className="mt-1"
                  fill="#ffffff"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24.00 24.00"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.928 9.24a4.02 4.02 0 0 1-.026 1.644l5.04 2.537a4 4 0 1 1-.867 1.803l-5.09-2.562a4 4 0 1 1 .083-5.228l5.036-2.522a4 4 0 1 1 .929 1.772L7.928 9.24zM4 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                  </g>
                </svg>
                <span>Share</span>
              </div>
            </button>
          </div>

          {/* Ratings & Genres */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            {movie.imdb?.rating && (
              <span className="badge bg-dark fs-6 py-2 px-3">
                IMDb {movie.imdb.rating}
              </span>
            )}
            {movie.tomatoes?.viewer?.meter && (
              <span className="badge bg-danger fs-6 py-2 px-3">
                Rotten {movie.tomatoes.viewer.meter}%
              </span>
            )}
            {movie.genres?.map((genre, idx) => (
              <span
                key={idx}
                className="badge bg-light text-dark border fs-6 py-2 px-3"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Plot */}
          <p className="fs-5 text-muted lh-base mb-0">
            {movie.plot || "No synopsis available"}
          </p>
        </div>
      </div>

      {/* Full Story Section */}
      <section className="mb-5 pb-4 border-bottom">
        <h2 className="fw-bold mb-3">Story</h2>
        <p className="fs-5 text-muted lh-lg mb-0">
          {movie.fullplot || movie.plot || "No detailed synopsis available"}
        </p>
      </section>

      {/* Cast & Crew Section */}
      <section className="mb-5 pb-4 border-bottom">
        <div className="row g-4">
          {movie.cast?.length && (
            <div className="col-12 col-md-4">
              <h3 className="fw-semibold fs-5 mb-3">Cast</h3>
              <div className="d-flex flex-wrap gap-2">
                {movie.cast.slice(0, 8).map((actor, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-dark border py-2 px-3 fs-6"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.directors?.length && (
            <div className="col-12 col-md-4">
              <h3 className="fw-semibold fs-5 mb-3">
                Director{movie.directors.length > 1 ? "s" : ""}
              </h3>
              <div className="d-flex flex-wrap gap-2">
                {movie.directors.map((dir, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-dark border py-2 px-3 fs-6"
                  >
                    {dir}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.writers?.length && (
            <div className="col-12 col-md-4">
              <h3 className="fw-semibold fs-5 mb-3">
                Writer{movie.writers.length > 1 ? "s" : ""}
              </h3>
              <div className="d-flex flex-wrap gap-2">
                {movie.writers.map((writer, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-dark border py-2 px-3 fs-6"
                  >
                    {writer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Details Grid */}
      <section className="text-muted">
        <div className="row g-3 fs-6">
          <div className="col-6 col-md-3">
            <div className="fw-medium mb-1">Language</div>
            <div>{movie.languages?.join(", ") || "N/A"}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="fw-medium mb-1">Country</div>
            <div>{movie.countries?.join(", ") || "N/A"}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="fw-medium mb-1">Awards</div>
            <div>{movie.awards?.text || "N/A"}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="fw-medium mb-1">Released</div>
            <div>{formatDate(movie.released)}</div>
          </div>
        </div>
      </section>

      {/* Comments Section - Only for logged-in users */}
      {isLoggedIn && (
        <>
          <hr className="my-5 opacity-25" />

          <div className="text-center">
            <button
              className="btn btn-outline-dark px-4 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 mx-auto"
              onClick={() => setShowComments((p) => !p)}
              aria-expanded={showComments}
              aria-controls="movie-comments-section"
            >
              {showComments ? "Hide Reviews" : "View Reviews"}
            </button>
          </div>

          {showComments && movieId && (
            <div id="movie-comments-section">
              <MovieComments movieId={movieId} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movie;
