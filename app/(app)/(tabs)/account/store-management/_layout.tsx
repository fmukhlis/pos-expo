import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { EmployeeProvider } from '@/contexts/EmployeeContext'
import { ProductProvider } from '@/contexts/ProductContext'
import { useAppDispatch, useAppSelector } from '@/components/reduxHooks'
import { useSession } from '@/contexts/SessionContext'
import { useStore } from '@/contexts/StoreContext'
import { getProducts } from '@/components/Product/productSlice'
import LoadingComponent from '@/components/LoadingComponent'

const StoreManagementLayout = () => {

    const { session: bearerToken } = useSession();
    const { selectedStore } = useStore();

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (bearerToken && selectedStore) {
            const payload = {
                bearerToken,
                storeId: selectedStore.id,
            }
            dispatch(getProducts(payload));
        }
    }, [])

    const products = useAppSelector((state) => (state.product.products))

    if (!products.length) {
        return (
            <LoadingComponent />
        )
    }

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