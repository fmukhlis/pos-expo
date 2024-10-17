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
import OverlapLoading from './OverlapLoading'
import TransparentScreen from './TransparentScreen'

const VerifyEmail = () => {

    const { colorScheme } = useTheme()

    const {
        user,
        sendVerificationEmail,
        sendVerificationEmailLoading,
        session,
        signOut,
        signOutLoading,
        verifyEmail,
        verifyEmailLoading,
    } = useSession()

    const [verificationCode, setVerificationCode] = useState('')

    useEffect(() => {
        if (verificationCode.length === 6) {
            handleSubmit()
        }
    }, [verificationCode])

    const handleSubmit = async () => {
        if (session) {
            verifyEmail(session, verificationCode)
                .then((isSuccess) => {
                    if (isSuccess) {
                        router.replace('/')
                    }
                })
        }
    }

    const handleResendEmail = async () => {
        if (session) {
            sendVerificationEmail(session)
        }
    }

    const handleLogout = () => {
        if (session) {
            signOut(session)
                .then((isSuccess) => {
                    if (isSuccess) {
                        router.replace('/')
                    }
                })
        }
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
                            isProcessing={sendVerificationEmailLoading}
                            className='w-36'
                        >
                            Resend Email
                        </PrimaryButton>
                        <SecondaryButton
                            onPress={handleLogout}
                            isProcessing={signOutLoading}
                            className='w-36'
                        >
                            Logout
                        </SecondaryButton>
                    </View>
                </View>

                {(sendVerificationEmailLoading || verifyEmailLoading || signOutLoading)
                    && <TransparentScreen />}
                {verifyEmailLoading
                    && <OverlapLoading colorScheme={colorScheme} />}
            </View>
        </SafeAreaView>
    )
}

export default VerifyEmail