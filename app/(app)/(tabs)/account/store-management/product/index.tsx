import { View, Text, TouchableOpacity, FlatList, TouchableHighlight, RefreshControl } from 'react-native'
import React from 'react'
import { Icon } from '@/components/Icon'
import PrimaryInput from '@/components/PrimaryInput'
import { createProduct, getProducts } from '@/components/Product/productUtils'
import { useSession } from '@/contexts/SessionContext'
import { useStore } from '@/contexts/StoreContext'
import { clearError } from '@/components/Product/productSlice'
import { useAppDispatch, useAppSelector } from '@/components/reduxHooks'

const AllProducts = () => {
    const { selectedStore } = useStore()
    const { session: bearerToken } = useSession()

    const products = useAppSelector((state) => (state.product.allProducts))
    const error = useAppSelector((state) => (state.product.error))
    const loading = useAppSelector((state) => (state.product.loading))

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        if (bearerToken && selectedStore) {
            dispatch(getProducts({
                bearerToken,
                storeId: selectedStore.id,
            }))
        }
    }, [])

    return (
        <View className='flex-1 bg-white p-4'>
            <FlatList
                ListHeaderComponent={
                    <>
                        <View className='flex-row items-center'>
                            <TouchableOpacity
                                className='w-[45] h-[45] rounded bg-gray-200'
                            >
                                <Icon name='arrow-back' className='m-auto' />
                            </TouchableOpacity>
                            <Text className='mx-auto text-lg font-semibold'>
                                All Products
                            </Text>
                            <TouchableOpacity
                                className='w-[45] h-[45] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded'
                                onPress={() => {
                                    if (selectedStore && bearerToken) {
                                        // dispatch(createProduct({
                                        //     bearerToken,
                                        //     storeId: selectedStore.id,
                                        //     name: 'Fried Chicken',
                                        //     availableModifiers: [
                                        //         {
                                        //             categoryName: 'Crispy Level',
                                        //             values: [
                                        //                 { name: 'Original' },
                                        //                 { name: 'Extra Crispy' },
                                        //             ]
                                        //         }
                                        //     ],
                                        //     availableOptions: [
                                        //         {
                                        //             categoryName: 'Chicken Cuts',
                                        //             values: [
                                        //                 { name: 'Breast' },
                                        //                 { name: 'Thigh' },
                                        //                 { name: 'Drumstick' },
                                        //                 { name: 'Wings' },
                                        //             ]
                                        //         }
                                        //     ],
                                        //     availableVariants: [
                                        //         {
                                        //             stock: 100,
                                        //             price: 10000,
                                        //             sku: 'FOD001',
                                        //             options: [
                                        //                 'Breast'
                                        //             ]
                                        //         },
                                        //         {
                                        //             stock: 100,
                                        //             price: 9000,
                                        //             sku: 'FOD002',
                                        //             options: [
                                        //                 'Thigh'
                                        //             ]
                                        //         },
                                        //         {
                                        //             stock: 100,
                                        //             price: 8000,
                                        //             sku: 'FOD003',
                                        //             options: [
                                        //                 'Drumstick'
                                        //             ]
                                        //         },
                                        //         {
                                        //             stock: 100,
                                        //             price: 7000,
                                        //             sku: 'FOD004',
                                        //             options: [
                                        //                 'Wings'
                                        //             ]
                                        //         },
                                        //     ]
                                        // }))
                                    }
                                }}
                            >
                                <Icon name='add' className='text-white' size={35} />
                            </TouchableOpacity>
                        </View>
                        <PrimaryInput
                            containerClassName='mt-3'
                            placeholder='Search an item...'
                            className='text-base h-[45] '
                        />
                    </>
                }
                ListEmptyComponent={
                    <View className='h-[45] justify-center items-center mt-3'>
                        <Text className='text-gray-500'>No product found</Text>
                    </View>
                }
                data={products}
                renderItem={({ item }) => {
                    return (
                        <TouchableHighlight>
                            <View className='flex-row items-center pt-3 mt-3 border-t border-gray-300'>
                                <View className='border-2 rounded h-[50] w-[50] mr-3 bg-gray-200 border-gray-300'>
                                    <Text className='text-xl text-gray-500 font-bold m-auto tracking-widest'>
                                        {item.name.charAt(0).toUpperCase() + item.name.charAt(1)}
                                    </Text>
                                </View>
                                <View className='w-8/12 border-r h-[50] justify-center border-gray-300 pr-3'>
                                    <Text className='text-base font-medium' numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text className='text-[13px] text-gray-500 mt-0.5'>
                                        {item.availableVariants.length} variants
                                    </Text>
                                </View>
                                <Text className='ml-auto text-gray-500 text-[13px]'>
                                    9999+
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            if (bearerToken && selectedStore) {
                                dispatch(getProducts({
                                    bearerToken,
                                    storeId: selectedStore.id,
                                }))
                            }
                        }}
                    />}
            />
        </View>
    )
}

export default AllProducts