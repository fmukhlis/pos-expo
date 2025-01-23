import { View, Text, FlatList, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native'
import React from 'react'
import { Icon } from '@/components/Icon'
import PrimaryInput from '@/components/PrimaryInput'
import { useAppSelector } from '@/components/reduxHooks'
import { router } from 'expo-router'
import useCategory from '@/components/Product/useCategory'
import ManageCategoryModal from '@/components/Product/ManageCategoryModal'
import useFilterItemsByString from '@/components/useFilterItemsByString'

const ProductCategory = () => {

    const categories = useAppSelector((state) => (state.productCategory.categories))
    const loading = useAppSelector((state) => (state.productCategory.loading))

    const {
        filterText,
        filteredItems,
        setFilterText
    } = useFilterItemsByString({
        items: categories,
        targetFieldName: 'name'
    })

    // Show and hide <CreateCategoryModal/>, fetch categories on mounted,
    // and expose the fetchCategories function to refetch the categories    
    const {
        fetchCategories,
        modalVisible,
        showManageCategoryModal,
        hideManageCategoryModal,
    } = useCategory()

    return (
        <View className='flex-1 bg-white'>
            <ManageCategoryModal
                animationType='slide'
                visible={modalVisible}
                onClose={hideManageCategoryModal}
            />
            <FlatList
                ListHeaderComponent={
                    <>
                        <View className='flex-row items-center mt-4 px-4'>
                            <TouchableOpacity
                                onPress={() => { router.back() }}
                                className='w-[45] h-[45] rounded bg-gray-200'
                            >
                                <Icon name='arrow-back' className='m-auto' />
                            </TouchableOpacity>
                            <Text className='mx-auto text-lg font-semibold'>
                                All Categories
                            </Text>
                            <TouchableOpacity
                                className={`w-[45] h-[45] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded`}
                                onPress={() => { showManageCategoryModal(null) }}
                            >
                                <Icon name='add' className='text-white' size={35} />
                            </TouchableOpacity>
                        </View>
                        <PrimaryInput
                            containerClassName='my-3 mx-4'
                            placeholder='Search a category...'
                            className='text-base h-[45]'
                            value={filterText}
                            onChangeText={setFilterText}
                        />
                    </>
                }
                ListEmptyComponent={
                    <View className='h-[45] justify-center items-center'>
                        <Text className='text-gray-500'>No category found</Text>
                    </View>
                }
                data={filteredItems}
                renderItem={({ item }) => {
                    return (
                        <View className='border-t border-gray-300 mx-4'>
                            <TouchableHighlight
                                underlayColor={'#f3f4f6'}
                                onPress={() => { showManageCategoryModal(item.id) }}
                            >
                                <View className='flex-row items-center p-3'>
                                    <View className='border-2 rounded h-[50] w-[50] mr-3 bg-gray-200 border-gray-300'>
                                        <Text className='text-xl text-gray-500 font-bold m-auto tracking-widest'>
                                            {item.name.charAt(0).toUpperCase() + item.name.charAt(1)}
                                        </Text>
                                    </View>
                                    <View className='flex-1 h-[50] justify-center border-gray-300'>
                                        <Text className='text-base font-medium' numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text className='text-[13px] text-gray-500 mt-0.5'>
                                            {item.productsCount} products
                                        </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading.getCategories}
                        onRefresh={fetchCategories}
                    />}
            />
        </View>
    )
}

export default ProductCategory