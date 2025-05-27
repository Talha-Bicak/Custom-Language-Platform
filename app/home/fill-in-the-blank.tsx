import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FillInTheBlank } from '../../components/FillInTheBlank';
import { fillInTheBlankQuestions } from '../../data/fillInTheBlank';

export default function FillInTheBlankScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // 2 saniye sonra bir sonraki soruya geç
    setTimeout(() => {
      if (currentQuestionIndex < fillInTheBlankQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <FillInTheBlank
          question={fillInTheBlankQuestions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
}); 