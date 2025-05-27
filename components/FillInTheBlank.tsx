import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FillInTheBlankQuestion } from '../data/fillInTheBlank';

interface FillInTheBlankProps {
  question: FillInTheBlankQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    onAnswer(answer === question.answer);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) return styles.option;
    
    if (option === question.answer) {
      return [styles.option, styles.correctAnswer];
    }
    
    if (option === selectedAnswer && option !== question.answer) {
      return [styles.option, styles.wrongAnswer];
    }
    
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sentence}>{question.sentence}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sentence: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  correctAnswer: {
    backgroundColor: '#4CAF50',
  },
  wrongAnswer: {
    backgroundColor: '#f44336',
  },
}); 