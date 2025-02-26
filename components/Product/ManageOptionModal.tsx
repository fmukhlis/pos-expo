import { View, Text, Modal, ScrollView, TouchableHighlight, Alert } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../Icon'
import PrimaryInput from '../PrimaryInput'
import { PrimaryTouchable } from '../PrimaryTouchable'
import { ProductPayload } from '@/types/product'
import { PrimaryButton } from '../PrimaryButton'

const ManageOptionModal = ({
    onClose,
    onSave,
    visible,
    initialData,
    ...props
}: ManageOptionModalProps) => {

    const [data, setData] = React.useState<Exclude<ProductPayload['availableOptions'], null>[number]>(
        {
            categoryName: '',
            values: [{ name: '' }]
        }
    )

    const validateData = (value: Exclude<ProductPayload['availableOptions'], null>[number]) => {
        if (!value.categoryName) {
            return false
        }
        if (value.values.length < 1) {
            return false
        }
        if (value.values.filter((val) => (!val.name)).length > 0) {
            return false
        }
        const sanitizedArray = value.values.map((val) => (val.name.toLowerCase().replace(/\s/g, '')))
        if (new Set(sanitizedArray).size !== sanitizedArray.length) {
            return false
        }
        return true
    }

    const handleSave = () => {
        if (validateData(data)) {
            onSave(data)
            setData(initialData ?? {
                categoryName: '',
                values: [{ name: '' }]
            })
        }
    }

    React.useEffect(() => {
        setData(initialData ?? {
            categoryName: '',
            values: [{ name: '' }]
        })
    }, [initialData])

    return (
        <Modal
            {...props}
            visible={visible}
            animationType='slide'
            onRequestClose={onClose}
        >
            <ScrollView
                className='flex-1 bg-white px-4'
            >
                <View className='flex-row items-center mt-4'>
                    <TouchableOpacity
                        onPress={onClose}
                        className='w-[45] h-[45] rounded bg-gray-200'
                    >
                        <Icon name='close' className='m-auto' />
                    </TouchableOpacity>
                    <Text className='mx-auto text-lg font-semibold'>
                        {initialData
                            ? 'Edit Option'
                            : 'Add Option'}
                    </Text>
                    <PrimaryTouchable
                        disabled={!validateData(data)}
                        onPress={handleSave}
                        className='w-[45] h-[45]'
                    >
                        <Icon name='checkmark' className='m-auto text-white' />
                    </PrimaryTouchable>
                </View>
                <View className='mt-3'>
                    <Text className='mt-1 text-sm text-gray-500 mb-3'>
                        Please note that each "option set" name must be <Text className='font-medium text-gray-600'>UNIQUE</Text>. Using the same name will overwrite the existing one.
                    </Text>
                    <Text className='font-medium text-base mb-2'>Option set</Text>
                    <PrimaryInput
                        autoCapitalize='words'
                        placeholder='Size'
                        className='h-[40] text-sm'
                        maxLength={30}
                        value={data.categoryName}
                        onChangeText={(categoryName) => {
                            setData((prev) => ({
                                ...prev,
                                categoryName: sanitizeString(categoryName)
                            }))
                        }}
                    />
                </View>
                <View className='mt-3'>
                    <Text className='font-medium text-base'>
                        {data.categoryName ? `${data.categoryName} options` : 'Options'}
                    </Text>
                    {data.values.map((dataValue, dataValueIndex) => (
                        <View key={dataValueIndex} className='flex-row items-center mt-2'>
                            <PrimaryInput
                                autoCapitalize='words'
                                containerClassName='flex-1'
                                placeholder={dataValueIndex ? `Option ${dataValueIndex + 1}` : 'Large'}
                                className='h-[40] text-sm'
                                maxLength={15}
                                value={dataValue.name}
                                onChangeText={(name) => {
                                    setData((prev) => ({
                                        ...prev,
                                        values: prev.values.map(
                                            (prevValue, prevValueIndex) => (
                                                dataValueIndex === prevValueIndex)
                                                ? { name: sanitizeString(name) }
                                                : prevValue
                                        )
                                    }))
                                }}
                            />
                            {data.values.length > 1 &&
                                <TouchableHighlight
                                    underlayColor={'#fecaca'}
                                    onPress={() => {
                                        setData((prev) => ({
                                            ...prev,
                                            values: prev.values.filter((value, index) => (index !== dataValueIndex))
                                        }))
                                    }}
                                    className='ml-2 rounded border bg-red-100 border-red-300 h-[42] w-[42]'
                                >
                                    <Icon name='close' size={25} className='m-auto text-red-500' />
                                </TouchableHighlight>
                            }
                        </View>
                    ))}
                </View>
                <PrimaryButton
                    disabled={!!data.values.filter((value) => (!value.name)).length}
                    onPress={() => {
                        setData((prev) => ({
                            ...prev, values: [...prev.values, { name: '' }]
                        }))
                    }}
                    className='mt-3 h-[45]'
                >
                    Add modifier
                </PrimaryButton>
            </ScrollView>
        </Modal>
    )
}

export default ManageOptionModal

const sanitizeString = (str: string) => { return str.replace(/[^a-zA-Z0-9\s]/g, '') }

interface ManageOptionModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onSave: (data: Exclude<ProductPayload['availableModifiers'], null>[number]) => void
    onClose: () => void
    initialData?: Exclude<ProductPayload['availableModifiers'], null>[number] | undefined | null
}