import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})

let accessToken = null

export const setAccessToken = (token) =>{
    accessToken = token
}

api.interceptors.request.use((config)=>{
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (error) =>{
        const originalRequest = error.config

        if(
            error.response?.status == 401 &&
            !originalRequest._retry
        ){
            originalRequest._retry = true

            const res= await api.post("/auth/refresh")
            setAccessToken(res.data.accessToken)

            originalRequest.headers.Authorization = `Bearer ${res.data.Authorization}`

            return api(originalRequest)
        }
        return Promise.reject(error)
    }
)

export default api