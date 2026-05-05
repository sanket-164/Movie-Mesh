export type Suggestion = {
    _id: string;
    title: string;
    poster: string;
    year: number;
};

export type MovieCardType = {
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

export type MovieType = {
    _id: string;
    title: string;
    year: number;
    poster: string;
    plot: string;
    fullplot: string;
    genres: string[];
    runtime: number;
    rated: string;
    released: string;
    languages: string[];
    countries: string[];
    cast: string[];
    directors: string[];
    writers: string[];
    imdb?: {
        rating: number;
    };
    tomatoes?: {
        viewer: {
            meter: number;
        };
    };
    awards?: {
        text: string;
    };
};

export type MovieFormPayload = {
    title: string;
    plot?: string;
    fullplot?: string;
    poster?: string;
    year?: number;
    runtime?: number;
    rated?: string;
    genres?: string[];
    languages?: string[];
    countries?: string[];
    cast?: string[];
    directors?: string[];
    writers?: string[];
};

export type UserMovie = MovieType & {
    createdAt?: string;
    updatedAt?: string;
    user_id?: number;
};

export type UserMovieResponse = {
    movies: UserMovie[];
    totalMovies: number;
};

export type MovieCommentType = {
    _id: string;
    name?: string;
    email?: string;
    text: string;
    date: string;
    user_id?: number;
};