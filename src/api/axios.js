import axios from "axios";

const api = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000",
    withXSRFToken: true
})

export default api