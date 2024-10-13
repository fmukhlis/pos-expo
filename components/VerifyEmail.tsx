import { useEffect, useState } from 'react'
import { View, Text, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { Colors } from '@/constants/Colors'
import { useTheme } from '@/contexts/ThemeProvider'
import { useSession } from '@/contexts/SessionContext'

import CodeInput from '@/components/CodeInput'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'

const VerifyEmail = () => {

    const { colorScheme } = useTheme()

    const { user, sendEmailVerification, signOut, verifyEmail, userLoading, sessionLoading, } = useSession()

    const [verificationCode, setVerificationCode] = useState('')
    const [resendEmailLoading, setResendEmailLoading] = useState(false)
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)

    useEffect(() => {
        if (verificationCode.length === 6) {
            handleSubmit()
        }
    }, [verificationCode])

    const handleSubmit = async () => {
        setVerifyEmailLoading(true)
        await verifyEmail(verificationCode)
            .then(() => {
                router.replace('/')
            })
            .catch((e) => {
                Alert.alert('Verification Failed', e.message ?? e, [{ text: 'Ok' }])
            })
            .finally(() => {
                setVerifyEmailLoading(false)
            })
    }

    const handleResendEmail = async () => {
        setResendEmailLoading(true)
        await sendEmailVerification()
            .then(() => {
                Alert.alert('Email Sent', `A new verification code has been sent to your email`, [{ text: "Ok" }])
            })
            .catch((e) => {
                Alert.alert('Email Not Sent', e.message ?? e, [{ text: "Ok" }])
            })
            .finally(() => {
                setResendEmailLoading(false)
            })
    }

    const handleLogout = () => {
        signOut()
            .then(() => {
                router.replace('/')
            })
            .catch((e) => { Alert.alert('Logout Error', e.message ?? e, [{ text: 'Ok' }]) })
    }

    return (
        <SafeAreaView className='h-full'>
            <View className='relative flex-1 items-center bg-light-primaryBackground dark:bg-dark-primaryBackground'>
                <View className='w-full items-center p-4'>
                    <Text className='text-lg font-bold mb-2.5'>Verify Your Email</Text>
                    <Text className='text-center'>
                        We have sent a verification code to the email address you provided during registration
                    </Text>
                    <Text className='font-bold'>({user?.email})</Text>
                    <CodeInput value={verificationCode} onChangeText={setVerificationCode} containerClassName='mt-3' />
                    {!verificationCode &&
                        <Text className='text-xs text-light-secondaryText mt-0.5'>Enter verification code</Text>
                    }
                    <View className='w-full items-center border-t border-light-secondaryText/50 dark:border-dark-secondaryText/50 pt-4 mt-4 space-y-3'>
                        <PrimaryButton
                            onPress={handleResendEmail}
                            isProcessing={resendEmailLoading}
                            disabled={sessionLoading || userLoading}
                            className='w-36'
                        >
                            Resend Email
                        </PrimaryButton>
                        <SecondaryButton
                            onPress={handleLogout}
                            isProcessing={sessionLoading || userLoading}
                            disabled={resendEmailLoading}
                            className='w-36'
                        >
                            Logout
                        </SecondaryButton>
                    </View>
                </View>
                {verifyEmailLoading &&
                    <View className='h-full w-full justify-center items-center absolute bg-light-tertiaryBackground/60 dark:bg-dark-tertiaryBackground/60'>
                        <ActivityIndicator size={50} color={colorScheme === 'dark' ? Colors.dark.secondaryText : Colors.light.secondaryText} />
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default VerifyEmail