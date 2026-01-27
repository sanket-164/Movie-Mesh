import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/search";

const searchAPI = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token") || ""}`,
    }
});

export const searchByQuery = async (queryString: string) => {
    const response = await searchAPI.get(`/movies?${queryString}`);
    return response.data[0];
}

export const searchById = async (id: string) => {
    const response = await searchAPI.get(`/movies/${id}`);
    return response.data;
}