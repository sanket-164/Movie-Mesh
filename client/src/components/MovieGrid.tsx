import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

type MovieGridProps = {
  movies: {
    _id: string;
    title: string;
    year: number;
    poster: string;
    plot: string;
    genres: string[];
    imdb?: {
      rating: number;
    };
  }[];
};

const MovieGrid = ({ movies }: MovieGridProps) => {
  const navigate = useNavigate();

  if (!movies?.length) {
    return <div className="text-center text-muted py-5">No movies found</div>;
  }

  return (
    <div className="container">
      <div className="row g-4">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            onClick={() => navigate(`/movie/${movie._id}`)}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
