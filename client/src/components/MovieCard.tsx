type MovieCardProps = {
  movie: {
    _id: string;
    title: string;
    year: number;
    poster: string;
    plot: string;
    genres: string[];
    imdb?: {
      rating: number;
    };
  };
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const { title, year, poster, plot, genres, imdb } = movie;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={poster}
        alt={title}
        className="card-img-top"
        style={{
          height: "408px",
          width: "300px",
          objectFit: "cover",
          aspectRatio: "auto 300 / 408",
        }}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="fw-semibold mb-1">{title}</h6>

        <div className="text-muted small mb-2">
          {year} • ⭐ {imdb?.rating ?? "N/A"}
        </div>

        <p className="small text-muted flex-grow-1">
          {plot?.length > 90 ? plot.slice(0, 90) + "..." : plot}
        </p>

        <div className="mt-2">
          {genres?.slice(0, 3).map((genre, idx) => (
            <span
              key={idx}
              className="badge bg-light text-dark border me-1"
              style={{ fontWeight: 500 }}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
