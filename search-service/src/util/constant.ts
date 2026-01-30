const DEFAULT_MOVIE_LIMIT = 8;
const MOVIE_PROJECTED_FIELDS = { title: 1, plot: 1, poster: 1, genres: 1, year: 1, imdb: 1 };
const SEARCH_TOPIC = 'user-search';
const ALLOWED_SEARCH_PATHS = ['title', 'plot', 'genres', 'directors', 'cast', 'writers'];

export { DEFAULT_MOVIE_LIMIT, MOVIE_PROJECTED_FIELDS, SEARCH_TOPIC, ALLOWED_SEARCH_PATHS };