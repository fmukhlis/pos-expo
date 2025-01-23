import { View, Text } from 'react-native'
import React from 'react'
import usePaymentMethodAPI from '@/components/PaymentMethod/usePaymentMethod'

const PaymentMethodContext = React.createContext<PaymentMethodContextProps>({
    paymentMethods: [],
    setPaymentMethods: () => { },
    selectedPaymentMethodIndex: null,
    setSelectedPaymentMethodIndex: () => { }
})

export const usePaymentMethod = () => {
    const context = React.useContext(PaymentMethodContext)
    if (!context) {
        throw new Error('The usePaymentMethod() hook should be called within a <PaymentMethodProvider/>')
    }
    return context
}

export const PaymentMethodProvider = ({ children }: { children: React.ReactNode }) => {

    const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethodProps[]>([])
    const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = React.useState<number | null>(null)

    return (
        <PaymentMethodContext.Provider value={{
            paymentMethods,
            selectedPaymentMethodIndex,
            setPaymentMethods,
            setSelectedPaymentMethodIndex,
        }}>
            {children}
        </PaymentMethodContext.Provider>
    )
}

export interface PaymentMethodProps extends PaymentMethodData {
    id: number
}

export interface PaymentMethodData {
    name: string
    destination: string
}

interface PaymentMethodContextProps {
    paymentMethods: PaymentMethodProps[]
    setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethodProps[]>>
    selectedPaymentMethodIndex: number | null
    setSelectedPaymentMethodIndex: React.Dispatch<React.SetStateAction<number | null>>
}