import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../Icon'
import { ProductPayload } from '@/types/product'

const Modifier = ({
    modifier,
    onPressEdit,
    onPressRemove,
}: ModifierProps) => {
    return (
        <View
            className='flex-row justify-between mt-1  border-gray-400 border-l-2 h-[35]'
        >
            <TouchableOpacity
                activeOpacity={0.7}
                className='flex-1 px-3 bg-gray-50'
                onPress={onPressEdit}
            >
                <Text className='text-gray-500 my-auto'>{modifier.categoryName}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                className='w-[35] bg-red-100'
                onPress={onPressRemove}
            >
                <Icon name='close' size={20} className='text-red-500 m-auto' />
            </TouchableOpacity>
        </View>
    )
}

export default Modifier

interface ModifierProps {
    modifier: ProductPayload['availableModifiers'][number];
    onPressEdit: () => void;
    onPressRemove: () => void;
}