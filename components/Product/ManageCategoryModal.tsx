import { View, Text, TouchableOpacity, TouchableHighlight, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import BasicModal from '../BasicModal'
import { Icon } from '../Icon'
import PrimaryInput from '../PrimaryInput'
import { SecondaryButton, SecondaryButtonSM } from '../SecondaryButton'
import { PrimaryButton } from '../PrimaryButton'
import { useAppSelector } from '../reduxHooks'
import AssignableProductsList from './AssignableProductsList'
import AssignedProductsList from './AssignedProductsList'
import useManageCategoryModal from './useManageCategoryModal'
import useAssignProductsModal from './useAssignProductsModal'
import useFilterItemsByString from '../useFilterItemsByString'
import LoadingComponent from '../LoadingComponent'

const ManageCategoryModal = ({
    onClose = () => { },
    visible,
    ...props
}: ManageCategoryModalProps) => {

    const categoryName = useAppSelector((state) => (state.productCategory.data.name))
    const assignedProducts = useAppSelector((state) => (state.productCategory.assignedProducts))
    const selectedCategoryId = useAppSelector((state) => (state.productCategory.selectedCategoryId))

    // Show and hide self, show and hide <AssignProductsModal/>,
    // handle category name change, save category, do refetch
    // every time the selectedCategoryId has changed and expose
    // the loading state
    const {
        hideAssignProductsModal,
        showAssignProductsModal,
        modalVisible,
        setCategoryName,
        save,
        confirmDeletion,
        getCategoryResult,
        storeCategoryResult,
        destroyCategoryResult,
        updateCategoryResult,
    } = useManageCategoryModal({ visible, onClose })

    return (
        <>
            <BasicModal
                {...props}
                visible={visible}
                onRequestClose={() => { onClose() }}
                containerClassName='px-5 pt-5 pb-3 mt-auto bg-white border-t-2 border-gray-100'
            >{getCategoryResult.isFetching
                ?
                <View className='h-[315]'>
                    <LoadingComponent />
                </View>
                :
                <>
                    <View className='flex-row justify-between items-center'>
                        <TouchableOpacity
                            onPress={() => { onClose() }}
                        >
                            <Icon name='close' />
                        </TouchableOpacity>
                        {selectedCategoryId &&
                            <TouchableOpacity
                                onPress={confirmDeletion}
                            >
                                {destroyCategoryResult.isLoading
                                    ? <ActivityIndicator size={25} color="#ffffff" />
                                    : <Icon name='trash-outline' className='text-rose-500' size={27} />}
                            </TouchableOpacity>
                        }
                    </View>
                    <View className='mt-3'>
                        <Text className='text-lg font-bold'>
                            {selectedCategoryId ? 'Edit Category' : 'Create Category'}
                        </Text>
                    </View>
                    <View className='mt-3'>
                        <PrimaryInput
                            placeholder='Category name...'
                            className='h-[45]'
                            value={categoryName}
                            onChangeText={setCategoryName}
                        />
                        <SecondaryButton
                            className='h-[45] mt-3'
                            onPress={showAssignProductsModal}
                        >
                            Assign Products
                        </SecondaryButton>
                    </View>
                    <View className='p-2.5 bg-gray-100 mt-3 rounded'>
                        <AssignedProductsList
                            products={assignedProducts}
                            onProductTouched={() => { onClose() }}
                        />
                    </View>
                    <View className='border-t mt-3 pt-3 border-gray-300'>
                        <PrimaryButton
                            isProcessing={storeCategoryResult.isLoading || updateCategoryResult.isLoading}
                            className='h-[45]'
                            onPress={save}
                        >
                            Save
                        </PrimaryButton>
                    </View>
                </>
                }
            </BasicModal>
            <AssignProductsModal
                animationType='slide'
                onClose={hideAssignProductsModal}
                visible={modalVisible}
            />
        </>
    )
}

export default ManageCategoryModal

const AssignProductsModal = ({
    onClose = () => { },
    visible,
    ...props
}: AssignProductsModalProps) => {

    // Show and hide self, generate a checkmarkable products list,
    // checkmark product, save checkmarked product in store, and
    // sync the checkmarked product with store data on every
    // visibility change
    const {
        assignProduct,
        assignableProducts,
        save,
        isFetching,
    } = useAssignProductsModal({ onClose, visible })

    const { filterText, filteredItems, setFilterText } = useFilterItemsByString({
        items: assignableProducts,
        targetFieldName: 'name'
    })

    React.useEffect(() => {
        setFilterText("")
    }, [visible])

    return (
        <BasicModal
            {...props}
            visible={visible}
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
                {
                    isFetching
                        ? <LoadingComponent />
                        : <AssignableProductsList
                            products={filteredItems}
                            onItemClick={assignProduct}
                        />
                }
            </View>
        </BasicModal>
    )
}

interface ManageCategoryModalProps extends Omit<React.ComponentPropsWithoutRef<typeof BasicModal>, 'onRequestClose'> {
    onClose?: () => void
}

type AssignProductsModalProps = React.ComponentPropsWithoutRef<typeof ManageCategoryModal>