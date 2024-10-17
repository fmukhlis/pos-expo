import React, { ComponentPropsWithoutRef } from 'react'
import { ActivityIndicator } from 'react-native'
import { View } from 'react-native'

import { Colors } from '@/constants/Colors'

interface OverlapLoadingProps extends ComponentPropsWithoutRef<typeof View> {
    colorScheme: 'dark' | 'light'
}

const OverlapLoading = ({ colorScheme, ...props }: OverlapLoadingProps) => {
    return (
        <View {...props} className='h-full w-full justify-center items-center absolute bg-light-tertiaryBackground/60 dark:bg-dark-tertiaryBackground/60'>
            <ActivityIndicator size={50} color={colorScheme === 'dark' ? Colors.dark.secondaryText : Colors.light.secondaryText} />
        </View>
    )
}

export default OverlapLoading