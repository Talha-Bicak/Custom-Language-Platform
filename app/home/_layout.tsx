import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Öğren',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Pratik',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile-tab"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/* Gizli ekranlar - Tab bar'da gösterilmeyecek */}
      <Tabs.Screen
        name="saved"
        options={{
          href: null, // Bu ekranı tab bar'da gösterme
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Bu ekranı tab bar'da gösterme
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          href: null, // Bu ekranı tab bar'da gösterme
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // Bu ekranı tab bar'da gösterme
        }}
      />
    </Tabs>
  );
}