import { View, Text, Image, KeyboardAvoidingView, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { Colors } from '@/constants/Colors'
import useSignUp from '@/hooks/useSignUp'

import TransparentScreen from '@/components/TransparentScreen'
import { PrimaryButtonLG } from '@/components/PrimaryButton'
import PrimaryInput from '@/components/PrimaryInput'

const SignUp = () => {

    const {
        colorScheme,
        form,
        handleEmailChange,
        handleFullNameChange,
        handlePasswordChange,
        handlePasswordConfirmationChange,
        handleSubmit,
        signUpLoading,
    } = useSignUp()

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
                        Sign Up
                    </Text>
                    <KeyboardAvoidingView className='w-full'>
                        <View className='space-y-3 w-full'>
                            <View>
                                <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Full Name</Text>
                                <PrimaryInput
                                    autoCapitalize='words'
                                    value={form.fullName}
                                    onChangeText={handleFullNameChange}
                                    containerClassName='mt-2 h-11'
                                />
                            </View>
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
                            <View>
                                <Text className='text-[15px] text-light-primaryText dark:text-dark-primaryText font-medium'>Confirm Password</Text>
                                <PrimaryInput
                                    autoCapitalize='none'
                                    value={form.passwordConfirmation}
                                    onChangeText={handlePasswordConfirmationChange}
                                    containerClassName='mt-2 h-11'
                                    type='password'
                                />
                            </View>
                        </View>
                        <PrimaryButtonLG
                            className='w-full mt-5 h-12'
                            isProcessing={signUpLoading}
                            onPress={handleSubmit}
                        >
                            Register
                        </PrimaryButtonLG>
                    </KeyboardAvoidingView>
                    <View className="flex justify-center pt-4 flex-row gap-2">
                        <Text className="text-light-secondaryText dark:text-dark-secondaryText">
                            Already have an account?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="font-semibold text-light-accent dark:text-dark-accent"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
                {signUpLoading && <TransparentScreen />}
            </View>
        </SafeAreaView>
    )
}

export default SignUp