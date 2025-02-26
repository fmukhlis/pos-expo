import { Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../Icon'
import { ProductPayload } from '@/types/product'

const Variant = ({
    variant,
    ...props
}: VariantProps) => {
    const isValid = variant.price.length && variant.stock.length

    return (
        <TouchableOpacity
            {...props}
            activeOpacity={0.5}
            className='px-4 rounded bg-gray-50 flex-row items-center justify-between mt-1.5 border-gray-300 border h-[45]'
        >
            <Text className='text-gray-500 font-medium'>
                {variant.options?.join(', ')}
            </Text>
            <Icon name='checkmark-done' className={`${isValid ? 'text-emerald-500' : 'text-gray-400'}`} size={20} />
        </TouchableOpacity>
    )
}

export default Variant

interface VariantProps extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
    variant: ProductPayload['availableVariants'][number];
}