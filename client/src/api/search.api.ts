import axios from "axios";
import type { MovieFormPayload } from "../types";

const API_URL = import.meta.env.VITE_API_URL + "/search";

const axiosConfig = {
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
};

const publicSearchAPI = axios.create(axiosConfig);

export const getExploreMovies = async () => {
    const response = await publicSearchAPI.get(`/explore`);
    return response.data;
}

export const exploreMovieById = async (id: string) => {
    const response = await publicSearchAPI.get(`/explore/${id}`);
    return response.data;
}

const searchAPI = axios.create(axiosConfig);
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
    return response.data;
}

export const searchMovieById = async (id: string) => {
    const response = await searchAPI.get(`/movies/${id}`);
    return response.data;
}

export const getMovieComments = async (movieId: string, queryString: string) => {
    const response = await searchAPI.get(`/comments/${movieId}?${queryString}`);
    return response.data;
}

export const addMovie = async (payload: MovieFormPayload) => {
    const response = await searchAPI.post('/movies', payload);
    return response.data;
}

export const updateMovie = async (movieId: string, payload: MovieFormPayload) => {
    const response = await searchAPI.put(`/movies/${movieId}`, payload);
    return response.data;
}

export const deleteMovie = async (movieId: string) => {
    const response = await searchAPI.delete(`/movies/${movieId}`);
    return response.data;
}

export const getUserMovies = async (queryString: string) => {
    const response = await searchAPI.get(`/users/movies?${queryString}`);
    return response.data;
}

export const addComment = async (movieId: string, payload: { text: string; name?: string; email?: string }) => {
    const response = await searchAPI.post(`/comments/${movieId}`, payload);
    return response.data;
}

export const updateComment = async (commentId: string, payload: { text: string }) => {
    const response = await searchAPI.put(`/comments/${commentId}`, payload);
    return response.data;
}

export const deleteComment = async (commentId: string) => {
    const response = await searchAPI.delete(`/comments/${commentId}`);
    return response.data;
}