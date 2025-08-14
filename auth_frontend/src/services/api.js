import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})