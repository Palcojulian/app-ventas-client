import axios from "axios";
import { getData } from "../utils/storage";

export const Api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        Authorization: `Bearer ${getData('token-user')}`
    }
})

Api.interceptors.request.use(
    (config) => {
        config.baseURL = import.meta.env.VITE_APP_API_URL;
        const token = getData('token-user');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
