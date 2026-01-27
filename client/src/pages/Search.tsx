import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Movie from "../components/Movie";
import { searchByQuery } from "../api/search.api";
import { useSearchParams } from "react-router-dom";
import type { MovieCardType } from "../types";

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

  useEffect(() => {
    async function fetchData() {
      setMovieSelectedId(null);

      const queryString = `q=${encodeURIComponent(q)}&path=${path}&limit=${PAGINATION_LIMIT}&skip=${(parseInt(page) - 1) * PAGINATION_LIMIT}`;

      const response = await searchByQuery(queryString);

      setMovies(response.data as MovieCardType[]);
      setTotalResults(response.totalMovies[0].count || 0);
      setLoading(false);
    }

    fetchData();
  }, [q, path, page]);

  return (
    <>
      <div className="sticky-top bg-white shadow-sm z-1">
        <SearchBar setMovieSelectedId={setMovieSelectedId} />
      </div>
      {loading && <div className="container py-5">Loading...</div>}

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
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination pagination-sm">
                    {Array.from(
                      { length: Math.ceil(totalResults / PAGINATION_LIMIT) },
                      (_, idx) => idx + 1,
                    ).map((pageNum) => (
                      <li
                        key={pageNum}
                        className={`page-item ${pageNum === parseInt(page) ? "active" : ""}`}
                        onClick={() =>
                          setSearchParams({ q, path, page: pageNum.toString() })
                        }
                      >
                        <button className="page-link">{pageNum}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
