import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/search";

const searchAPI = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Dynamically inject token on EVERY request
searchAPI.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Explicitly remove header if no token exists (prevents stale headers)
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const getSearchSuggestions = async (queryString: string) => {
    const response = await searchAPI.get(`/suggestions?${queryString}`);
    return response.data;
}

export const searchByQuery = async (queryString: string) => {
    const response = await searchAPI.get(`/movies?${queryString}`);
    return response.data[0];
}

export const searchById = async (id: string) => {
    const response = await searchAPI.get(`/movies/${id}`);
    return response.data;
}

export const getMovieComments = async (movieId: string, queryString: string) => {
    const response = await searchAPI.get(`/comments/${movieId}?${queryString}`);
    return response.data;
}