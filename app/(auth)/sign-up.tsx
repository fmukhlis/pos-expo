import { View, Text, ScrollView, useColorScheme, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import * as Device from 'expo-device'

import { Colors } from '@/constants/Colors'
import PrimaryInput from '@/components/PrimaryInput'
import CustomButton from '@/components/CustomButton'

const SignUp = () => {

    const colorScheme = useColorScheme()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        email: '',
        full_name: '',
        password: '',
        password_confirmation: '',
        device_name: Device.deviceName
    })

    const handleFullNameChange = (full_name: string) => {
        setForm((prev) => ({
            ...prev,
            full_name,
        }))
    }

    const handleEmailChange = (email: string) => {
        setForm((prev) => ({
            ...prev,
            email
        }))
    }

    const handlePasswordChange = (password: string) => {
        setForm((prev) => ({
            ...prev,
            password,
        }))
    }

    const handlePasswordConfirmationChange = (password_confirmation: string) => {
        setForm((prev) => ({
            ...prev,
            password_confirmation,
        }))
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)

            const response = await fetch('http://192.168.107.52:8000/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form)
            })

            if (!response.ok) {
                const errors = await response.json()
                throw new Error('Registration failed')
            }

            const data = await response.json()
            alert(data.message)
        } catch (error) {
            console.error('Registration error: ', error)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View
                    className={`bg-light-primaryBackground dark:bg-dark-primaryBackground justify-center items-center px-5 h-full`}
                >
                    <Image
                        tintColor={colorScheme === 'dark' ? Colors.dark.accent : Colors.light.accent}
                        source={require('@/assets/images/logo-small.png')}
                        className='w-[150px] h-[100px]'
                        resizeMode='contain'
                    />
                    <Text
                        className={`text-light-primaryText dark:text-dark-primaryText text-xl font-bold mt-3 mb-5`}
                    >
                        Sign Up
                    </Text>
                    <View className='space-y-3 w-full'>
                        <View>
                            <Text className='text-light-primaryText dark:text-dark-primaryText font-medium'>Full Name</Text>
                            <PrimaryInput
                                value={form.full_name}
                                onChangeText={handleFullNameChange}
                                containerClassName='mt-2 h-11'
                            />
                        </View>
                        <View>
                            <Text className='text-light-primaryText dark:text-dark-primaryText font-medium'>Email</Text>
                            <PrimaryInput
                                value={form.email}
                                onChangeText={handleEmailChange}
                                containerClassName='mt-2 h-11'
                            />
                        </View>
                        <View>
                            <Text className='text-light-primaryText dark:text-dark-primaryText font-medium'>Password</Text>
                            <PrimaryInput
                                value={form.password}
                                onChangeText={handlePasswordChange}
                                containerClassName='mt-2 h-11'
                                type='password'
                            />
                        </View>
                        <View>
                            <Text className='text-light-primaryText dark:text-dark-primaryText font-medium'>Confirm Password</Text>
                            <PrimaryInput
                                value={form.password_confirmation}
                                onChangeText={handlePasswordConfirmationChange}
                                containerClassName='mt-2 h-11'
                                type='password'
                            />
                        </View>
                    </View>
                    <CustomButton
                        className='w-full mt-5 h-12'
                        disabled={isSubmitting}
                        onPress={handleSubmit}
                    >
                        <Text
                            className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-base`}
                        >
                            Register
                        </Text>
                    </CustomButton>
                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-light-secondaryText dark:text-dark-secondaryText">
                            Already have an account?
                        </Text>
                        <Link
                            href="/(auth)"
                            className="font-semibold text-light-accent dark:text-dark-accent"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp