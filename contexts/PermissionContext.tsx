import React from 'react'

const PermissionContext = React.createContext<PermissionContextProps>({
    permissions: [],
    setPermissions: () => { },
})

export const usePermission = () => {
    const context = React.useContext(PermissionContext)
    if (!context) {
        throw new Error('The usePermission() hook should be called within a <PermissionProvider/>')
    }
    return context
}

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {

    const [permissions, setPermissions] = React.useState<PermissionProps[]>([])

    return (
        <PermissionContext.Provider value={{
            permissions,
            setPermissions,
        }}>
            {children}
        </PermissionContext.Provider>
    )
}

export interface PermissionData {
    authorizationCode: string
    refund: boolean
    modifyBill: boolean
}

export interface PermissionProps extends Pick<PermissionData, 'authorizationCode'> {
    id: number
    refund: 1 | 0
    modifyBill: 1 | 0
}

interface PermissionContextProps {
    permissions: PermissionProps[]
    setPermissions: React.Dispatch<React.SetStateAction<PermissionProps[]>>

}