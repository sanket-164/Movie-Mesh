import { useEffect, useState } from "react";
import { searchById } from "../api/search.api";

type Movie = {
  _id: string;
  title: string;
  year: number;
  poster: string;
  plot: string;
  fullplot: string;
  genres: string[];
  runtime: number;
  rated: string;
  released: string;
  languages: string[];
  countries: string[];
  cast: string[];
  directors: string[];
  writers: string[];
  imdb?: {
    rating: number;
  };
  tomatoes?: {
    viewer: {
      meter: number;
    };
  };
  awards?: {
    text: string;
  };
};

const Movie = ({ movieId }: { movieId: string }) => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;

      const response = await searchById(movieId);
      setMovie(response as Movie);
      setLoading(false);
    };

    fetchMovie();
  }, [movieId]);

  return (
    <div className="container py-5">
      {loading && <div>Loading...</div>}
      {!loading && movie && (
        <>
          <div className="row g-4">
            {/* Poster */}
            <div className="col-12 col-md-4 col-lg-3">
              <img
                src={movie.poster}
                alt={movie.title}
                className="img-fluid rounded shadow-sm"
              />
            </div>

            {/* Main Info */}
            <div className="col-12 col-md-8 col-lg-9">
              <h2 className="fw-semibold mb-1">{movie.title}</h2>

              <div className="text-muted mb-2">
                {movie.year} • {movie.runtime} min • {movie.rated}
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
                {movie.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-dark border me-2"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Short Plot */}
              <p className="text-muted">{movie.plot}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-5" />

          {/* Full Plot */}
          <div className="row mb-4">
            <div className="col">
              <h5 className="fw-semibold mb-2">Story</h5>
              <p className="text-muted">{movie.fullplot}</p>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Cast</h6>
              <ul className="list-unstyled text-muted small">
                {movie.cast.map((actor, idx) => (
                  <li key={idx}>{actor}</li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Director</h6>
              <ul className="list-unstyled text-muted small">
                {movie.directors.map((dir, idx) => (
                  <li key={idx}>{dir}</li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-semibold">Writers</h6>
              <ul className="list-unstyled text-muted small">
                {movie.writers.map((writer, idx) => (
                  <li key={idx}>{writer}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extra Info */}
          <hr className="my-4" />

          <div className="row text-muted small">
            <div className="col-6 col-md-3">
              <strong>Language:</strong> {movie.languages.join(", ")}
            </div>
            <div className="col-6 col-md-3">
              <strong>Country:</strong> {movie.countries.join(", ")}
            </div>
            <div className="col-6 col-md-3">
              <strong>Awards:</strong> {movie.awards?.text}
            </div>
            <div className="col-6 col-md-3">
              <strong>Released:</strong>{" "}
              {new Date(movie.released).toDateString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Movie;
