import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '@/contexts/SessionContext'
import { useTheme } from '@/contexts/ThemeProvider'
import LoadingPage from '@/components/LoadingPage'
import { Redirect } from 'expo-router'

const LoadingState = () => {

    const [isLoading, setIsLoading] = React.useState(true)

    const { syncUserLoading } = useSession()
    const { colorScheme } = useTheme()

    React.useEffect(() => {
        if (!syncUserLoading) {
            setIsLoading(false)
        }
    }, [syncUserLoading])

    if (isLoading) {
        return <LoadingPage colorScheme={colorScheme} />
    }

    return (<Redirect href={'/(checkout)'} />)
}

export default LoadingState