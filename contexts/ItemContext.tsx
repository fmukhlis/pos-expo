import api from "@/utils/api";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useSession } from "./SessionContext";

export const ItemContext = createContext<{
    fetchItems: () => void
    isLoading: boolean
    items: ItemProps[]
    error: string
}>({
    fetchItems: () => { },
    isLoading: true,
    items: [],
    error: ''
})

export const ItemProvider = ({ children }: { children: ReactNode }) => {

    const { session } = useSession()
    const [items, setItems] = useState<ItemProps[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchItems = useCallback(() => {
        if (isLoading) return
        setIsLoading(true)
        api.get('/stores/1/products', {
            headers: {
                'Authorization': 'Bearer ' + session
            }
        })
            .then(function (response) {
                setItems(response.data.data)
            })
            .catch(function (error) {
                console.log(error)
                setError('Failed to fetch items')
            })
            .finally(function () {
                setIsLoading(false)
            })
    }, [isLoading])

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <ItemContext.Provider value={{ fetchItems, isLoading, items, error }}>
            {children}
        </ItemContext.Provider>
    )
}

interface ItemProps {
    id: number
    name: string
    availableModifiers: {
        id: number
        name: string
        status: 'Active' | 'Inactive'
        values: {
            id: number
            name: string
            status: 'Active' | 'Inactive'
        }[]
    }[]
    availableOptions: {
        id: number
        name: string
        status: 'Active' | 'Inactive'
        values: {
            id: number
            name: string
            status: 'Active' | 'Inactive'
        }[]
    }[]
    availableVariants: {
        id: number
        price: number
        stock: number
        sku: string
        status: 'Active' | 'Inactive'
        productOptions: {
            id: number
            name: string
            status: 'Active' | 'Inactive'
        }[]
    }[]
}