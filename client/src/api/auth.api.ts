import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

const authAPI = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

export const signIn = async (email: string, password: string) => {
    const response = await authAPI.post(`/signin`, { email, password });
    return response.data;
}

export const signUp = async (name: string, email: string, password: string) => {
    const response = await authAPI.post(`/signup`, { name, email, password });
    return response.data;
}

export const resetPassword = async (email: string, password: string, newPassword: string) => {
    const response = await authAPI.post(`/reset-password`, { email, password, newPassword });
    return response.data;
}