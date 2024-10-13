import { Redirect, Stack } from 'expo-router'

import { useSession } from '@/contexts/SessionContext'
import { useTheme } from '@/contexts/ThemeProvider'

import LoadingPage from '@/components/LoadingPage'
import VerifyEmail from '@/components/VerifyEmail'

function AuthLayout() {

    const { session, user, sessionLoading, userLoading } = useSession()
    const { colorScheme } = useTheme()

    if (sessionLoading || userLoading) {
        return <LoadingPage colorScheme={colorScheme} />
    }

    if (!session) {
        return <Redirect href='/welcome' />
    }

    if (!user?.emailVerifiedAt) {
        return <VerifyEmail />
    }

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default AuthLayout