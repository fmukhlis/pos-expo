import React from 'react'

const StoreContext = React.createContext<StoreContextProps>({
    selectedStoreId: null,
    setSelectedStoreId: () => { },
})

export const useStore = () => {
    const context = React.useContext(StoreContext)
    if (!context) {
        throw new Error('The useStore() hook must be wrapped within a <StoreProvider/>')
    }
    return context
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {

    const [selectedStoreId, setSelectedStoreId] = React.useState<number | null>(null)

    return (
        <StoreContext.Provider value={{
            selectedStoreId,
            setSelectedStoreId,
        }}>
            {children}
        </StoreContext.Provider>
    )
}

interface StoreContextProps {
    selectedStoreId: number | null
    setSelectedStoreId: React.Dispatch<React.SetStateAction<number | null>>
}
