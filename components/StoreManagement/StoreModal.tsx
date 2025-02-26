import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'

import Toast from 'react-native-toast-message'

import { Icon } from '../Icon'
import { useAppSelector } from '../reduxHooks'
import { DangerButton } from '../DangerButton'
import { PrimaryButton } from '../PrimaryButton'
import { useSession } from '@/contexts/SessionContext'

import {
    useDestroyStoreMutation,
    useLazyGetStoreQuery,
    useStoreStoreMutation,
    useUpdateStoreMutation
} from '../services/store'

import PrimaryInput from '../PrimaryInput'
import CustomActivityIndicator from '../CustomActivityIndicator'

const StoreModal = ({
    onClose,
    visible = false,
    ...props
}: StoreModalProps) => {

    const { user } = useSession()

    const userId = user!.id
    const storeId = useAppSelector(({ store }) => (store.selectedStoreId))

    const [data, setData] = React.useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    })

    const [getStore, getStoreResult] = useLazyGetStoreQuery()
    const [storeStore, storeStoreResult] = useStoreStoreMutation()
    const [updateStore, updateStoreResult] = useUpdateStoreMutation()
    const [destroyStore, destroyStoreResult] = useDestroyStoreMutation()

    const handleSave = () => {
        if (storeId) {
            updateStore({
                userId,
                storeId,
                ...data
            })
                .unwrap()
                .then(() => { onClose() })
                .catch((error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ' + error.status,
                        text2: error.data.message
                    })
                })
        } else {
            storeStore({ userId, ...data })
                .unwrap()
                .then(() => { onClose() })
                .catch((error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ' + error.status,
                        text2: error.data.message
                    })
                })
        }
    }

    const handleDelete = () => {
        if (storeId) {
            destroyStore({ userId, storeId })
                .unwrap()
                .then(() => { onClose() })
                .catch((error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ' + error.status,
                        text2: error.data.message
                    })
                })
        }
    }

    const handleNameChange = (name: string) => {
        setData((prev) => ({ ...prev, name }))
    }

    const handleAddressChange = (address: string) => {
        setData((prev) => ({ ...prev, address }))
    }

    const handlePhoneChange = (phone: string) => {
        setData((prev) => ({ ...prev, phone }))
    }

    const handleEmailChange = (email: string) => {
        setData((prev) => ({ ...prev, email }))
    }

    React.useEffect(() => {
        if (storeId) {
            getStore({ storeId }).unwrap()
                .then(({ id, createdAt, owner, ...rest }) => {
                    setData(rest)
                })
                .catch((error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ' + error.status,
                        text2: error.data.message,
                    })
                })
        } else {
            setData({ name: '', address: '', phone: '', email: '' })
        }
    }, [storeId])

    return (
        <>
            <Modal
                {...props}
                animationType='slide'
                visible={visible}
                transparent={true}
                onRequestClose={() => { onClose() }}
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
                        className={`m-1 p-4 flex-1 bg-white ${getStoreResult.isFetching ? 'opacity-80' : ''}`}
                    >
                        {getStoreResult.isFetching
                            ? <View className='h-[460]'><CustomActivityIndicator size={'large'} className='m-auto' /></View>
                            : <>
                                <View className='flex-row justify-between items-center mb-4'>
                                    <TouchableOpacity
                                        onPress={() => { onClose() }}
                                        className='w-[40] h-[40] items-center justify-center bg-gray-200 rounded'
                                    >
                                        <Icon name='close' className='text-gray-700' />
                                    </TouchableOpacity>
                                    <PrimaryButton
                                        isProcessing={updateStoreResult.isLoading || storeStoreResult.isLoading}
                                        className='h-[40]'
                                        onPress={handleSave}
                                    >
                                        Save
                                    </PrimaryButton>
                                </View>
                                <Text className='text-2xl font-bold mb-3'>
                                    {storeId ? 'Edit Store' : 'Create Store'}
                                </Text>
                                <View>
                                    <Text className='text-base font-semibold mb-3'>Store Details</Text>
                                    <PrimaryInput
                                        autoCapitalize='words'
                                        className='h-[40]'
                                        containerClassName='mb-3'
                                        placeholder='Store name...'
                                        value={data.name}
                                        onChangeText={handleNameChange}
                                    />
                                    <PrimaryInput
                                        className='h-[40]'
                                        containerClassName='mb-3'
                                        placeholder='Address...'
                                        value={data.address}
                                        onChangeText={handleAddressChange}
                                    />
                                    <Text className='text-base font-semibold mb-3 '>Store Contact</Text>
                                    <PrimaryInput
                                        className='h-[40]'
                                        keyboardType='number-pad'
                                        containerClassName='mb-3'
                                        placeholder='Phone number...'
                                        value={data.phone}
                                        onChangeText={handlePhoneChange}
                                    />
                                    <PrimaryInput
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        className='h-[40]'
                                        containerClassName=''
                                        placeholder='Email...'
                                        value={data.email}
                                        onChangeText={handleEmailChange}
                                    />
                                </View>
                                {storeId &&
                                    <View className='items-center mt-7 pt-4 border-t border-gray-300'>
                                        <DangerButton
                                            onPress={handleDelete}
                                            isProcessing={destroyStoreResult.isLoading}
                                            className='h-[40] px-5 rounded'
                                        >
                                            Delete Store
                                        </DangerButton>
                                    </View>
                                }
                            </>
                        }
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default StoreModal

interface StoreModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onClose: () => void
}