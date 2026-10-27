import React from 'react'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  DocumentLike,
  Notepad2,
  Home2,
  Discover,
} from 'iconsax-react-native'
import Story from '@/assets/icons/home/story'
import StoryActive from '@/assets/icons/home/story_active'

const ACTIVE = '#477AFF'
const INACTIVE = '#71808D'

const TabIcon = ({
  focused,
  children,
}: {
  focused: boolean
  children: React.ReactNode
}) => (
  <View className="h-14 items-center justify-start">
    <View
      className="w-2 h-2 rounded-full mb-2"
      style={{ backgroundColor: focused ? ACTIVE : 'transparent' }}
    />
    {children}
  </View>
)

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          paddingTop: 20,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          height: 64,
          paddingTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused}>
              <Home2
                size={24}
                color={focused ? ACTIVE : INACTIVE}
                variant={focused ? 'Bold' : 'Outline'}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused}>
              <Discover
                size={24}
                color={focused ? ACTIVE : INACTIVE}
                variant={focused ? 'Bold' : 'Outline'}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused}>
              <DocumentLike
                size={24}
                color={focused ? ACTIVE : INACTIVE}
                variant={focused ? 'Bold' : 'Outline'}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="notepad2"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused}>
              <Notepad2
                size={24}
                color={focused ? ACTIVE : INACTIVE}
                variant={focused ? 'Bold' : 'Outline'}
              />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused}>
              {!focused ? <Story /> : <StoryActive />

              }
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  )
}
