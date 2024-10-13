import { Image, StyleSheet, Platform, View, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store'

import { StatusBar } from 'expo-status-bar'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useSession } from '@/contexts/SessionContext';
import HomeSkeleton from '@/components/HomeSkeleton';
import { useTheme } from '@/contexts/ThemeProvider';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {

  const { user, session, signOut } = useSession()
  const { colorScheme } = useTheme()

  if (!user) {
    return (
      // <HomeSkeleton />
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator
          size={'large'}
          color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
        />
      </View>
    )
  }

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-3xl font-black'>CloudMon</Text>
      <Text className=''>{user?.fullName}</Text>
      <CustomButton
        onPress={() => {
          signOut()
            .finally(() => { router.replace('/') })
        }}
        className='w-full mt-7 h-12'
      >
        <Text
          className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-lg`}
        >
          Logout
        </Text>
      </CustomButton>
      <StatusBar style='auto' />
      {/* <Link href={'/bookmark'} className='text-blue-600'>Profile</Link> */}
    </View>
  )
  // <ParallaxScrollView
  //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  //   headerImage={
  //     <Image
  //       source={require('@/assets/images/partial-react-logo.png')}
  //       style={styles.reactLogo}
  //     />
  //   }>
  //   <ThemedView style={styles.titleContainer}>
  //     <ThemedText type="title">Welcome!</ThemedText>
  //     <HelloWave />
  //   </ThemedView>
  //   <ThemedView style={styles.stepContainer}>
  //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
  //     <ThemedText>
  //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
  //       Press{' '}
  //       <ThemedText type="defaultSemiBold">
  //         {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
  //       </ThemedText>{' '}
  //       to open developer tools.
  //     </ThemedText>
  //   </ThemedView>
  //   <ThemedView style={styles.stepContainer}>
  //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
  //     <ThemedText>
  //       Tap the Explore tab to learn more about what's included in this starter app.
  //     </ThemedText>
  //   </ThemedView>
  //   <ThemedView style={styles.stepContainer}>
  //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
  //     <ThemedText>
  //       When you're ready, run{' '}
  //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
  //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
  //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
  //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
  //     </ThemedText>
  //   </ThemedView>
  // </ParallaxScrollView>
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
