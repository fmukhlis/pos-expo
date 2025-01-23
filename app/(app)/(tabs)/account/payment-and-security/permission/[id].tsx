import { View, Text, Switch, ActivityIndicator } from 'react-native'
import React from 'react'
import PrimaryInput from '@/components/PrimaryInput'
import { PrimaryButton } from '@/components/PrimaryButton'
import { DangerButton } from '@/components/DangerButton'
import usePermissionAPI from '@/components/Permission/usePermissionAPI'
import { router, useLocalSearchParams } from 'expo-router'
import { usePermission } from '@/contexts/PermissionContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { Colors } from '@/constants/Colors';

const Edit = () => {

    const { colorScheme } = useTheme()

    const { setPermissions } = usePermission()

    const { deletePermission, getPermission, getPermissions, updatePermission } = usePermissionAPI()

    const { id: permissionId }: { id: string } = useLocalSearchParams()

    const [getPermissionLoading, setGetPermissionLoading] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const [data, setData] = React.useState({
        authorizationCode: '',
        refund: true,
        modifyBill: true,
    })

    const changeAuthorizationCode = (authorizationCode: string) => {
        setData((prev) => {
            return {
                ...prev,
                authorizationCode
            }
        })
    }

    const changeRefund = (refund: boolean) => {
        setData((prev) => {
            return {
                ...prev,
                refund
            }
        })
    }

    const changeModifyBill = (modifyBill: boolean) => {
        setData((prev) => {
            return {
                ...prev,
                modifyBill
            }
        })
    }

    const save = () => {
        updatePermission({
            permissionId: parseInt(permissionId),
            data,
            onStart: () => {
                setIsSaving(true)
            },
            onSuccess: () => {
                getPermissions({
                    onSuccess: (permissions) => {
                        setPermissions(permissions)
                    },
                    onFinish: () => {
                        setIsSaving(false)
                        if (router.canGoBack()) {
                            router.back()
                        }
                    }
                })
            },
            onFailed: (errMsg) => {
                setIsSaving(false)
                console.log(errMsg)
            }
        })
    }

    const performDelete = () => {
        deletePermission({
            permissionId: parseInt(permissionId),
            onStart: () => {
                setIsDeleting(true)
            },
            onSuccess: () => {
                getPermissions({
                    onSuccess: (permissions) => {
                        setPermissions(permissions)
                    },
                    onFinish: () => {
                        setIsDeleting(false)
                        if (router.canGoBack()) {
                            router.back()
                        }
                    }
                })
            },
            onFailed: (errMsg) => {
                setIsDeleting(false)
                console.log(errMsg)
            }
        })
    }

    React.useEffect(() => {
        getPermission({
            permissionId: parseInt(permissionId),
            onStart: () => {
                setGetPermissionLoading(true)
            },
            onSuccess: ({ authorizationCode, modifyBill, refund }) => {
                setGetPermissionLoading(false)
                setData({
                    authorizationCode,
                    modifyBill: !!modifyBill,
                    refund: !!refund
                })
            },
            onFailed: () => {
                router.back()
            }
        })
    }, [])

    if (getPermissionLoading) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator
                    size={'large'}
                    color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
                />
            </View>
        )
    }

    return (
        <View className='flex-1 px-4 pt-4 bg-white'>
            <Text className='text-lg font-bold mb-2'>Edit Permission</Text>
            <Text className='my-3 text-base font-medium'>Set Authorization Code</Text>
            <PrimaryInput
                keyboardType='number-pad'
                className='h-[40]'
                containerClassName='mb-5'
                type='password'
                placeholder='Enter a 6-digit pin'
                value={data.authorizationCode}
                onChangeText={changeAuthorizationCode}
            />
            <Text className='text-base font-medium mb-3'>Permission Abilities</Text>
            <View className='flex-row justify-between items-center border-t border-gray-300 py-3 px-2'>
                <View className='w-9/12'>
                    <Text className='font-medium text-sm mb-0.5'>Can Modify Bill</Text>
                    <Text className='text-gray-500 text-sm'>The pin can be used for modifying bills.</Text>
                </View>
                <Switch
                    onValueChange={changeModifyBill}
                    value={data.modifyBill}
                />
            </View>
            <View className='flex-row justify-between items-center border-y border-gray-300 py-3 px-2'>
                <View className='w-9/12'>
                    <Text className='font-medium text-sm mb-0.5'>Can Refund Payment</Text>
                    <Text className='text-gray-500 text-sm'>The pin can be used for refunding payments.</Text>
                </View>
                <Switch
                    onValueChange={changeRefund}
                    value={data.refund}
                />
            </View>
            <View
                className='flex-row py-8'
            >
                <DangerButton
                    isProcessing={isDeleting}
                    disabled={isSaving}
                    onPress={performDelete}
                    className='px-4'
                >
                    Delete
                </DangerButton>
                <PrimaryButton
                    isProcessing={isSaving}
                    disabled={isSaving}
                    onPress={save}
                    className='ml-auto px-14 h-[40]'
                >
                    Save
                </PrimaryButton>
            </View>
        </View>
    )
}

export default Edit