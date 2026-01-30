import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getExploreMovies } from "../api/search.api";
import { useNavigate } from "react-router-dom";
import type { MovieCardType } from "../types";
import SearchLoader from "../components/SearchLoader";
import InfiniteScroll from "react-infinite-scroll-component";

const Explore = () => {
  const navigate = useNavigate();
  const movieSet = new Set<string>();
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async () => {
    const response = await getExploreMovies();

    const newMovies = response.movies as MovieCardType[];

    setMovies((prev) => {
      const uniqueMovies = [...prev];

      newMovies.forEach((movie) => {
        if (!movieSet.has(movie._id)) {
          uniqueMovies.push(movie);
          movieSet.add(movie._id);
        }
      });

      return uniqueMovies;
    });

    if (movies.length + newMovies.length >= response.totalMovies[0]?.count) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchMovies();
      setLoading(false);
    }
    init();
  }, []);

  const fetchMoreMovies = async () => {
    await fetchMovies();
  };

  return (
    <>
      {loading && (
        <div className="container py-5">
          <SearchLoader />
        </div>
      )}

      {!loading && (
        <>
          {/* Infinite Scroll Grid */}
          <InfiniteScroll
            dataLength={movies.length}
            next={fetchMoreMovies}
            hasMore={hasMore}
            loader={
              <div className="container py-4">
                <SearchLoader />
              </div>
            }
            endMessage={
              <p className="text-center text-muted py-4">
                🎬 You’ve reached the end
              </p>
            }
          >
            <div className="container my-4">
              <div className="row g-4">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    onClick={() => navigate(`/movies/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </>
      )}
    </>
  );
};

export default Explore;
