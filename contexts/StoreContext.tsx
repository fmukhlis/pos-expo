import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from './SessionContext'
import axios, { AxiosError, AxiosResponse } from 'axios'
import api from '@/utils/api'

const StoreContext = React.createContext<StoreContextProps>({
    createStore: async () => { },
    createStoreLoading: false,
    errors: {
        createStore: '',
        deleteStore: '',
        loadStore: '',
        updateStore: '',
    },
    deleteStore: async () => { },
    deleteStoreLoading: false,
    loadStores: async () => { },
    loadStoresLoading: false,
    selectedStore: null,
    setErrors: () => { },
    setSelectedStore: () => { },
    stores: [],
    updateStore: async () => { },
    updateStoreLoading: false,
    loadWorkplace: async () => { },
    loadWorkplaceLoading: false,
})

export const useStore = () => {
    const context = React.useContext(StoreContext)
    if (!context) {
        throw new Error('The useStore() hook must be wrapped within a <StoreProvider/>')
    }
    return context
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {

    const { user, session } = useSession()

    const [selectedStore, setSelectedStore] = React.useState<StoreProps | null>(null)
    const [stores, setStores] = React.useState<StoreContextProps['stores']>([])
    const [loadStoresLoading, setLoadStoresLoading] = React.useState(false)
    const [createStoreLoading, setCreateStoreLoading] = React.useState(false)
    const [updateStoreLoading, setUpdateStoreLoading] = React.useState(false)
    const [deleteStoreLoading, setDeleteStoreLoading] = React.useState(false)
    const [loadWorkplaceLoading, setLoadWorkplaceLoading] = React.useState(false)

    const [errors, setErrors] = React.useState({
        createStore: '',
        loadStore: '',
        updateStore: '',
        deleteStore: '',
    })

    const loadWorkplace = async () => {
        try {
            setLoadWorkplaceLoading(true)
            const response = await api.get(
                '/profiles/' + user?.id + '/stores',
                { headers: { Authorization: 'Bearer ' + session } }
            )
            setStores(response.data.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message)
            }
        } finally {
            setLoadWorkplaceLoading(false)
        }
    }

    const loadStores: StoreContextProps['loadStores'] = async (param) => {
        try {
            setLoadStoresLoading(true)
            const response = await api.get('/profiles/' + user?.id + '/stores', {
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            setStores(response.data.data)
            if (param?.onSuccess) {
                param.onSuccess(response.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.status);
                    if (param?.onFailed) {
                        param.onFailed(error.response.data)
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            } else {
                console.log(error)
            }
        } finally {
            setLoadStoresLoading(false)
        }
    }

    const createStore: StoreContextProps['createStore'] = async (param) => {
        try {
            setCreateStoreLoading(true)
            const response = await api.post(
                '/stores',
                param?.data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + session
                    }
                }
            )
            if (param?.onSuccess) {
                param.onSuccess(response.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.status);
                    if (param?.onFailed) {
                        param?.onFailed(error.response.data)
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            } else {
                console.log(error)
            }
        } finally {
            setCreateStoreLoading(false)
        }
    }

    const updateStore: StoreContextProps['updateStore'] = async (param) => {
        if (!param) {
            return
        }

        try {
            setUpdateStoreLoading(true)
            const response = await api.put(
                '/stores/' + param.storeId,
                param?.data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + session
                    }
                })
            if (param?.onSuccess) {
                param.onSuccess(response.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (param?.onFailed) {
                        console.log(error.response.status)
                        param.onFailed(error.response.data)
                    }
                } else if (error.request) {
                    console.log(error.request)
                } else {
                    console.log('Error', error.message)
                }
            } else {
                console.log(error)
            }
        } finally {
            setUpdateStoreLoading(false)
        }
    }

    const deleteStore: StoreContextProps['deleteStore'] = async (param) => {
        if (!param) {
            return
        }

        try {
            setDeleteStoreLoading(true)
            const response = await api.delete(
                '/stores/' + param.storeId,
                {
                    headers: {
                        'Authorization': 'Bearer ' + session
                    }
                })
            if (param.onSuccess) {
                param.onSuccess(response)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.status)
                    if (param.onFailed) {
                        param.onFailed(error.response.data)
                    }
                } else if (error.request) {
                    console.log(error.request)
                } else {
                    console.log('Error', error.message)
                }
            }
        } finally {
            setDeleteStoreLoading(false)
        }
    }

    return (
        <StoreContext.Provider value={{
            createStore,
            createStoreLoading,
            errors,
            deleteStore,
            deleteStoreLoading,
            loadStores,
            loadStoresLoading,
            selectedStore,
            setErrors,
            setSelectedStore,
            stores,
            updateStore,
            updateStoreLoading,
            loadWorkplace,
            loadWorkplaceLoading
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export interface StoreData {
    name: string
    phone: string
    email: string
    address: string
}

export interface StoreProps extends StoreData {
    id: number
}

interface StoreContextProps {
    createStore: (param?: {
        data: StoreData
        onSuccess?: (responseData: AxiosResponse) => void
        onFailed?: (errorData: any) => void
    }) => Promise<void>
    createStoreLoading: boolean
    deleteStore: (param?: {
        storeId: number
        onSuccess?: (responseData: AxiosResponse) => void
        onFailed?: (errorData: any) => void
    }) => Promise<void>
    deleteStoreLoading: boolean
    errors: {
        createStore: string
        deleteStore: string
        loadStore: string
        updateStore: string
    }
    loadStores: (param?: {
        onSuccess?: (responseData: AxiosResponse) => void
        onFailed?: (errorData: any) => void
    }) => Promise<void>
    loadStoresLoading: boolean
    selectedStore: StoreProps | null
    setErrors: React.Dispatch<React.SetStateAction<{
        createStore: string
        deleteStore: string
        loadStore: string
        updateStore: string
    }>>
    setSelectedStore: React.Dispatch<React.SetStateAction<StoreProps | null>>
    stores: StoreProps[]
    updateStore: (param?: {
        storeId: number
        data: StoreData
        onSuccess?: (responseData: AxiosResponse) => void
        onFailed?: (errorData: any) => void
    }) => Promise<void>
    updateStoreLoading: boolean
    loadWorkplace: () => void
    loadWorkplaceLoading: boolean
}
