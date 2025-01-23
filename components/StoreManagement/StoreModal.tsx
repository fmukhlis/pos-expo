import { View, Text, Modal, ModalProps, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '../Icon'
import PrimaryInput from '../PrimaryInput'
import { PrimaryButton } from '../PrimaryButton'
import { StoreData, StoreProps, useStore } from '@/contexts/StoreContext'
import ErrorModal from '../ErrorModal'
import { DangerButton } from '../DangerButton'

const StoreModal = ({
    mode = 'create',
    onVisibleChange = () => { },
    onRequestClose,
    store,
    visible = false,
    ...props
}: StoreModalProps) => {

    const [data, setData] = React.useState(() => {
        if (mode === 'edit' && store) {
            const { id, ...storeData } = store
            return storeData
        }
        return {
            name: '',
            address: '',
            phone: '',
            email: ''
        }
    })

    const [modalVisible, setModalVisible] = React.useState(visible)

    const {
        createStore,
        createStoreLoading,
        errors,
        deleteStore,
        deleteStoreLoading,
        loadStores,
        setErrors,
        updateStore,
        updateStoreLoading,
    } = useStore()

    const save = () => {
        if (mode === 'edit') {
            if (store) {
                updateStore({
                    storeId: store.id,
                    data,
                    onSuccess: () => {
                        onVisibleChange(false)
                        loadStores()
                    },
                    onFailed: (errorData) => {
                        setErrors((prev) => ({
                            ...prev,
                            updateStore: Object.values(errorData.errors)[0] as string
                        }))
                    }
                })
            }
        } else {
            createStore({
                data,
                onSuccess: () => {
                    onVisibleChange(false)
                    loadStores()
                },
                onFailed: (errorData) => {
                    setErrors((prev) => ({
                        ...prev,
                        createStore: Object.values(errorData.errors)[0] as string
                    }))
                }
            })
        }
    }

    React.useEffect(() => {
        setModalVisible(visible)
        if (visible) {
            if (mode === 'edit' && store) {
                const { id, ...storeData } = store
                setData(storeData)
            }
        } else {
            setData({
                name: '',
                address: '',
                phone: '',
                email: ''
            })
        }
    }, [visible])

    return (
        <>
            <ErrorModal
                onVisibleChange={() => {
                    setErrors((prev) => ({
                        ...prev,
                        createStore: ''
                    }))
                }}
                errorMessage={errors.createStore}
            />
            <Modal
                {...props}
                animationType='slide'
                visible={modalVisible}
                transparent={true}
                onRequestClose={(event) => {
                    if (onRequestClose) {
                        onRequestClose(event)
                    }
                    if (!createStoreLoading && !updateStoreLoading && !deleteStoreLoading) {
                        onVisibleChange(false)
                    }
                }}
            >
                <View className='flex-1 flex-row items-end justify-center'>
                    <View
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }}
                        className='m-1 bg-white p-4 flex-1'
                    >
                        <View className='flex-row justify-between items-center mb-4'>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!createStoreLoading && !updateStoreLoading && !deleteStoreLoading) {
                                        onVisibleChange(false)
                                    }
                                }}
                                className='w-[35] h-[35] items-center justify-center bg-gray-200 rounded'
                            >
                                <Icon name='close' className='text-gray-700' />
                            </TouchableOpacity>
                            <PrimaryButton
                                isProcessing={createStoreLoading || updateStoreLoading}
                                className='h-[35]'
                                disabled={deleteStoreLoading}
                                onPress={() => { save() }}
                            >
                                Save
                            </PrimaryButton>
                        </View>
                        <Text className='text-2xl font-bold mb-3'>
                            {mode === 'create' ? 'Create Store' : 'Edit Store'}
                        </Text>
                        <View>
                            <Text className='text-base font-semibold mb-3'>Store Details</Text>
                            <PrimaryInput
                                autoCapitalize='words'
                                className='h-[40]'
                                containerClassName='mb-3'
                                placeholder='Store name...'
                                value={data.name}
                                onChangeText={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        name: value,
                                    }))
                                }}
                            />
                            <PrimaryInput
                                className='h-[40]'
                                containerClassName='mb-3'
                                placeholder='Address...'
                                value={data.address}
                                onChangeText={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        address: value,
                                    }))
                                }}
                            />
                            <Text className='text-base font-semibold mb-3 '>Store Contact</Text>
                            <PrimaryInput
                                className='h-[40]'
                                keyboardType='number-pad'
                                containerClassName='mb-3'
                                placeholder='Phone number...'
                                value={data.phone}
                                onChangeText={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        phone: value,
                                    }))
                                }}
                            />
                            <PrimaryInput
                                keyboardType='email-address'
                                autoCapitalize='none'
                                className='h-[40]'
                                containerClassName=''
                                placeholder='Email...'
                                value={data.email}
                                onChangeText={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        email: value,
                                    }))
                                }}
                            />
                        </View>
                        {mode === 'edit' &&
                            <View className='items-center mt-4'>
                                <DangerButton
                                    onPress={() => {
                                        if (store) {
                                            deleteStore({
                                                storeId: store.id,
                                                onSuccess: () => {
                                                    onVisibleChange(false)
                                                    loadStores()
                                                },
                                                onFailed: (errorData) => {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        deleteStore: Object.values(errorData.errors)[0] as string
                                                    }))
                                                }
                                            })
                                        }
                                    }}
                                    disabled={createStoreLoading || updateStoreLoading}
                                    isProcessing={deleteStoreLoading}
                                    className='h-[40] px-5 bg-red-500 rounded border-2 border-rose-300'
                                >
                                    Delete Store
                                </DangerButton>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default StoreModal

interface StoreModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onVisibleChange?: (visible: boolean) => void
    store?: StoreProps | undefined | null
    mode?: 'create' | 'edit'
}