import axios from "axios"
import { useAuth } from './useAuth'

export function useAxios() {
    const { currentUser, refresh } = useAuth()!
    console.log("current user", currentUser)
    const instance = axios.create({
        baseURL: "http://localhost:3000/api/",
        timeout: 3000,
        headers: {
            'Authorization': `Bearer ${currentUser?.accessToken}`
        }
    })
    instance.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            if (error.response.status === 403) {
                await refresh()
            }
        })

    return { instance }
}

