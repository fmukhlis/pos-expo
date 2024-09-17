import { View, Text, ScrollView, Image, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'

import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'

const App = () => {

    const colorScheme = useColorScheme()

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View
                    className={`${colorScheme === 'dark' ? 'bg-dark-primaryBackground' : 'bg-light-primaryBackground'} justify-center items-center px-5 h-full`}
                >
                    <Image
                        tintColor={colorScheme === 'dark' ? Colors.dark.primaryText : Colors.light.primaryText}
                        source={require('../assets/images/logo.png')}
                        className='w-[200px] h-[60px]'
                        resizeMode='contain'
                    />
                    <Image
                        source={require('../assets/images/cards.png')}
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

                    <Link href={'/(auth)/sign-in'} asChild>
                        <CustomButton
                            classNames={`${colorScheme === 'dark' ? 'bg-blue-300' : 'bg-blue-500'} w-full mt-7`}
                        >
                            <Text
                                className={`${colorScheme === 'dark' ? 'text-dark-primaryBackground' : 'text-light-primaryBackground'} font-bold text-lg`}
                            >
                                Get Started
                            </Text>
                        </CustomButton>
                    </Link>
                </View>
            </ScrollView>
            <StatusBar
                backgroundColor={colorScheme === 'dark' ? Colors.dark.primaryBackground : Colors.light.primaryBackground}
            />
        </SafeAreaView>
    )
}

export default App