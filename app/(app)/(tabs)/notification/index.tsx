import { View, Text, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useEmployeeAPI from '@/components/Employee/useEmployeeAPI'
import { useSession } from '@/contexts/SessionContext'
import { EmployeeInvitationProps } from '@/contexts/EmployeeContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PrimaryButtonSM } from '@/components/PrimaryButton'
import { SecondaryButtonSM } from '@/components/SecondaryButton'
import { Icon } from '@/components/Icon'

const Notification = () => {

    const {
        bottom: paddingBottom,
        left: paddingLeft,
        right: paddingRight,
        top: paddingTop,
    } = useSafeAreaInsets()

    const { user } = useSession()

    const {
        acceptEmployeeInvitation,
        declineEmployeeInvitation,
        getIncomingEmployeeInvitations,
    } = useEmployeeAPI()

    const [
        getIncomingEmployeeInvitationsLoading,
        setGetIncomingEmployeeInvitationsLoading
    ] = React.useState(false)

    const [notifications, setNotifications] = React.useState<EmployeeInvitationProps[]>([])

    const [isAccepting, setIsAccepting] = React.useState(false)
    const [isDeclining, setIsDeclining] = React.useState(false)

    const loadIncomingEmployeeInvitations = () => {
        if (!user?.id) {
            return
        }
        getIncomingEmployeeInvitations({
            userId: parseInt(user.id),
            onStart: () => { setGetIncomingEmployeeInvitationsLoading(true) },
            onFinish: () => { setGetIncomingEmployeeInvitationsLoading(false) },
            onSuccess: (employeeInvitations) => {
                setNotifications(employeeInvitations)
            }
        })
    }

    const accept = (employeeInvitationId: number) => {
        if (!user?.id) {
            return
        }
        acceptEmployeeInvitation({
            userId: parseInt(user.id),
            employeeInvitationId,
            onStart: () => { setIsAccepting(true) },
            onFinish: () => { setIsAccepting(false) },
            onSuccess: () => {
                loadIncomingEmployeeInvitations()
            },
        })
    }

    const decline = (employeeInvitationId: number) => {
        if (!user?.id) {
            return
        }
        declineEmployeeInvitation({
            userId: parseInt(user.id),
            employeeInvitationId,
            onStart: () => { setIsDeclining(true) },
            onFinish: () => { setIsDeclining(false) },
            onSuccess: () => {
                loadIncomingEmployeeInvitations()
            },
            onFailed: (err) => { console.log(err) }
        })
    }

    React.useEffect(() => {
        loadIncomingEmployeeInvitations()
        dayjs.extend(relativeTime)
    }, [])

    return (
        <View
            style={{
                paddingBottom,
                paddingLeft,
                paddingRight,
                paddingTop
            }}
            className='flex-1'
        >
            <View className='flex-1 py-1 bg-white'>
                <Text className='px-5 text-2xl font-bold mb-4'>Notifications</Text>
                <FlatList
                    data={notifications}
                    renderItem={({ item }) => {
                        return (
                            <View className='border-t border-gray-200 py-3 px-5'>
                                <View className='flex-row items-center mb-2'>
                                    {item.status === 'Pending'
                                        ?
                                        <>
                                            <Icon name='person-add-outline' size={20} />
                                            <Text className='text-base ml-1'>
                                                You're invited to join <Text className='font-medium'>{item.storeName}</Text>.
                                            </Text>
                                        </>
                                        : item.status === 'Accepted'
                                            ?
                                            <Text className='text-base'>
                                                Great! You are now an employee of <Text className='font-medium'>{item.storeName}</Text>.
                                            </Text>
                                            :
                                            <Text className='text-base'>
                                                You declined the invitation from <Text className='font-medium'>{item.storeName}</Text>.
                                            </Text>
                                    }
                                </View>
                                {item.status === 'Pending' &&
                                    <View className='flex-row space-x-2 justify-between mb-2'>
                                        <SecondaryButtonSM
                                            isProcessing={isDeclining}
                                            disabled={isAccepting}
                                            onPress={() => {
                                                decline(item.id)
                                            }}
                                            className='px-7 py-1'
                                        >
                                            Decline
                                        </SecondaryButtonSM>
                                        <PrimaryButtonSM
                                            isProcessing={isAccepting}
                                            disabled={isDeclining}
                                            onPress={() => {
                                                accept(item.id)
                                            }}
                                            className='flex-1 py-1'
                                        >
                                            Accept
                                        </PrimaryButtonSM>
                                    </View>
                                }
                                <View className='flex-row justify-end items-center space-x-1'>
                                    <Icon name='time-outline' size={15} className='text-gray-500' />
                                    <Text className='text-xs text-gray-500'>{dayjs().to(dayjs(item.invitedAt))}</Text>
                                </View>
                            </View>
                        )
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={getIncomingEmployeeInvitationsLoading}
                            onRefresh={loadIncomingEmployeeInvitations}
                        />
                    }
                    ListEmptyComponent={
                        <View className='px-4'>
                            <View className='p-4 border border-gray-400 rounded items-center'>
                                <Text className='text-lg text-gray-500 font-medium mb-2'>You're all caught up</Text>
                                <Text className='text-sm text-center text-gray-500'>Check back soon for alerts on invitations and more.</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        </View>
    )
}

export default Notification