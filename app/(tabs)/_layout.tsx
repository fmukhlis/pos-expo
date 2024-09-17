import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
