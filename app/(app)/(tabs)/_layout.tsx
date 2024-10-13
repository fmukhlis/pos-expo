import { Text } from 'react-native';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${focused ? 'font-bold text-light-tabIconSelected' : 'text-light-tabIconDefault'} text-xs`}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              name={focused ? 'home-sharp' : 'home-outline'}
              className={`${focused ? 'text-light-tabIconSelected' : ' text-light-tabIconDefault'}`}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
