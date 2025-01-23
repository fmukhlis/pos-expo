import React, { ComponentPropsWithoutRef } from 'react'
import { View, Image, ActivityIndicator } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useTheme } from '@/contexts/ThemeProvider'

const LoadingComponent = (props: React.ComponentPropsWithoutRef<typeof View>) => {
    const { colorScheme } = useTheme()

    return (
        <View {...props} className='flex-1 justify-center items-center bg-white'>
            <ActivityIndicator
                size={'large'}
                color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
            />
        </View>
    )
}

export default LoadingComponent