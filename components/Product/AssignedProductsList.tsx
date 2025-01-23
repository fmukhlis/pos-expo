import { View, Text } from 'react-native'
import React from 'react'
import { ProductProps } from '@/types/product'

const AssignedProductsList = ({ products }: {
    products: { id: number; name: string; }[]
}) => {
    return (
        products.length
            ? <View className='flex-row flex-wrap gap-1 justify-center'>
                {products.map((product) => {
                    return (
                        <View key={product.id} className='px-3 py-1 rounded bg-gray-200 border border-gray-400'>
                            <Text>{product.name}</Text>
                        </View>
                    )
                })}
            </View>
            : <View className='p-1'>
                <Text className='text-gray-500 text-[13px] text-center'>
                    No products has been added to this category yet.
                </Text>
            </View>
    )
}

export default AssignedProductsList