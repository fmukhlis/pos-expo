import { View, Text, Image, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { Colors } from '@/constants/Colors'
import PrimaryInput from '@/components/PrimaryInput'
import useSignIn from '@/hooks/useSignIn'
import { PrimaryButtonLG } from '@/components/PrimaryButton'

const SignIn = () => {

  const {
    colorScheme,
    form,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    sessionLoading,
  } = useSignIn()

  return (
    <SafeAreaView>
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
        <KeyboardAvoidingView className='w-full'>
          <View className='space-y-3 w-full'>
            <View>
              <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Email</Text>
              <PrimaryInput
                autoCapitalize='none'
                value={form.email}
                onChangeText={handleEmailChange}
                containerClassName='mt-2 h-11'
              />
            </View>
            <View>
              <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Password</Text>
              <PrimaryInput
                autoCapitalize='none'
                value={form.password}
                onChangeText={handlePasswordChange}
                containerClassName='mt-2 h-11'
                type='password'
              />
            </View>
          </View>
          <PrimaryButtonLG
            className='w-full mt-5 h-12 flex-row'
            isProcessing={sessionLoading}
            onPress={handleSubmit}
          >
            Log In
          </PrimaryButtonLG>
        </KeyboardAvoidingView>
        <View className="flex justify-center pt-4 flex-row gap-2">
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
    </SafeAreaView>
  )
}

export default SignIn