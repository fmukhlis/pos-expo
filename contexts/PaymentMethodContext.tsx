import React from 'react'

const PaymentMethodContext = React.createContext<PaymentMethodContextProps>({
    selectedPaymentMethodId: null,
    setSelectedPaymentMethodId: () => { }
})

export const usePaymentMethod = () => {
    const context = React.useContext(PaymentMethodContext)
    if (!context) {
        throw new Error('The usePaymentMethod() hook should be called within a <PaymentMethodProvider/>')
    }
    return context
}

export const PaymentMethodProvider = ({ children }: { children: React.ReactNode }) => {

    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<number | null>(null)

    return (
        <PaymentMethodContext.Provider value={{
            selectedPaymentMethodId,
            setSelectedPaymentMethodId,
        }}>
            {children}
        </PaymentMethodContext.Provider>
    )
}

interface PaymentMethodContextProps {
    selectedPaymentMethodId: number | null
    setSelectedPaymentMethodId: React.Dispatch<React.SetStateAction<number | null>>
}