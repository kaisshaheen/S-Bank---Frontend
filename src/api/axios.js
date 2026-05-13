import axios from "axios";

const api = axios.create({
    withCredentials: true,
    baseURL: "https://s-bank-backend-production.up.railway.app",
    withXSRFToken: true
})

export default api