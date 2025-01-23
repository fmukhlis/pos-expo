import { View, Text } from 'react-native'
import React, { createContext, useState } from 'react'

const SaleContext = createContext({
    sale: [],
    setSale: () => { }
})

export default function SaleProvider() {

    const [sale, setSale] = useState<{
        itemId: number
        quantity: number
        note: string
    }[]>([])

    return (
        <SaleContext.Provider value={null}>
            <Text>SaleContext</Text>
        </SaleContext.Provider>
    )
}