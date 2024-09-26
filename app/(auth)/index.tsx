import { View, Text, ScrollView, useColorScheme, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { Colors } from '@/constants/Colors'
import PrimaryInput from '@/components/PrimaryInput'
import CustomButton from '@/components/CustomButton'

const SignIn = () => {

  const colorScheme = useColorScheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

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

  const handleSubmit = () => {

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
            Sign In
          </Text>
          <View className='space-y-3 w-full'>
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
          </View>
          <CustomButton
            className='w-full mt-5 h-12'
            disabled={isSubmitting}
            onPress={handleSubmit}
          >
            <Text
              className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-base`}
            >
              Log In
            </Text>
          </CustomButton>
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-light-secondaryText dark:text-dark-secondaryText">
              Doesn't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="font-semibold text-light-accent dark:text-dark-accent"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn