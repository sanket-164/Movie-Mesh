import { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { searchByQuery } from "../api/search.api";

const PAGINATION_LIMIT = 8;

type Movie = {
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
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(PAGINATION_LIMIT);
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = async ({
    query,
    fields,
  }: {
    query: string;
    fields: string[];
  }) => {
    let queryString = `q=${encodeURIComponent(query)}`;

    queryString += `&path=${fields.join(",")}`;

    queryString += `&limit=${limit}`;

    queryString += `&skip=${skip}`;

    const response = await searchByQuery(queryString);

    setMovies(response as Movie[]);
  };

  return (
    <>
      <div className="sticky-top bg-white shadow-sm z-1">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="my-4">
        <MovieGrid movies={movies} />
      </div>
    </>
  );
};

export default Search;
