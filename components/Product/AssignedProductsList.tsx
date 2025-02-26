import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { router } from 'expo-router'
import { Icon } from '../Icon'

const AssignedProductsList = ({ products, onProductTouched }: {
    onProductTouched: () => void
    products: { id: number; name: string; }[]
}) => {
    return (
        products.length
            ? <View className='flex-row flex-wrap gap-1 justify-center'>
                {products.map((product) => {
                    return (
                        <TouchableOpacity
                            key={product.id}
                            className='pl-3 pr-2 py-1 rounded bg-sky-200 border border-sky-400 flex-row items-center'
                            onPress={() => {
                                onProductTouched()
                                router.navigate({
                                    pathname: '/(app)/(tabs)/account/store-management/product/[id]',
                                    params: { id: product.id }
                                })
                            }}
                        >
                            <Text className='text-blue-500 font-medium'>{product.name}</Text>
                            <Icon name='arrow-forward-outline' size={15} className='text-blue-500 ml-2' />
                        </TouchableOpacity>
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