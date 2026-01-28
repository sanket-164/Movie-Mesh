import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { searchByQuery } from "../api/search.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { MovieCardType } from "../types";
import Pagination from "../components/Pagination";
import SearchLoader from "../components/SearchLoader";

const PAGINATION_LIMIT = 8;

const Search = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const path = searchParams.get("path") || "title";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    async function fetchData() {
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
      {loading && (
        <div className="container py-5">
          <SearchLoader />
        </div>
      )}

      {!loading && (
        <div className="my-4">
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

            {/* Pagination */}
            {totalResults > PAGINATION_LIMIT && (
              <Pagination
                totalPages={Math.ceil(totalResults / PAGINATION_LIMIT)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
