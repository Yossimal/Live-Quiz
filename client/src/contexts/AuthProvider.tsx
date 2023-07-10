import { createContext, useState } from 'react'
import { CurrentUser, LoginMutation } from '../types'
import axios from 'axios'


export interface AuthProviderValues {
    login: (loginData: LoginMutation) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
    currentUser: CurrentUser | null
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthContext = createContext<AuthProviderValues | null>(null)

export function AuthProvider(props: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

    const authInstance = axios.create({
        baseURL: "http://localhost:3000/api/auth/",
        timeout: 3000
    })

    const login = async (loginData: LoginMutation) => {
        const user = await authInstance.post('/login', loginData)
        if (user) {
            setCurrentUser(user.data)
        }
    }

    const logout = async () => {
        await authInstance.delete(`/logout/${currentUser?.user.email}`)
        setCurrentUser(null)
    }

    const refresh = async () => {
        const postData = { email: currentUser?.user.email, token: currentUser?.refreshToken }
        console.log(postData);
        const token = await authInstance.post('/token', postData)
        console.log(token);
        if (!token?.data) return

        const { accessToken } = token.data
        if (currentUser) {
            currentUser.accessToken = accessToken
        }
    }

    return (
        <AuthContext.Provider value={{
            login: login,
            logout: logout,
            refresh: refresh,
            currentUser: currentUser
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

