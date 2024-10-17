import { View, Text, Image, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { Colors } from '@/constants/Colors'
import useSignIn from '@/hooks/useSignIn'

import TransparentScreen from '@/components/TransparentScreen'
import { PrimaryButtonLG } from '@/components/PrimaryButton'
import PrimaryInput from '@/components/PrimaryInput'

const SignIn = () => {

  const {
    colorScheme,
    form,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    signInLoading,
  } = useSignIn()

  return (
    <SafeAreaView className='h-full'>
      <View className='relative flex-1 bg-light-primaryBackground dark:bg-dark-primaryBackground'>
        <View
          className={`justify-center items-center p-5 h-full`}
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
              isProcessing={signInLoading}
              onPress={handleSubmit}
            >
              Log In
            </PrimaryButtonLG>
          </KeyboardAvoidingView>
          <Link
            href="/reset-password"
            className="mt-3 font-semibold text-light-accent dark:text-dark-accent"
          >
            Forgotten password?
          </Link>
          <View className="justify-center pt-3 mt-3.5 w-full flex-row space-x-2 border-t border-light-secondaryText/30 dark:border-dark-secondaryText/30">
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
        {signInLoading && <TransparentScreen />}
      </View>
    </SafeAreaView>
  )
}

export default SignIn