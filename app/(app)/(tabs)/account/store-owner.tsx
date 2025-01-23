import React from 'react'

import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { router, useNavigation } from 'expo-router'

import { Icon } from '@/components/Icon'
import { Colors } from '@/constants/Colors'
import { useTheme } from '@/contexts/ThemeProvider'
import { useStore } from '@/contexts/StoreContext'
import { useSession } from '@/contexts/SessionContext'
import { DangerButtonLG } from '@/components/DangerButton'
import StoreModal from '@/components/StoreManagement/StoreModal'

export default function HomeScreen() {

    const { user, session, signOut } = useSession()
    const { colorScheme } = useTheme()
    const [storeModalVisible, setStoreModalVisible] = React.useState(false)
    const [storeModalMode, setStoreModalMode] = React.useState<'create' | 'edit'>('create')

    const {
        loadStores,
        loadStoresLoading,
        selectedStore,
        setSelectedStore,
        stores,
    } = useStore()

    const {
        bottom: paddingBottom,
    } = useSafeAreaInsets()

    React.useEffect(() => {
        loadStores()
    }, [])

    React.useEffect(() => {
        if (stores.length) {
            setSelectedStore(stores[0])
        } else {
            setSelectedStore(null)
        }
    }, [stores])

    return (
        <View
            style={{
                paddingBottom,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 45
            }}
            className='flex-1 bg-white'
        >
            <StoreModal
                mode={storeModalMode}
                store={selectedStore}
                visible={storeModalVisible}
                onVisibleChange={(visible) => { setStoreModalVisible(visible) }}
            />
            <View className='border-red-300'>
                <Text className='text-3xl font-black'>
                    Welcome Back
                </Text>
                <Text className='mt-2 text-base'>
                    {user?.fullName}!
                </Text>
            </View>
            <View className='mt-4 bg-gray-200/75 rounded p-1'>
                <View className='mb-1 px-2 h-[40] rounded bg-gray-50 flex-row items-center justify-between'>
                    <Text className='text-gray-500 text-base font-semibold'>
                        Store
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setStoreModalMode('create')
                            setStoreModalVisible(true)
                        }}
                    >
                        <Icon name='add-circle' size={25} />
                    </TouchableOpacity>
                </View>
                {
                    loadStoresLoading
                        ?
                        <View className='h-[41] justify-center items-center'>
                            <ActivityIndicator
                                size='small'
                                color={colorScheme === 'dark' ? Colors.dark.highlightedText : Colors.light.highlightedText}
                            />
                        </View>
                        :
                        <ScrollView className='max-h-[135] space-y-1'>
                            {stores.length
                                ?
                                stores.map((store) => (
                                    <View key={store.id} className='flex-row space-x-2 items-center rounded border border-transparent p-1'>
                                        <Icon name='storefront-outline' className='text-gray-400' />
                                        <View className='flex-1 flex-row items-center justify-between'>
                                            <Text className='text-gray-400'>
                                                {store.name}
                                            </Text>
                                            <TouchableOpacity
                                                className='w-[55] h-[30] justify-center items-center'
                                                disabled={store.id === selectedStore?.id}
                                                activeOpacity={0.5}
                                                onPress={() => {
                                                    setSelectedStore(store)
                                                }}
                                            >
                                                {store.id === selectedStore?.id
                                                    ?
                                                    <Icon
                                                        size={25}
                                                        name='checkmark-outline'
                                                        className='text-emerald-500'
                                                    />
                                                    :
                                                    <Text
                                                        className='text-sky-500'
                                                    >
                                                        [ Select ]
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                                :
                                <View className='items-center justify-center rounded border border-transparent p-1'>
                                    <Text className='text-gray-400 mb-0.5'>
                                        You don't have any store.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStoreModalMode('create')
                                            setStoreModalVisible(true)
                                        }}
                                    >
                                        <Text className='text-sky-500 font-bold'>
                                            Create a new one
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ScrollView>
                }
            </View>
            <View className='mt-4 border-t border-gray-300'>
                <TouchableHighlight
                    disabled={!selectedStore}
                    className={`p-3 ${!selectedStore ? 'opacity-40' : ''}`}
                    onPress={() => {
                        setStoreModalMode('edit')
                        setStoreModalVisible(true)
                    }}
                    underlayColor={'#e5e7eb'}
                >
                    <View className='flex-row space-x-2 items-center'>
                        <Icon name='create-outline' />
                        <Text className='font-bold text-lg'>
                            Edit Store Info
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View className='border-t border-gray-300'>
                <TouchableHighlight
                    disabled={!selectedStore}
                    className={`p-3 ${!selectedStore ? 'opacity-40' : ''}`}
                    onPress={() => { router.navigate('/account/payment-and-security') }}
                    underlayColor={'#e5e7eb'}
                >
                    <View className='flex-row space-x-2 items-center'>
                        <Icon name='key-outline' />
                        <Text className='font-bold text-lg'>
                            Payment & Security
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View className='border-t border-gray-300'>
                <TouchableHighlight
                    disabled={!selectedStore}
                    className={`p-3 ${!selectedStore ? 'opacity-40' : ''}`}
                    onPress={() => { router.navigate('/account/store-management') }}
                    underlayColor={'#e5e7eb'}
                >
                    <View className='flex-row space-x-2 items-center'>
                        <Icon name='documents-outline' />
                        <Text className='font-bold text-lg'>
                            Store Management
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View className='border-t border-gray-300'>
                <TouchableHighlight
                    className={`p-3`}
                    onPress={() => { }}
                    underlayColor={'#e5e7eb'}
                >
                    <View className='flex-row space-x-2 items-center'>
                        <Icon name='settings-outline' />
                        <Text className='font-bold text-lg'>
                            Account Settings
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View className='flex-1 border-t py-3 border-gray-300'>
                <DangerButtonLG
                    onPress={() => {
                        signOut(session ?? '')
                            .then((isLogoutSuccess) => {
                                if (isLogoutSuccess) {
                                    router.replace('/')
                                }
                            })
                    }}
                    className='h-[45]'
                >
                    Log out
                </DangerButtonLG>
                <View className='flex-1 items-center justify-center'>
                    <Text className='font-bold text-base mb-1 text-gray-500'>
                        Moncip
                    </Text>
                    <Text className='text-gray-400'>
                        Version 1.0
                    </Text>
                </View>
            </View>
            {/* <Link href={'/bookmark'} className='text-blue-600'>Profile</Link> */}
            {/* <PrimaryButton
        isProcessing={signOutLoading}
        onPress={() => {
        }}
      >
        Logout
      </PrimaryButton> */}
            <StatusBar style='auto' />
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
