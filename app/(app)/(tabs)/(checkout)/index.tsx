import { View, Text, TouchableHighlight, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useCustomOrder from '@/components/useCustomOrder';

const Keypad = () => {

    // const [note, setNote] = useState('');

    const { addToSale, clearCurrentInput, currentInput, note, updateCurrentInput, updateNote } = useCustomOrder()

    return (
        <View
            className='flex-1 pt-12 border border-red-500'
        >
            <View className='h-56 items-center justify-center'>
                <Text className='text-5xl text-center'>
                    {currentInput
                        ?
                        new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0
                        }).format(parseInt(currentInput))
                        :
                        'Rp 0'
                    }
                </Text>
                <TouchableOpacity className='mt-5 border border-gray-400 rounded w-28 h-9 items-center justify-center bg-gray-100'>
                    <Text className='text-gray-700'>Add note</Text>
                </TouchableOpacity>
            </View>
            <View className='flex-row flex-wrap'>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('1') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400'
                >
                    <Text className='text-2xl text-gray-700'>1</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('2') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400'>
                    <Text className='text-2xl text-gray-700'>2</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('3') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400'
                >
                    <Text className='text-2xl text-gray-700'>3</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('4') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400'>
                    <Text className='text-2xl text-gray-700'>4</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('5') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400'>
                    <Text className='text-2xl text-gray-700'>5</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('6') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400'>
                    <Text className='text-2xl text-gray-700'>6</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('7') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400'>
                    <Text className='text-2xl text-gray-700'>7</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('8') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400'>
                    <Text className='text-2xl text-gray-700'>8</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('9') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400'>
                    <Text className='text-2xl text-gray-700'>9</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { clearCurrentInput() }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-l border-b border-gray-400'
                >
                    <Text className='text-2xl text-gray-700'>C</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { updateCurrentInput('0') }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-x border-b border-gray-400'>
                    <Text className='text-2xl text-gray-700'>0</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={'#9ca3af55'}
                    onPress={() => { }}
                    className='w-[33.3%] h-[23%] items-center justify-center border-t border-r border-b border-gray-400'>
                    <Text className='text-2xl text-gray-700'>+</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

export default Keypad