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