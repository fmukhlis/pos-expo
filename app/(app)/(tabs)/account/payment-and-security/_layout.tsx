import React from 'react'
import { Stack } from 'expo-router'
import { PaymentMethodProvider } from '@/contexts/PaymentMethodContext'
import { PermissionProvider } from '@/contexts/PermissionContext'

const PaymentAndSecurityLayout = () => {

    return (
        <PaymentMethodProvider>
            <PermissionProvider>
                <Stack
                    screenOptions={{
                        headerShown: false
                    }}
                />
            </PermissionProvider>
        </PaymentMethodProvider>
    )
}

export default PaymentAndSecurityLayout