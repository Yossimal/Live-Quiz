// import { createContext, useState } from 'react'
// import { CurrentUser, LoginMutation, SingupData } from '../types'
// import axios from 'axios'


// export interface AuthProviderValues {
//     login: (loginData: LoginMutation) => Promise<CurrentUser | null>
//     logout: () => Promise<void>
//     refresh: () => Promise<void>
//     singup: (data: SingupData) => Promise<boolean>
//     currentUser: CurrentUser | null
// }

// interface AuthProviderProps {
//     children: React.ReactNode
// }

// export const AuthContext = createContext<AuthProviderValues | null>(null)

// export function AuthProvider(props: AuthProviderProps) {
//     const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

//     const authInstance = axios.create({
//         baseURL: "http://localhost:3000/auth/",
//         timeout: 3000
//     })

//     const login = async (loginData: LoginMutation) => {
//         const res = await authInstance.post('/login', loginData)
//         const user = res.data as CurrentUser
//         if (user) {
//             setCurrentUser(user)
//             console.log('Good login', user)
//             return user
//         } else {
//             console.log('Bad login', user)
//             return null
//         }
//     }

//     const logout = async () => {
//         if(!currentUser) return;
//         await authInstance.delete(`/logout/${currentUser.user.email}`)
//         setCurrentUser(null)
//     }

//     const refresh = async () => {
//         const postData = { email: currentUser?.user.email, token: currentUser?.refreshToken }
//         console.log(postData);
//         const token = await authInstance.post('/token', postData)
//         console.log(token);
//         if (!token?.data) return

//         const { accessToken } = token.data
//         if (currentUser) {
//             currentUser.accessToken = accessToken
//         }
//     }

//     const singup = async (singupData: SingupData) => {
//         const data = await authInstance.post('/singup', singupData)
//         if (data) {
//             console.log('Good singup', data)
//             return true
//         }
//         console.log('Bad singup', data)
//         return false
//     }

//     return (
//         <AuthContext.Provider value={{
//             login: login,
//             logout: logout,
//             refresh: refresh,
//             singup: singup,
//             currentUser: currentUser
//         }}>
//             {props.children}
//         </AuthContext.Provider>
//     )
// }

