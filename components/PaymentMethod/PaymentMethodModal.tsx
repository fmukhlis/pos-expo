import React from 'react'
import Toast from 'react-native-toast-message'
import { View, Text, Modal } from 'react-native'

import { useAppSelector } from '../reduxHooks'
import { PrimaryButtonSM } from '../PrimaryButton'
import { SecondaryButtonSM } from '../SecondaryButton'

import {
    useLazyGetPaymentMethodQuery,
    useStorePaymentMethodMutation,
    useUpdatePaymentMethodMutation
} from '../services/paymentMethods'

import PrimaryInput from '../PrimaryInput'
import CustomActivityIndicator from '../CustomActivityIndicator'

const PaymentMethodModal = ({
    visible = false,
    onClose,
    ...props
}: PaymentMethodModalProps) => {

    const storeId = useAppSelector(({ store }) => (store.selectedStoreId))!
    const paymentMethodId = useAppSelector(({ paymentMethod }) => (paymentMethod.selectedPaymentMethodId))

    const [getPaymentMethod, getPaymentMethodResult] = useLazyGetPaymentMethodQuery()
    const [storePaymentMethod, storePaymentMethodResult] = useStorePaymentMethodMutation()
    const [updatePaymentMethod, updatePaymentMethodResult] = useUpdatePaymentMethodMutation()

    const [data, setData] = React.useState({
        name: '',
        destination: ''
    })

    const handleNameChange = (name: string) => {
        setData((prev) => ({ ...prev, name }))
    }

    const handleDestinationChange = (destination: string) => {
        setData((prev) => ({ ...prev, destination }))
    }

    const save = () => {
        if (paymentMethodId) {
            updatePaymentMethod({ storeId, paymentMethodId, ...data })
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
            storePaymentMethod({ storeId, ...data })
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

    React.useEffect(() => {
        if (paymentMethodId) {
            getPaymentMethod({ paymentMethodId, storeId }).unwrap()
                .then(({ id, ...rest }) => {
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
            setData({
                name: '',
                destination: '',
            })
        }
    }, [paymentMethodId])

    return (
        <Modal
            {...props}
            transparent
            animationType='fade'
            visible={visible}
            onRequestClose={() => { onClose() }}
        >
            <View className='flex-1 items-center justify-center'>
                <View
                    style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                    className='bg-white p-6 w-10/12'
                >
                    {getPaymentMethodResult.isFetching
                        ? <View ><CustomActivityIndicator size={'large'} className='m-auto' /></View>
                        : <>
                            <Text className='text-lg font-bold mb-5'>
                                {paymentMethodId ? 'Edit ' : 'Add '}
                                Payment Method
                            </Text>
                            <PrimaryInput
                                autoCapitalize='words'
                                className='h-[35] text-sm'
                                containerClassName='mb-3'
                                placeholder='Payment name...'
                                value={data.name}
                                onChangeText={handleNameChange}
                            />
                            <PrimaryInput
                                autoCapitalize='none'
                                className='h-[35] text-sm'
                                containerClassName='mb-3'
                                placeholder='Payment destination...'
                                value={data.destination}
                                onChangeText={handleDestinationChange}
                            />
                            <View
                                className='flex-row items-center justify-end space-x-3 mt-2'
                            >
                                <SecondaryButtonSM
                                    onPress={() => { onClose() }}
                                    className='h-[35]'
                                >
                                    Cancel
                                </SecondaryButtonSM>
                                <PrimaryButtonSM
                                    isProcessing={storePaymentMethodResult.isLoading || updatePaymentMethodResult.isLoading}
                                    onPress={save}
                                    className='h-[35]'
                                >
                                    Save
                                </PrimaryButtonSM>
                            </View>
                        </>
                    }
                </View>
            </View>
        </Modal>
    )
}

export default PaymentMethodModal

interface PaymentMethodModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onClose: () => void
}