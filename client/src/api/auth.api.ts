import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const signIn = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data;
}

export const signUp = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    return response.data;
}

export const resetPassword = async (email: string, password: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/reset-password`, { email, password, newPassword });
    return response.data;
}