import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
import React from 'react'
import BasicModal from '../BasicModal'
import { Icon } from '../Icon'
import PrimaryInput from '../PrimaryInput'
import { SecondaryButtonSM } from '../SecondaryButton'
import { PrimaryButton } from '../PrimaryButton'
import { useAppDispatch, useAppSelector } from '../reduxHooks'
import useAssignableProducts from './useAssignableProducts'
import AssignableProductsList from './AssignableProductsList'
import useFilterProducts from './useFilterProducts'
import { setName, setAssignedProducts } from './categorySlice'
import AssignedProductsList from './AssignedProductsList'
import useCreateCategoryModalUI from './useCreateCategoryModalUI'
import useSaveCategory from './useSaveCategory'
import useAssignProductsModalUI from './useAssignProductsModalUI'

const CreateCategoryModal = ({
    onClose = () => { },
    visible,
    ...props
}: CreateCategoryModalProps) => {

    const assignedProducts = useAppSelector((state) => (state.productCategory.assignedProducts))
    const categoryName = useAppSelector((state) => (state.productCategory.data.name))

    const {
        hideAssignProductsModal,
        modalVisibility,
        showAssignProductsModal,
        setCategoryName
    } = useCreateCategoryModalUI({ visible })

    const { save, loading } = useSaveCategory({ onClose })

    return (
        <>
            <BasicModal
                {...props}
                visible={modalVisibility.self}
                onRequestClose={() => { onClose() }}
                containerClassName='px-5 pt-5 pb-3 mt-auto bg-white border-t-2 border-gray-100'
            >
                <View className='flex-row justify-between'>
                    <TouchableOpacity
                        onPress={() => { onClose() }}
                    >
                        <Icon name='close' />
                    </TouchableOpacity>
                    <PrimaryButton
                        isProcessing={loading}
                        className='w-[100] h-[40]'
                        onPress={save}
                    >
                        Save
                    </PrimaryButton>
                </View>
                <View className='mt-1'>
                    <Text className='text-lg font-bold'>Create Category</Text>
                </View>
                <View className='mt-3'>
                    <PrimaryInput
                        placeholder='Category name...'
                        className='h-[40]'
                        value={categoryName}
                        onChangeText={setCategoryName}
                    />
                    <SecondaryButtonSM
                        className='h-[40] mt-3'
                        onPress={showAssignProductsModal}
                    >
                        Assign Products
                    </SecondaryButtonSM>
                </View>
                <View className='p-2.5 bg-gray-100 mt-3 rounded'>
                    <AssignedProductsList products={assignedProducts} />
                </View>
            </BasicModal>
            <AssignProductsModal
                animationType='slide'
                onClose={hideAssignProductsModal}
                visible={modalVisibility.assignProducts}
            />
        </>
    )
}

export default CreateCategoryModal

const AssignProductsModal = ({
    onClose = () => { },
    visible,
    ...props
}: AssignProductsModalProps) => {

    const dispatch = useAppDispatch()

    const { modalVisible } = useAssignProductsModalUI({
        visible
    })

    const {
        assignableProducts,
        assignProduct
    } = useAssignableProducts({ visible })

    const {
        filterText,
        setFilterText,
        filteredProducts
    } = useFilterProducts({
        products: assignableProducts,
        visible,
    })

    const save = () => {
        const products = assignableProducts
            .filter(
                (assignableProduct) => (assignableProduct.isChecked)
            )
            .map(
                ({ isChecked, ...product }) => (product)
            )
        dispatch(setAssignedProducts(products))
        onClose()
    }

    return (
        <BasicModal
            {...props}
            visible={modalVisible}
            onRequestClose={save}
            containerClassName='mt-auto p-5 bg-white h-[90%]'
        >
            <View className='flex-row justify-between items-center mb-1'>
                <TouchableOpacity
                    onPress={save}
                    className='w-[30]'
                >
                    <Icon name='chevron-back' />
                </TouchableOpacity>
                <View className='pr-[30] flex-1'>
                    <Text className='text-lg font-bold text-center'>Assign Products</Text>
                </View>
            </View>
            <View className='relative mt-3'>
                <PrimaryInput
                    placeholder='Search a products...'
                    className='h-[40]'
                    containerClassName='pr-[50]'
                    value={filterText}
                    onChangeText={setFilterText}
                />
                <TouchableHighlight
                    underlayColor={'#0000000f'}
                    disabled={!filterText}
                    onPress={() => { setFilterText('') }}
                    className='absolute right-[1] top-[1] h-[40] w-[40] rounded-sm'
                >
                    <Icon name={filterText ? 'close' : 'search'} className='m-auto text-gray-500' size={23} />
                </TouchableHighlight>
            </View>
            <View className='mt-3 rounded'>
                <AssignableProductsList
                    products={filteredProducts}
                    onItemClick={assignProduct}
                />
            </View>
        </BasicModal>
    )
}

interface CreateCategoryModalProps extends Omit<React.ComponentPropsWithoutRef<typeof BasicModal>, 'onRequestClose'> {
    onClose?: () => void
}

type AssignProductsModalProps = React.ComponentPropsWithoutRef<typeof CreateCategoryModal>