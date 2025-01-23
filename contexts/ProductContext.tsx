import { View, Text } from 'react-native'
import React from 'react'

const ProductContext = React.createContext<ProductContextProps>({
    products: [],
    loading: false,
    error: null
})

export const useProduct = () => {
    const context = React.useContext(ProductContext)
    if (!context) {
        throw new Error('The useProduct() hook should be called within a <ProductProvider/>')
    }
    return context
}

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {

    const [error, setError] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [products, setProducts] = React.useState<ProductProps[]>([])

    return (
        <ProductContext.Provider value={{ products, loading, error }}>
            {children}
        </ProductContext.Provider>
    )
}

interface ProductContextProps {
    products: ProductProps[]
    loading: boolean
    error: string | null
}

interface ProductProps {
    id: number
    name: string
    availableModifiers: ProductModifierCategoryProps & { values: ProductModifierProps[] }[]
    availableOptions: ProductOptionCategoryProps & { values: ProductOptionProps[] }[]
    availableVariants: ProductVariantProps[]
}

interface ProductModifierProps {
    id: number
    name: string
    status: 'Active' | 'Inactive'
}

interface ProductModifierCategoryProps {
    id: number
    name: string
    status: 'Active' | 'Inactive'
}

interface ProductOptionProps {
    id: number
    name: string
    status: 'Active' | 'Inactive'
}

interface ProductOptionCategoryProps {
    id: number
    name: string
    status: 'Active' | 'Inactive'
}

interface ProductVariantProps {
    id: number
    price: number
    stock: number
    sku: string
    status: 'Active' | 'Inactive'
    productOptions: ProductOptionProps[]
}