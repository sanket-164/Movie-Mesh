import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Movie from "../components/Movie";
import { searchByQuery } from "../api/search.api";
import { useSearchParams } from "react-router-dom";
import type { MovieCardType } from "../types";
import Pagination from "../components/Pagination";
import SearchLoader from "../components/SearchLoader";

const PAGINATION_LIMIT = 8;

const Search = () => {
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [movieSelectedId, setMovieSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const path = searchParams.get("path") || "title";
  const page = searchParams.get("page") || "1";

  const changeSearchParams = ({
    newQ,
    newPath,
    newPage,
  }: {
    newQ: string;
    newPath: string;
    newPage: string;
  }) => {
    setMovieSelectedId(null);
    setSearchParams({
      q: newQ,
      path: newPath,
      page: newPage,
    });
  };

  useEffect(() => {
    async function fetchData() {
      setMovieSelectedId(null);

      const queryString = `q=${encodeURIComponent(q)}&path=${path}&limit=${PAGINATION_LIMIT}&skip=${(parseInt(page) - 1) * PAGINATION_LIMIT}`;

      const response = await searchByQuery(queryString);

      setMovies(response.data as MovieCardType[]);
      setTotalResults(response.totalMovies[0]?.count || 0);
      setLoading(false);
    }

    fetchData();
  }, [q, path, page]);

  return (
    <>
      <div className="sticky-top bg-white shadow-sm z-1">
        <SearchBar
          changeSearchParams={changeSearchParams}
          isLoading={loading}
        />
      </div>

      {loading && (
        <div className="container py-5">
          <SearchLoader />
        </div>
      )}

      {!loading && (
        <div className="my-4">
          <div className="container">
            {!movieSelectedId && (
              <div className="row g-4">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    onClick={() => setMovieSelectedId(movie._id)}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}

            {movieSelectedId && <Movie movieId={movieSelectedId} />}

            {/* Pagination */}
            {!movieSelectedId && totalResults > PAGINATION_LIMIT && (
              <Pagination
                totalPages={Math.ceil(totalResults / PAGINATION_LIMIT)}
                changeSearchParams={changeSearchParams}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
