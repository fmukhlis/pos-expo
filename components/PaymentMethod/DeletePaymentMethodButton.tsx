import { View, Text, TouchableHighlight, Pressable } from 'react-native'
import React from 'react'
import { Icon } from '../Icon'
import { useSession } from '@/contexts/SessionContext'
import { useStore } from '@/contexts/StoreContext'
import { usePaymentMethod } from '@/contexts/PaymentMethodContext'
import usePaymentMethodAPI from './usePaymentMethod'

const DeletePaymentMethodButton = ({ className, paymentMethodId, onPress, onSuccess, style, ...props }: DeletePaymentMethodButtonProps) => {

  const { session: bearerToken } = useSession()
  const { selectedStore } = useStore()

  const { deletePaymentMethod, deletePaymentMethodLoading } = usePaymentMethodAPI()

  return (
    <Pressable
      {...props}
      onLongPress={() => {
        deletePaymentMethod({
          bearerToken,
          storeId: selectedStore?.id,
          paymentMethodId,
          onSuccess: () => {
            if (onSuccess) {
              onSuccess()
            }
          }
        })
      }}
      style={({ pressed }) => {
        return ([
          {
            backgroundColor: pressed ? '#fecaca' : '#fecaca00',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center'
          },
          style
        ])
      }}
      delayLongPress={2000}
    >
      {({ pressed }) => {
        return (
          deletePaymentMethodLoading
            ?
            <Text className='text-sm text-red-500'>Deleting...</Text>
            : (pressed
              ?
              <Text className='text-sm text-red-500'>Hold 2 Seconds</Text>
              :
              <Icon name='trash-outline' className='text-red-500' size={20} />
            )
        )
      }}
    </Pressable>
  )
}

export default DeletePaymentMethodButton

interface DeletePaymentMethodButtonProps extends React.ComponentPropsWithoutRef<typeof TouchableHighlight> {
  paymentMethodId: number
  onSuccess?: () => void
}