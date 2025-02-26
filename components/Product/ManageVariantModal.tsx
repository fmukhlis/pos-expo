import { View, Text, Modal, ScrollView, TouchableHighlight, Alert, TextInput } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../Icon'
import PrimaryInput from '../PrimaryInput'
import { PrimaryTouchable } from '../PrimaryTouchable'
import CurrencyTextInput from '../CurrencyTextInput'
import { ProductPayload } from '@/types/product'

const ManageVariantModal = ({
    onClose,
    onSave,
    visible,
    initialData,
    productName,
    ...props
}: ManageVariantModalProps) => {

    const [data, setData] = React.useState<ProductPayload['availableVariants'][number]>(initialData)

    const validateData = (value: ProductPayload['availableVariants'][number]) => {
        if (!value.price.length || parseInt(value.price) <= 0) {
            return false
        }
        if (!value.stock.length) {
            return false
        }
        return true
    }

    const handleSave = () => {
        if (validateData(data)) {
            onSave(data)
            setData(initialData ?? {
                productOptions: [],
                price: '',
                sku: '',
                stock: ''
            })
        }
    }

    const changeSku = (newSku: string) => { setData((prev) => ({ ...prev, sku: newSku.toUpperCase() })) }
    const changePrice = (newPrice: { raw: string; formatted: string }) => { setData((prev) => ({ ...prev, price: newPrice.raw })) }
    const changeStock = (newStock: string) => { setData((prev) => ({ ...prev, stock: `${isNaN(parseInt(newStock, 10)) ? '' : parseInt(newStock, 10)}` })) }

    React.useEffect(() => {
        setData(initialData)
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
                        Manage Variant
                    </Text>
                    <PrimaryTouchable
                        disabled={!validateData(data)}
                        onPress={handleSave}
                        className='w-[45] h-[45]'
                    >
                        <Icon name='checkmark' className='m-auto text-white' />
                    </PrimaryTouchable>
                </View>
                <View className='flex-row justify-between items-center mt-5'>
                    <Text className='font-medium mr-3 text-justify text-base w-[70]'>Product</Text>
                    <Text className='mr-2 font-bold'>:</Text>
                    <TextInput
                        editable={false}
                        value={productName}
                        className='border-gray-200 border-y flex-1 px-3 bg-gray-50 text-sm h-[40] font-medium'
                    />
                </View>
                <View className='flex-row justify-between items-center mt-3'>
                    <Text className='font-medium mr-3 text-justify text-base w-[70]'>Variant</Text>
                    <Text className='mr-2 font-bold'>:</Text>
                    <TextInput
                        editable={false}
                        value={data.options?.join(', ')}
                        className='border-gray-200 border-y flex-1 px-3 bg-gray-50 text-sm h-[40] font-medium'
                    />
                </View>
                <View className='mt-4'>
                    <Text className='text-base font-medium'>
                        Price and Inventory
                    </Text>
                </View>
                <PrimaryInput
                    autoCapitalize='characters'
                    containerClassName='mt-3'
                    className='h-[40] text-sm'
                    placeholder='SKU'
                    value={data.sku}
                    onChangeText={changeSku}
                />
                <CurrencyTextInput
                    autoCapitalize='none'
                    keyboardType='numeric'
                    containerClassName='mt-3'
                    className='h-[40] text-sm'
                    placeholder='Price'
                    value={data.price}
                    onValueChange={changePrice}
                />
                <PrimaryInput
                    autoCapitalize='none'
                    keyboardType='numeric'
                    containerClassName='mt-3'
                    className='h-[40] text-sm'
                    placeholder='Stock'
                    value={data.stock}
                    onChangeText={changeStock}
                />
            </ScrollView>
        </Modal>
    )
}

export default ManageVariantModal

interface ManageVariantModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onSave: (data: ProductPayload['availableVariants'][number]) => void
    onClose: () => void
    initialData: ProductPayload['availableVariants'][number]
    productName: string
}