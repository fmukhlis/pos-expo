import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'
import Checkbox from 'expo-checkbox'
import useAssignProductsModal from './useAssignProductsModal'

const AssignableProductsList = ({ products, onItemClick = () => { } }: {
    products: ReturnType<typeof useAssignProductsModal>['assignableProducts']
    onItemClick: (itemId: number, value?: boolean) => void
}) => {
    return (
        products.length
            ?
            products.map((product) => {
                return (
                    <TouchableHighlight
                        key={product.id}
                        onPress={() => { onItemClick(product.id) }}
                        underlayColor={"#f3f4f6"}
                    >
                        <View
                            className={`h-[50] px-2 border-gray-300 justify-between items-center flex-row border-t
                            }`}
                        >
                            <Text className="font-medium text-base">{product.name}</Text>
                            <Checkbox
                                value={product.isChecked}
                                onValueChange={(value) => { onItemClick(product.id, value) }}
                            />
                        </View>
                    </TouchableHighlight>
                )
            })
            :
            <View className='mt-1'>
                <Text className='text-gray-500 text-[13px] text-center'>
                    {products.length ? 'Product not found' : 'No products has been added yet'}
                </Text>
            </View>
    )
}

export default AssignableProductsList