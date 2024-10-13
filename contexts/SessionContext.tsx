import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Alert } from "react-native";
import * as Device from "expo-device";

import { useCustomFetch } from "@/utils/fetch"
import useStorageState from "@/hooks/useStorageState"
import { AuthError } from "@/errors/AuthError"
import { UserModel } from "@/types/auth"

const AuthContext = createContext<{
    /**
     * Send email verification request.
     * 
     * @returns Promise that resolve server message and time it takes to be able to resend the request
     * @throws {AuthError}
     */
    sendEmailVerification: () => Promise<{
        message: string
        retryAfter: string | null
    }>
    /**
     * Send signin request. If succeeded it will update the stored session.
     * 
     * @param requestBody A credentials that needed to authenticate the user
     * @throws {AuthError}
     */
    signIn: (requestBody: {
        email: string
        password: string
        rememberMe?: boolean | undefined
    }) => Promise<void>
    /**
     * Send signout request. If succeeded it will clear the current session.
     * 
     * @throws {AuthError}
     */
    signOut: () => Promise<void>
    /**
     * Send signup request. If succeeded it will update the stored session.
     * 
     * @param requestBody A credentials that needed to authenticate the user
     * @throws {AuthError}
     */
    signUp: (requestBody: {
        fullName: string
        email: string
        password: string
        passwordConfirmation: string
    }) => Promise<void>;
    /**
     * Send verify email request. If succeeded it will sync the user state.
     * 
     * @param verificationCode A code that sent to user's email
     * @throws {AuthError}
     */
    verifyEmail: (verificationCode: string) => Promise<void>;
    sessionLoading: boolean
    session: string | null
    userLoading: boolean
    user: UserModel | null
}>({
    sendEmailVerification: async () => ({ message: '', retryAfter: null }),
    signIn: async () => undefined,
    signOut: async () => undefined,
    signUp: async () => undefined,
    verifyEmail: async () => undefined,
    sessionLoading: false,
    session: null,
    userLoading: false,
    user: null,
})

export const useSession = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('The useAuth() hook must be wrapped within a <SessionProvider />')
    }
    return context
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const customFetch = useCustomFetch()

    const [[sessionLoading, session], setSession] = useStorageState('session')
    const [[userLoading, user], setUser] = useState<[boolean, UserModel | null]>([true, null])

    const syncUser = async (token: string) => {
        try {
            setUser(([_, prevUser]) => ([true, prevUser]))

            const response = await customFetch.get('/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const responseData: { data: UserModel } = await response.json()
                setUser([false, responseData.data])
            } else {
                const responseData: { message: string } = await response.json()
                setUser(([_, prevUser]) => ([false, prevUser]))
                setSession([false, null])
                throw new AuthError(responseData.message)
            }
        } catch (error: any) {
            Alert.alert("Can't Sync User Data", error.message ?? error, [{ text: "Ok" }]);
        }
    }

    const signUp = async (requestBody: {
        fullName: string
        email: string
        password: string
        passwordConfirmation: string
    }) => {
        setSession([true, session])
        const response = await customFetch.post('/register', {
            body: JSON.stringify({
                ...requestBody,
                deviceName: Device.deviceName,
            })
        })
        if (response.ok) {
            const responseData: { token: string } = await response.json()
            setSession([false, responseData.token])
        } else {
            const responseData: {
                message: string
                errors?: Record<string, string[]>
            } = await response.json()
            setSession([false, session])
            throw new AuthError(responseData.message, responseData.errors)
        }
    }

    const signIn = async (requestBody: {
        email: string
        password: string
    }) => {
        setSession([true, session])

        const response = await customFetch.post('/login', {
            body: JSON.stringify({
                ...requestBody,
                deviceName: Device.deviceName,
            })
        })

        if (response.ok) {
            const responseData: { token: string } = await response.json()
            setSession([false, responseData.token])
        } else {
            const responseData: {
                message: string
                errors: Record<string, string[]>
            } = await response.json()
            setSession([false, session])
            throw new AuthError(responseData.message, responseData.errors)
        }
    }

    const signOut = async () => {
        setSession([true, session])

        const response = await customFetch.post('/logout', {
            headers: {
                'Authorization': `Bearer ${session}`
            }
        })

        if (response.ok) {
            setSession([false, null])
        } else {
            const responseData: {
                message: string
                errors: Record<string, string[]>
            } = await response.json()
            setSession([false, session])
            throw new AuthError(responseData.message, responseData.errors)
        }
    }

    const verifyEmail = async (verificationCode: string) => {
        const response = await customFetch.post('/verify-email', {
            headers: {
                'Authorization': `Bearer ${session}`
            },
            body: JSON.stringify({ verificationCode })
        })

        if (response.ok) {
            await syncUser(session ?? '')
        } else {
            const responseData: {
                message: string
                errors: Record<string, string[]>
            } = await response.json()
            throw new AuthError(responseData.message, responseData.errors)
        }
    }

    const sendEmailVerification = async () => {
        const response = await customFetch.post('/email/verification-notification', {
            headers: {
                'Authorization': `Bearer ${session}`
            }
        })

        const retryAfter = response.headers.get('retry-after')

        if (response.status === 429) {
            throw new AuthError('Too many attempts, please retry in: ' + retryAfter + ' sec.')
        }

        const responseData: {
            message: string
        } = await response.json()

        if (response.status === 422) {
            throw new AuthError(responseData.message)
        }

        return { ...responseData, retryAfter }
    }

    useEffect(() => {
        if (!sessionLoading) {
            if (session) {
                syncUser(session)
            } else {
                setUser([false, null])
            }
        }
    }, [sessionLoading])

    return (
        <AuthContext.Provider value={{ sessionLoading, userLoading, sendEmailVerification, session, signIn, signOut, signUp, user, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    )
}