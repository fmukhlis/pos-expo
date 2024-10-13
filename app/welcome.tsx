import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, Stack } from 'expo-router'

import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'
import { useTheme } from '@/contexts/ThemeProvider'

const Welcome = () => {

    const { colorScheme } = useTheme()

    return (
        <SafeAreaView>
            <View
                className={`${colorScheme === 'dark' ? 'bg-dark-primaryBackground' : 'bg-light-primaryBackground'} justify-center items-center px-5 h-full`}
            >
                <Image
                    tintColor={colorScheme === 'dark' ? Colors.dark.accent : Colors.light.accent}
                    source={require('@/assets/images/logo.png')}
                    className='w-[200px] h-[60px]'
                    resizeMode='contain'
                />
                <Image
                    source={require('@/assets/images/cards.png')}
                    className='w-[300px] h-[240px] mt-7'
                    resizeMode='contain'
                />
                <Text
                    className={`${colorScheme === 'dark' ? 'text-dark-primaryText' : 'text-light-primaryText'} text-2xl font-bold text-center mt-7`}
                >
                    Effortless Sales, Simplified
                </Text>

                <Text
                    className={`${colorScheme === 'dark' ? 'text-dark-secondaryText' : 'text-light-secondaryText'} text-center mt-3`}
                >
                    Manage transactions, track inventory, and generate detailed reports with ease
                </Text>

                <Link href={'/sign-in'} asChild>
                    <CustomButton
                        className={`w-full mt-7 h-12`}
                    >
                        <Text
                            className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-lg`}
                        >
                            Get Started
                        </Text>
                    </CustomButton>
                </Link>
            </View>
        </SafeAreaView>
    )
}

export default Welcome