import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="saved" 
        options={{
          title: 'Kaydedilen Kelimeler',
          headerShown: true,
          headerBackTitle: 'Geri'
        }}
      />
    </Stack>
  );
}