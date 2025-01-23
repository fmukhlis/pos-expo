import { View, Text } from 'react-native'
import React from 'react'
import api from '@/utils/api'
import axios from 'axios'

export default function usePaymentMethodAPI() {

    const [getPaymentMethodsLoading, setGetPaymentMethodsLoading] = React.useState(false)
    const [createPaymentMethodLoading, setCreatePaymentMethodLoading] = React.useState(false)
    const [updatePaymentMethodLoading, setUpdatePaymentMethodLoading] = React.useState(false)
    const [deletePaymentMethodLoading, setDeletePaymentMethodLoading] = React.useState(false)

    const getPaymentMethods = async (param: LoadPaymentMethodsParam) => {
        if (!param.storeId || !param.bearerToken) {
            return
        }

        try {
            setGetPaymentMethodsLoading(true)
            const response = await api.get(
                '/stores/' + param.storeId + '/payment-methods',
                {
                    headers: {
                        'Authorization': 'Bearer ' + param.bearerToken
                    }
                }
            )
            if (param.onSuccess) {
                param.onSuccess(response.data.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (param.onFailed) {
                    param.onFailed(error.message)
                }
                console.log('Error', error.message)
            }
        } finally {
            setGetPaymentMethodsLoading(false)
        }
    }

    const createPaymentMethod = async (param: CreatePaymentMethodParam) => {
        if (!param.storeId || !param.bearerToken || !param.data) {
            return
        }

        try {
            setCreatePaymentMethodLoading(true)
            const response = await api.post(
                '/stores/' + param.storeId + '/payment-methods',
                param.data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + param.bearerToken
                    }
                }
            )
            if (param.onSuccess) {
                param.onSuccess(response.data.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error', error.message)
                if (param.onFailed) {
                    param.onFailed(error.message)
                }
            }
        } finally {
            setCreatePaymentMethodLoading(false)
        }
    }

    const updatePaymentMethod = async (param: UpdatePaymentMethodParam) => {
        if (!param.paymentMethodId || !param.storeId || !param.bearerToken || !param.data) {
            return
        }

        try {
            setUpdatePaymentMethodLoading(true)
            const response = await api.put(
                '/stores/' + param.storeId + '/payment-methods/' + param.paymentMethodId,
                param.data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + param.bearerToken
                    }
                }
            )
            if (param.onSuccess) {
                param.onSuccess(response.data.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message)
                if (param.onFailed) {
                    param.onFailed(error.message)
                }
            }
        } finally {
            setUpdatePaymentMethodLoading(false)
        }
    }

    const deletePaymentMethod = async (param: DeletePaymentMethodParam) => {
        if (!param.storeId || !param.bearerToken || !param.paymentMethodId) {
            return
        }

        try {
            setDeletePaymentMethodLoading(true)
            const response = await api.delete(
                '/stores/' + param.storeId + '/payment-methods/' + param.paymentMethodId,
                {
                    headers: {
                        'Authorization': 'Bearer ' + param.bearerToken
                    }
                }
            )
            if (param.onSuccess) {
                param.onSuccess()
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message)
                if (param.onFailed) {
                    param.onFailed(error.message)
                }
            }
        } finally {
            setDeletePaymentMethodLoading(false)
        }
    }

    return {
        createPaymentMethod,
        createPaymentMethodLoading,
        deletePaymentMethod,
        deletePaymentMethodLoading,
        getPaymentMethods,
        getPaymentMethodsLoading,
        updatePaymentMethod,
        updatePaymentMethodLoading,
    }
}

export interface PaymentMethodProps extends PaymentMethodData {
    id: number
}

export interface PaymentMethodData {
    name: string
    destination: string
}

interface LoadPaymentMethodsParam {
    storeId?: number | null | undefined
    bearerToken?: string | null | undefined
    onSuccess?: (data: PaymentMethodProps[]) => void
    onFailed?: (errorMessage: string) => void
}

interface CreatePaymentMethodParam {
    storeId?: number | null | undefined
    bearerToken?: string | null | undefined
    data?: PaymentMethodData | null | undefined
    onSuccess?: (data: PaymentMethodProps) => void
    onFailed?: (errorMessage: string) => void
}

interface UpdatePaymentMethodParam {
    paymentMethodId?: number | null | undefined
    storeId?: number | null | undefined
    bearerToken?: string | null | undefined
    data?: PaymentMethodData | null | undefined
    onSuccess?: (data: PaymentMethodProps) => void
    onFailed?: (errorMessage: string) => void
}

interface DeletePaymentMethodParam {
    paymentMethodId?: number | null | undefined
    storeId?: number | null | undefined
    bearerToken?: string | null | undefined
    onSuccess?: () => void
    onFailed?: (errorMessage: string) => void
}