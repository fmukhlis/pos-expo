import { View, Text, FlatList, TextInput, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ItemContext } from '@/contexts/ItemContext'
import PrimaryInput from '@/components/PrimaryInput'
import { Icon } from '@/components/Icon'
import api from '@/utils/api'

const Library = () => {

    const { items, fetchItems, isLoading } = useContext(ItemContext)

    return (
        <View className='flex-1 border border-red-500'>
            <FlatList
                data={items}
                ListHeaderComponent={() => (
                    <View className='mt-[65]'>
                        <PrimaryInput placeholder='Search...' className='text-sm h-12' />
                    </View>
                )}
                renderItem={({ item }) => (
                    <View className='mt-1 p-1 h-[52] bg-gray-200/50 rounded border border-gray-300 flex-1 flex-row space-x-3'>
                        <View className='w-[52] bg-red-200 justify-center items-center'>
                            <Text className='font-bold text-2xl'>IT</Text>
                        </View>
                        <View className='justify-center flex-1'>
                            <Text className='font-bold text-base'>{item.name}</Text>
                            <Text>{item.availableVariants.length} variants</Text>
                        </View>
                        <View className='items-end flex-1 justify-center'>
                            <Icon name='add' className='text-gray-500' />
                        </View>
                    </View>
                )}
                keyExtractor={({ id }) => (`${id}`)}
                ListEmptyComponent={() => (
                    <View className='p-1 h-[52] bg-gray-200/50 rounded border border-gray-300 flex-1 flex-row space-x-3'>
                        <View className='justify-center items-center flex-1'>
                            <Text className='text-sm'>No products found</Text>
                        </View>
                    </View>
                )}
                refreshControl={<RefreshControl progressViewOffset={68} onRefresh={fetchItems} refreshing={isLoading} />}
            />
        </View>
    )
}

export default Library