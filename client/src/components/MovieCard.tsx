import fallbackImage from "../assets/Movie-Mesh.png";
import type { MovieCardType } from "../types";

type MovieCardProps = {
  movie: MovieCardType;
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const { title, year, poster, plot, genres, imdb } = movie;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={poster || fallbackImage}
        alt={title}
        className="card-img-top w-100"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
        style={{
          aspectRatio: "3 / 4",
          objectFit: "cover",
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
