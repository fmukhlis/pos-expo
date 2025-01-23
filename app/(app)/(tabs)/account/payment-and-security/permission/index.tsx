import { View, Text, RefreshControl, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import usePermissionAPI from '@/components/Permission/usePermissionAPI'
import { usePermission } from '@/contexts/PermissionContext'
import { useStore } from '@/contexts/StoreContext'
import { PrimaryButtonSM } from '@/components/PrimaryButton'
import { Icon } from '@/components/Icon'
import { Link, router } from 'expo-router'

const Permission = () => {

    const { selectedStore } = useStore()

    const { permissions, setPermissions } = usePermission()

    const {
        getPermissions
    } = usePermissionAPI()

    const [getPermissionsLoading, setGetPermissionsLoading] = React.useState(false)

    const loadPermissions = () => {
        getPermissions({
            onStart: () => {
                setGetPermissionsLoading(true)
            },
            onSuccess: (permissions) => {
                setPermissions(permissions)
            },
            onFinish: () => {
                setGetPermissionsLoading(false)
            }
        })
    }
    React.useEffect(() => {
        loadPermissions()
    }, [])

    return (
        <View className='flex-1 bg-white'>
            <FlatList
                data={permissions}
                keyExtractor={(item) => (`${item.id}`)}
                renderItem={({ item }) => {
                    return (
                        <View className='mx-4 border-t border-gray-300'>
                            <TouchableOpacity
                                onPress={() => {
                                    router.navigate({
                                        pathname: '/account/payment-and-security/permission/[id]',
                                        params: {
                                            id: item.id
                                        }
                                    })
                                }}
                                className='flex-row justify-between items-center p-3'
                            >
                                <Text className='text-base'>{item.authorizationCode}</Text>
                                <Icon name='chevron-forward' size={25} className='text-gray-300' />
                            </TouchableOpacity>
                        </View>
                    )
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={getPermissionsLoading}
                        onRefresh={loadPermissions}
                    />
                }
                ListHeaderComponent={() => (
                    <View className='px-4 pt-4'>
                        <Text className='text-lg font-bold mb-2'>Permissions</Text>
                        {permissions.length > 0 &&
                            <Text className='text-base mb-2'>
                                You have added <Text className='font-medium'>{permissions.length}</Text> permissions on <Text className='font-medium'>{selectedStore?.name}</Text>.
                            </Text>
                        }
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className='px-4 mb-2'>
                        <Text className='text-base'>You have never added any permission for <Text className='font-medium'>{selectedStore?.name}</Text>.</Text>

                    </View>
                )}
                ListFooterComponent={() => (
                    <View className='px-4'>
                        <View className='border-t border-gray-300 pt-2'>
                            <TouchableHighlight
                                underlayColor={'#e5e7eb'}
                                className='rounded p-3 border border-gray-300 bg-gray-50'
                                onPress={() => {
                                    router.navigate('/account/payment-and-security/permission/create')
                                }}
                            >
                                <View className='flex-row items-center space-x-1'>
                                    <Icon name='add-outline' className='text-gray-400' size={20} />
                                    <Text className='text-gray-500'>Add permission</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default Permission