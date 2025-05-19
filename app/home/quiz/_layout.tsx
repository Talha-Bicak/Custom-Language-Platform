import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function QuizLayout() {
  const { quizName, levelName } = useLocalSearchParams<{ quizName: string, levelName: string }>();
  const title = quizName ? `${quizName} - ${levelName}` : 'Quiz';

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          title: title,
          headerBackTitle: 'Geri',
        }}
      />
    </Stack>
  );
}
