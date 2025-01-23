import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/constants/Colors'
import { useTheme } from '@/contexts/ThemeProvider'

const NotificationLayout = () => {

    const { colorScheme } = useTheme()

    return (
        <>
            <Stack screenOptions={{
                headerShown: false
            }} />
            <StatusBar
                backgroundColor={colorScheme === 'dark' ? Colors.dark.primaryBackground : Colors.light.primaryBackground}
            />
        </>
    )
}

export default NotificationLayout