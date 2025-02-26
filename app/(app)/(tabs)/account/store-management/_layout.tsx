import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { EmployeeProvider } from '@/contexts/EmployeeContext'
import { ProductProvider } from '@/contexts/ProductContext'
import { useAppDispatch, useAppSelector } from '@/components/reduxHooks'
import { useSession } from '@/contexts/SessionContext'
import { useStore } from '@/contexts/StoreContext'
import LoadingComponent from '@/components/LoadingComponent'

const StoreManagementLayout = () => {

    return (
        <EmployeeProvider>
            <Stack
                screenOptions={{
                    headerShown: false
                }}
            />
        </EmployeeProvider>
    )
}

export default StoreManagementLayout