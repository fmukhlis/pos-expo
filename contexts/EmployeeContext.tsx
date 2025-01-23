import { View, Text } from 'react-native'
import React from 'react'

const EmployeeContext = React.createContext<EmployeeContextProps>({
    employees: [],
    setEmployees: () => { },
    employeeInvitations: [],
    setEmployeeInvitations: () => { },
})

export const useEmployee = () => {
    const context = React.useContext(EmployeeContext)
    if (!context) {
        throw new Error('The useEmployee() hook should be called within a <EmployeeProvider/>')
    }
    return context
}

export const EmployeeProvider = ({ children }: { children: React.ReactNode }) => {

    const [employees, setEmployees] = React.useState<EmployeeProps[]>([])
    const [employeeInvitations, setEmployeeInvitations] = React.useState<EmployeeInvitationProps[]>([])

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees, employeeInvitations, setEmployeeInvitations }}>
            {children}
        </EmployeeContext.Provider >
    )
}

export interface EmployeeProps {
    id: number;
    status: "Active" | "Inactive";
    userName: string;
    storeName: string;
}

export interface EmployeeInvitationProps extends Omit<EmployeeProps, 'status'> {
    status: 'Pending' | 'Accepted' | 'Declined'
    invitedAt: string;
}

interface EmployeeContextProps {
    employees: EmployeeProps[]
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeProps[]>>
    employeeInvitations: EmployeeInvitationProps[]
    setEmployeeInvitations: React.Dispatch<React.SetStateAction<EmployeeInvitationProps[]>>
}

// getUserByEmail({
//     onStart: () => {
//         setGetUserByEmailLoading(true)
//     },
//     data: {
//         email
//     },
//     onSuccess: (user) => {
//         setEmail('')
//         setUsers((prev) => ([
//             ...prev,
//             user
//         ]))
//     },
//     onFinish: () => {
//         setGetUserByEmailLoading(false)
//     },
// })