import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";

const Search = () => {
  const movies = [
    {
      _id: "573a1397f29313caabce64e1",
      plot: "The funny misadventures of a dating duo of film stunt professionals in France.",
      genres: ["Action", "Comedy", "Romance"],
      poster:
        "https://m.media-amazon.com/images/M/MV5BYTU4NTRkZGMtZTgzOC00NmVjLThiZWQtNWY2NGY3NjcwYWQwXkEyXkFqcGdeQXVyMjQwOTcxMzg@._V1_SY1000_SX677_AL_.jpg",
      title: "Animal",
      year: 1977,
      imdb: {
        rating: 6.7,
        votes: 1475,
        id: 75683,
      },
      paginationToken: "CJhZFSiLfUAiDloMVzoTl/KTE8qrzmTh",
      score: 3.961618423461914,
    },
    {
      _id: "573a1396f29313caabce35ac",
      imdb: {
        rating: 7.5,
        votes: 12074,
        id: 62994,
      },
      year: 1968,
      plot: "Plain faced Fanny Brice rises to stardom on the New York Vaudeville Stage and maintains a turbulent marriage with suave gambler Nick Arnstein.",
      genres: ["Biography", "Comedy", "Drama"],
      title: "Funny Girl",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNTAxZTA2OTAtYzY1OC00NGZlLWJlZDItOWZhMjU4YTc3YWRmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SY1000_SX677_AL_.jpg",
      paginationToken: "CIkEFX69eUAiDloMVzoTlvKTE8qrzjWs",
      score: 3.902190685272217,
    },
  ];

  const handleSearch = ({
    query,
    fields,
  }: {
    query: string;
    fields: string[];
  }) => {
    console.log("Search params:", { query, fields });
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
