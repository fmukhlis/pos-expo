import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import React from 'react'
import { useStore } from '@/contexts/StoreContext'
import { useSession } from '@/contexts/SessionContext'
import { PrimaryButtonSM } from '@/components/PrimaryButton'
import PaymentMethodModal from '@/components/PaymentMethod/PaymentMethodModal'
import { usePaymentMethod } from '@/contexts/PaymentMethodContext'
import usePaymentMethodAPI from '@/components/PaymentMethod/usePaymentMethod'
import { Icon } from '@/components/Icon'
import DeletePaymentMethodButton from '@/components/PaymentMethod/DeletePaymentMethodButton'

const PaymentMethod = () => {

    const { session } = useSession()
    const { selectedStore } = useStore()
    const {
        paymentMethods,
        setPaymentMethods,
        setSelectedPaymentMethodIndex,
    } = usePaymentMethod()

    const {
        getPaymentMethods,
        getPaymentMethodsLoading,
    } = usePaymentMethodAPI()

    const [paymentMethodModalMode, setPaymentMethodModalMode] = React.useState<'create' | 'edit'>('create')
    const [paymentMethodModalVisible, setPaymentMethodModalVisible] = React.useState(false)

    React.useEffect(() => {
        getPaymentMethods({
            storeId: selectedStore?.id,
            bearerToken: session,
            onSuccess: (data) => {
                setPaymentMethods(data)
            }
        })
    }, [])

    React.useEffect(() => {
        if (paymentMethods.length) {
            setSelectedPaymentMethodIndex((prev) => {
                if (prev === null) {
                    return 0
                }
                return prev
            })
        } else {
            setSelectedPaymentMethodIndex(null)
        }
    }, [paymentMethods])

    return (
        <View
            className='flex-1 bg-white'
        >
            <PaymentMethodModal
                mode={paymentMethodModalMode}
                visible={paymentMethodModalVisible}
                onVisibleChange={(visible) => { setPaymentMethodModalVisible(visible) }}
            />
            <FlatList
                ListHeaderComponent={() => (
                    <View className='px-4 pt-4'>
                        <PaymentMethodModal
                            mode={paymentMethodModalMode}
                            visible={paymentMethodModalVisible}
                            onVisibleChange={(visible) => { setPaymentMethodModalVisible(visible) }}
                        />
                        <Text className='text-lg font-bold mb-2'>Payment Methods</Text>
                        {paymentMethods.length > 0 &&
                            <Text className='text-base mb-4'>
                                You have added <Text className='font-medium'>{paymentMethods.length}</Text> payment methods on <Text className='font-medium'>{selectedStore?.name}</Text>.
                            </Text>
                        }
                    </View>
                )}
                data={paymentMethods}
                renderItem={({ item, index }) => (
                    <View className='bg-gray-100 border-t border-gray-300 px-4 pt-2 pb-2.5 flex-row justify-between items-center'>
                        <View className='flex-1'>
                            <Text className='font-bold text-base mb-0.5'>
                                {item.name}
                            </Text>
                            <Text className='text-sm text-gray-500'>
                                {item.destination}
                            </Text>
                        </View>
                        <DeletePaymentMethodButton
                            style={{
                                marginRight: 5,
                                height: 40,
                                paddingLeft: 10,
                                paddingRight: 10
                            }}
                            onSuccess={() => {
                                getPaymentMethods({
                                    storeId: selectedStore?.id,
                                    bearerToken: session,
                                    onSuccess: (data) => {
                                        setPaymentMethods(data)
                                    }
                                })
                            }}
                            paymentMethodId={item.id}
                        />
                        <TouchableOpacity
                            className='rounded h-[40] w-[40] justify-center items-center'
                            onPress={() => {
                                setSelectedPaymentMethodIndex(index)
                                setPaymentMethodModalMode('edit')
                                setPaymentMethodModalVisible(true)
                            }}
                        >
                            <Icon name='create-outline' className='text-emerald-500' size={23} />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => (`${item.id}`)}
                ListEmptyComponent={() => (
                    <View className='px-4'>
                        <Text className='text-base'>You have never added any payment method for <Text className='font-medium'>{selectedStore?.name}</Text>.</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => {
                            getPaymentMethods({
                                storeId: selectedStore?.id,
                                bearerToken: session,
                                onSuccess: (data) => {
                                    setPaymentMethods(data)
                                }
                            })
                        }}
                        refreshing={getPaymentMethodsLoading}
                    />
                }
            />
            <View className='border-t border-gray-300 py-4 bg-white'>
                <PrimaryButtonSM
                    onPress={() => {
                        setPaymentMethodModalMode('create')
                        setPaymentMethodModalVisible(true)
                    }}
                    className='h-[40] self-center px-5'
                >
                    Add Payment Method
                </PrimaryButtonSM>
            </View>
        </View>
    )
}

export default PaymentMethod