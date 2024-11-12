import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'localhost:8000'
    return {
        provide: {
            axios: axios
        }
    }
})