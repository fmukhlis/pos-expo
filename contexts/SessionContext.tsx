import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Alert } from "react-native";

import { useCustomFetch } from "@/utils/fetch"
import useStorageState from "@/hooks/useStorageState"
import { AuthError } from "@/errors/AuthError"
import { SessionContextProps, UserModel } from "@/types/auth"
import useSignInHelper from "@/utils/useSignInHelper";
import useSignUpHelper from "@/utils/useSignUpHelper";
import useSyncUserHelper from "@/utils/useSyncUserHelper";
import useSignOutHelper from "@/utils/useSignOutHelper";
import useEmailVerificationHelper from "@/utils/useEmailVerificationHelper";
import usePasswordResetHelper from "@/utils/usePasswordResetHelper";

const AuthContext = createContext<SessionContextProps>({
    resetPassword: async () => false,
    resetPasswordLoading: false,

    sendResetPassword: async () => false,
    sendResetPasswordLoading: false,

    sendVerificationEmail: async () => false,
    sendVerificationEmailLoading: false,

    session: null,

    signIn: async () => false,
    signInLoading: false,

    signOut: async () => false,
    signOutLoading: false,

    signUp: async () => false,
    signUpLoading: false,

    syncUserLoading: true,

    user: null,

    verifyEmail: async () => false,
    verifyEmailLoading: false,
})

export const useSession = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('The useAuth() hook must be wrapped within a <SessionProvider />')
    }
    return context
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [[sessionLoading, session], setSession] = useStorageState('session')
    const [user, setUser] = useState<UserModel | null>(null)

    const [syncUserLoading, setSyncUserLoading] = useState(true)
    const [signInLoading, setSignInLoading] = useState(false)
    const [signUpLoading, setSignUpLoading] = useState(false)
    const [signOutLoading, setSignOutLoading] = useState(false)
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)
    const [sendVerificationEmailLoading, setSendVerificationEmailLoading] = useState(false)
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
    const [sendResetPasswordLoading, setSendResetPasswordLoading] = useState(false)

    const syncUser = useSyncUserHelper({
        onError: (message) => {
            setUser(null)
            setSession([false, null])
            Alert.alert("Can't Sync User Data", message, [{ text: 'OK' }])
        },
        onFinish: () => { setSyncUserLoading(false) },
        onStart: () => {
            setSyncUserLoading(true)
        },
        onSuccess: async (user) => {
            setUser(user)
        },
    })

    const signUp = useSignUpHelper({
        onError: (message, errors) => { Alert.alert("Can't Register", message, [{ text: 'OK' }]) },
        onFinish: () => { setSignUpLoading(false) },
        onStart: () => { setSignUpLoading(true) },
        onSuccess: async (token) => {
            setSession([false, token])
            await syncUser(token)
        },
    })

    const signIn = useSignInHelper({
        onError: (message, errors) => { Alert.alert("Can't Log In", message, [{ text: 'OK' }]) },
        onFinish: () => { setSignInLoading(false) },
        onStart: () => { setSignInLoading(true) },
        onSuccess: async (token) => {
            setSession([false, token])
            await syncUser(token)
        },
    })

    const signOut = useSignOutHelper({
        onError: (message, errors) => { Alert.alert("Can't Log Out", message, [{ text: 'OK' }]) },
        onFinish: () => { setSignOutLoading(false) },
        onStart: () => { setSignOutLoading(true) },
        onSuccess: async () => {
            setSession([false, null])
        },
    })

    const { verifyEmail, sendVerificationEmail } = useEmailVerificationHelper({
        verifyEmailOption: {
            onError: (message, errors) => { Alert.alert("Can't Verify Your Email", message, [{ text: 'OK' }]) },
            onFinish: () => { setVerifyEmailLoading(false) },
            onStart: () => { setVerifyEmailLoading(true) },
            onSuccess: async (_, token) => {
                await syncUser(token)
            },
        },
        sendVerificationEmailOption: {
            onError: (message, errors) => { Alert.alert("Email Not Sent", message, [{ text: 'OK' }]) },
            onFinish: () => { setSendVerificationEmailLoading(false) },
            onStart: () => { setSendVerificationEmailLoading(true) },
            onSuccess: async (message) => {
                Alert.alert("Email Sent", message, [{ text: 'OK' }])
            },
        }
    })

    const { resetPassword, sendResetPassword } = usePasswordResetHelper({
        resetPasswordOption: {
            onError: (message, errors) => { Alert.alert("Can't Reset Password", message, [{ text: 'OK' }]) },
            onFinish: () => { setResetPasswordLoading(false) },
            onStart: () => { setResetPasswordLoading(true) },
            onSuccess: async (message) => {
                Alert.alert("Password Updated", message, [{ text: 'OK' }])
            },
        },
        sendResetPasswordOption: {
            onError: (message, errors) => { Alert.alert("Email Not Sent", message, [{ text: 'OK' }]) },
            onFinish: () => { setSendResetPasswordLoading(false) },
            onStart: () => { setSendResetPasswordLoading(true) },
            onSuccess: async (message) => {
                Alert.alert("Email Sent", message, [{ text: 'OK' }])
            },
        }
    })

    useEffect(() => {
        if (!sessionLoading) {
            if (session) {
                syncUser(session)
            } else {
                setUser(null)
                setSyncUserLoading(false)
            }
        }
    }, [sessionLoading])

    return (
        <AuthContext.Provider
            value={{
                resetPassword,
                resetPasswordLoading,

                sendResetPassword,
                sendResetPasswordLoading,

                sendVerificationEmail,
                sendVerificationEmailLoading,

                session,

                signIn,
                signInLoading,

                signOut,
                signOutLoading,

                signUp,
                signUpLoading,

                syncUserLoading,

                user,

                verifyEmail,
                verifyEmailLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}