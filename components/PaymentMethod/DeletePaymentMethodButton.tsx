import React from 'react'
import { Text, TouchableHighlight, Pressable } from 'react-native'

import { Icon } from '../Icon'
import { useAppSelector } from '../reduxHooks'
import CustomActivityIndicator from '../CustomActivityIndicator'
import { useDestroyPaymentMethodMutation } from '../services/paymentMethods'

const DeletePaymentMethodButton = ({ paymentMethodId, ...props }: DeletePaymentMethodButtonProps) => {

  const storeId = useAppSelector(({ store }) => (store.selectedStoreId))!

  const [destroyPaymentMethod, destroyPaymentMethodResult] = useDestroyPaymentMethodMutation()

  const handleDelete = () => { destroyPaymentMethod({ paymentMethodId, storeId }) }

  return (
    <Pressable
      {...props}
      disabled={destroyPaymentMethodResult.isLoading}
      onLongPress={handleDelete}
      style={({ pressed }) => {
        return ([
          {
            backgroundColor: pressed ? '#fecaca' : '#fecaca00',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center'
          },
          {
            marginRight: 5,
            height: 40,
            paddingLeft: 10,
            paddingRight: 10
          }
        ])
      }}
      delayLongPress={2000}
    >
      {({ pressed }) => {
        return (
          destroyPaymentMethodResult.isLoading
            ?
            <CustomActivityIndicator size={'small'} />
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

interface DeletePaymentMethodButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof TouchableHighlight>, 'style' | 'onLongPress'> {
  paymentMethodId: number
}