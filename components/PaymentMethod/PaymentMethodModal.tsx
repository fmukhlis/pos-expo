import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '../Icon'
import { PrimaryButton } from '../PrimaryButton'
import PrimaryInput from '../PrimaryInput'
import { SecondaryButton } from '../SecondaryButton'
import { useSession } from '@/contexts/SessionContext'
import usePaymentMethodAPI from './usePaymentMethod'
import { usePaymentMethod } from '@/contexts/PaymentMethodContext'
import { useStore } from '@/contexts/StoreContext'

const PaymentMethodModal = ({
    mode = 'create',
    visible = false,
    onVisibleChange = (visible) => { },
    onRequestClose,
    ...props
}: PaymentMethodModalProps) => {

    const { session } = useSession()
    const { selectedStore } = useStore()

    const {
        paymentMethods,
        selectedPaymentMethodIndex,
        setPaymentMethods
    } = usePaymentMethod()

    const {
        createPaymentMethod,
        createPaymentMethodLoading,
        getPaymentMethods,
        updatePaymentMethod,
        updatePaymentMethodLoading,
    } = usePaymentMethodAPI()

    const [modalVisible, setModalVisible] = React.useState(visible)

    const [data, setData] = React.useState(() => {
        if (mode === 'edit' && selectedPaymentMethodIndex !== null) {
            const { id, ...paymentMethodData } = paymentMethods[selectedPaymentMethodIndex]
            return paymentMethodData
        }

        return {
            name: '',
            destination: ''
        }
    })

    const save = () => {
        if (mode === 'edit') {
            if (selectedPaymentMethodIndex !== null) {
                updatePaymentMethod({
                    data,
                    storeId: selectedStore?.id,
                    paymentMethodId: paymentMethods[selectedPaymentMethodIndex].id,
                    bearerToken: session,
                    onSuccess: () => {
                        onVisibleChange(false)
                        getPaymentMethods({
                            storeId: selectedStore?.id,
                            bearerToken: session,
                            onSuccess: (paymentMethods) => {
                                setPaymentMethods(paymentMethods)
                            }
                        })
                    }
                })
            }
        } else {
            createPaymentMethod({
                data,
                storeId: selectedStore?.id,
                bearerToken: session,
                onSuccess: () => {
                    onVisibleChange(false)
                    getPaymentMethods({
                        storeId: selectedStore?.id,
                        bearerToken: session,
                        onSuccess: (paymentMethods) => {
                            setPaymentMethods(paymentMethods)
                        }
                    })
                }
            })
        }
    }

    React.useEffect(() => {
        setModalVisible(visible)
        if (visible) {
            if (mode === 'edit' && selectedPaymentMethodIndex !== null) {
                const { id, ...paymentMethodData } = paymentMethods[selectedPaymentMethodIndex]
                setData(paymentMethodData)
            }
        } else {
            setData({
                name: '',
                destination: '',
            })
        }
    }, [visible])

    return (
        <Modal
            {...props}
            transparent
            animationType='fade'
            visible={modalVisible}
            onRequestClose={(event) => {
                if (onRequestClose) {
                    onRequestClose(event)
                } else {
                    if (!createPaymentMethodLoading) {
                        onVisibleChange(false)
                    }
                }
            }}
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
                    className='bg-white p-5 w-10/12'
                >
                    <Text className='text-xl font-bold mb-5'>
                        {mode === 'create' ? 'Add ' : 'Edit '}
                        Payment Method
                    </Text>
                    <PrimaryInput
                        autoCapitalize='words'
                        className='h-[35]'
                        containerClassName='mb-3'
                        placeholder='Payment name...'
                        value={data.name}
                        onChangeText={(name) => {
                            setData((prev) => ({
                                ...prev,
                                name
                            }))
                        }}
                    />
                    <PrimaryInput
                        autoCapitalize='none'
                        className='h-[35]'
                        containerClassName='mb-4'
                        placeholder='Payment destination...'
                        value={data.destination}
                        onChangeText={(destination) => {
                            setData((prev) => ({
                                ...prev,
                                destination
                            }))
                        }}
                    />
                    <View
                        className='flex-row items-center justify-end space-x-3'
                    >
                        <SecondaryButton
                            disabled={createPaymentMethodLoading || updatePaymentMethodLoading}
                            onPress={() => {
                                onVisibleChange(false)
                            }}
                            className='h-[35]'
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            isProcessing={createPaymentMethodLoading || updatePaymentMethodLoading}
                            onPress={save}
                            className='h-[35]'
                        >
                            Save
                        </PrimaryButton>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default PaymentMethodModal

interface PaymentMethodModalProps extends React.ComponentPropsWithoutRef<typeof Modal> {
    onVisibleChange?: (visible: boolean) => void
    mode?: 'create' | 'edit'
}