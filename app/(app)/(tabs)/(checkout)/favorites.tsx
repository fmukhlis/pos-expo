import { View, Text, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { ItemContext } from '@/contexts/ItemContext'
import { Icon } from '@/components/Icon'

const Favorites = () => {

    const { items } = useContext(ItemContext)

    return (
        <ScrollView className='flex-1'>
            <View className='flex-row flex-wrap gap-2 p-2 pt-[68]'>
                {items.map((item, index) => (
                    <View key={item.id} className={`basis-[40%] flex-grow h-24 bg-gray-100 border border-gray-300 rounded justify-center items-center`}>
                        <Text className='text-lg font-bold text-gray-500/80'>{item.name}</Text>
                    </View>
                ))}
                {(items.length < 20) &&
                    <View className='basis-[40%] flex-grow h-24 bg-gray-100 border border-gray-300 rounded justify-center items-center'>
                        <Icon name='add' className='text-gray-300' size={40} />
                    </View>
                }
            </View>
        </ScrollView>
    )
}

export default Favorites