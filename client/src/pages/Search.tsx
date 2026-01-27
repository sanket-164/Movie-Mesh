import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Movie from "../components/Movie";
import { searchByQuery } from "../api/search.api";
import { useSearchParams } from "react-router-dom";

const PAGINATION_LIMIT = 8;

type SearchParamsType = {
  q?: string;
  path?: string;
  skip?: string;
};

type MovieCardType = {
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

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams<SearchParamsType>();
  const q = searchParams.get("q") || "";
  const path = searchParams.get("path") || "title";
  const page = searchParams.get("page") || "1";
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [movieSelectedId, setMovieSelectedId] = useState<string | null>(null);

  const handleSearch = async () => {
    setMovieSelectedId(null);

    let queryString = `q=${encodeURIComponent(q || "")}`;

    queryString += `&path=${path}`;

    queryString += `&limit=${PAGINATION_LIMIT}`;

    queryString += `&skip=${(parseInt(page) - 1) * PAGINATION_LIMIT}`;

    console.log("Final Query String:", queryString);

    const response = await searchByQuery(queryString);

    setMovies(response as MovieCardType[]);
  };

  useEffect(() => {
    async function fetchData() {
      await handleSearch();
    }

    fetchData();
  }, [q, path, page, searchParams]);

  return (
    <>
      <div className="sticky-top bg-white shadow-sm z-1">
        <SearchBar setMovieSelectedId={setMovieSelectedId} />
      </div>
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
        </div>
      </div>
    </>
  );
};

export default Search;
