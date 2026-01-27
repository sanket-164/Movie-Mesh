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

const Movie = () => {
  const movie = {
    awards: {
      wins: 0,
      nominations: 1,
      text: "1 nomination.",
    },
    imdb: {
      rating: 5.7,
      votes: 3119,
      id: 216584,
    },
    tomatoes: {
      viewer: {
        rating: 3,
        numReviews: 7552,
        meter: 43,
      },
      dvd: "2005-12-27T00:00:00.000Z",
      production: "First Independent Pictures",
      lastUpdated: "2015-08-08T18:15:20.000Z",
    },
    _id: "573a13a1f29313caabd07685",
    plot: "Tom Green stars as a bumbling buffoon, who lands at Butling after working his way through all other 'A' and 'B' jobs.",
    genres: ["Comedy", "Family"],
    runtime: 90,
    rated: "PG",
    cast: [
      "Tom Green",
      "Brooke Shields",
      "Genevieve Buechner",
      "Benjamin B. Smith",
    ],
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTgzOTU0MjIyNV5BMl5BanBnXkFtZTgwNDQ0NTgwMzE@._V1_SY1000_SX677_AL_.jpg",
    title: "Bob the Butler",
    fullplot:
      "Goofy Canadian screwup Bob Tree goes trough the yellow pages alphabetically to pick jobs, applies and messes them up every time. In the B's, he arrived at butler and takes a wacky crash-course with the somewhat odd Mr. Butler. Bob gets hired, but really more as babysitter cum housekeeper for Jacques, his fuzzy lover Anne Jamieson and, most of all, her spoiled-rotten kids Bates and Tess, terrible handfuls which his unorthodox methods may at least take by surprise.",
    languages: ["English"],
    released: "2012-01-14T00:00:00.000Z",
    directors: ["Gary Sinyor"],
    writers: [
      "Jane Walker Wood (story)",
      "Steven Manners (story)",
      "Jane Walker Wood (screenplay)",
      "Steven Manners (screenplay)",
      "Gary Sinyor (screenplay)",
    ],
    lastupdated: "2015-09-02 00:32:51.303000000",
    year: 2005,
    countries: ["Canada", "UK"],
    type: "movie",
    num_mflix_comments: 0,
  };

  return (
    <div className="container py-5">
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
              <span key={idx} className="badge bg-light text-dark border me-2">
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
          <strong>Released:</strong> {new Date(movie.released).toDateString()}
        </div>
      </div>
    </div>
  );
};

export default Movie;
