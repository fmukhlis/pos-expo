import { ComponentPropsWithoutRef } from 'react'
import { View, Image, ActivityIndicator } from 'react-native'

import { Colors } from '@/constants/Colors'

interface LoadingPageProps extends ComponentPropsWithoutRef<typeof View> {
    colorScheme: 'dark' | 'light'
}

const LoadingPage = ({ colorScheme, ...props }: LoadingPageProps) => {
    return (
        <View {...props} className='flex-1 justify-center items-center'>
            <Image
                tintColor={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
                source={require('@/assets/images/logo.png')}
                className='w-[200px] h-[60px] mb-5'
                resizeMode='contain'
            />
            <ActivityIndicator
                size={'large'}
                color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
            />
        </View>
    )
}

export default LoadingPage