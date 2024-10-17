import { View, Text, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import useResetPassword from '@/hooks/useResetPassword'

import PrimaryInput from '@/components/PrimaryInput'
import { PrimaryButtonLG } from '@/components/PrimaryButton'
import { SecondaryButtonLG } from '@/components/SecondaryButton'
import OverlapLoading from '@/components/OverlapLoading'
import TransparentScreen from '@/components/TransparentScreen'

const ResetPassword = () => {

  const {
    Colors,
    colorScheme,
    form,
    handleCancelPress,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleSendToken,
    handleSubmit,
    handleTokenChange,
    resetPasswordLoading,
    sendResetPasswordLoading,
  } = useResetPassword()

  return (
    <SafeAreaView className='h-full'>
      <View
        className={`relative justify-center bg-light-primaryBackground dark:bg-dark-primaryBackground flex-1`}
      >
        <View className='w-full justify-center items-center p-5'>
          <Image
            tintColor={colorScheme === 'dark' ? Colors.dark.accent : Colors.light.accent}
            source={require('@/assets/images/logo-small.png')}
            className='w-[150px] h-[100px]'
            resizeMode='contain'
          />
          <Text
            className={`text-light-primaryText dark:text-dark-primaryText text-xl font-bold mt-3 mb-5`}
          >
            Reset Password
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
                <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Token</Text>
                <View className='flex-row space-x-2 mt-2'>
                  <PrimaryInput
                    autoCapitalize='none'
                    value={form.token}
                    onChangeText={handleTokenChange}
                    containerClassName='h-11 flex-1'
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={resetPasswordLoading}
                    onPress={handleSendToken}
                    className='w-[100px] rounded justify-center border-2 border-light-secondaryText/30 dark: dark:border-dark-secondaryText/30'
                  >

                    {resetPasswordLoading
                      ? <ActivityIndicator size={25} color="#9B9B9B" />
                      : (false)
                        ? (
                          <Text className='text-center text-[15px] font-bold text-light-secondaryText'>{'retryAfter'}</Text>)
                        : (
                          <Text className='text-center text-[15px] font-bold text-light-secondaryText'>Send Token</Text>
                        )}
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>New Password</Text>
                <PrimaryInput
                  autoCapitalize='none'
                  value={form.password}
                  onChangeText={handlePasswordChange}
                  containerClassName='mt-2 h-11'
                  type='password'
                />
              </View>
              <View>
                <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Confirm New Password</Text>
                <PrimaryInput
                  autoCapitalize='none'
                  value={form.passwordConfirmation}
                  onChangeText={handlePasswordConfirmationChange}
                  containerClassName='mt-2 h-11'
                  type='password'
                />
              </View>
            </View>
            <View className='flex-row w-full justify-between'>
              <SecondaryButtonLG
                className='w-28 mt-5 h-12'
                onPress={handleCancelPress}
              >
                Cancel
              </SecondaryButtonLG>
              <PrimaryButtonLG
                className='w-44 mt-5 h-12'
                isProcessing={resetPasswordLoading}
                onPress={handleSubmit}
              >
                Reset Password
              </PrimaryButtonLG>
            </View>
          </KeyboardAvoidingView>
        </View>
        {(resetPasswordLoading || sendResetPasswordLoading) && <TransparentScreen />}
      </View >
    </SafeAreaView >

  )
}

export default ResetPassword