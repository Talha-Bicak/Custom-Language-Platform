import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

// Import vocabulary data
import generalWords from '@/data/vocabulary/general.json';
import ieltsWords from '@/data/vocabulary/ielts.json';
import toeflWords from '@/data/vocabulary/toefl.json';
import ydsWords from '@/data/vocabulary/yds.json';

type QuizQuestion = {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
};

export default function QuizScreen() {
  const { quizId, levelId } = useLocalSearchParams<{ quizId: string, levelId: string }>();
  const colorScheme = useColorScheme();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Reset quiz state and generate new questions
  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
    generateQuestions();
  }, [quizId, levelId]); // Dependencies ensure reset occurs when quiz type or level changes

  // Reset quiz when screen comes into focus or parameters change
  useFocusEffect(
    useCallback(() => {
      resetQuiz();
    }, [resetQuiz])
  );

  const generateQuestions = () => {
    // Combine all word lists
    const allWords = [
      ...ieltsWords.words, 
      ...toeflWords.words, 
      ...ydsWords.words, 
      ...generalWords.words
    ];
    
    // Difficulty settings
    const questionCount = levelId === '1' ? 5 : levelId === '2' ? 8 : 10;
    const optionCount = levelId === '1' ? 3 : levelId === '2' ? 4 : 5;
    
    // Shuffle and select words for questions
    const shuffledWords = [...allWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, questionCount);
    
    // Create questions with options
    const quizQuestions = selectedWords.map(word => {
      // Get incorrect options (meanings from other words)
      const otherWords = allWords.filter(w => w.id !== word.id);
      const shuffledOtherWords = [...otherWords].sort(() => 0.5 - Math.random());
      
      const incorrectOptions = shuffledOtherWords
        .map(w => w.meaning)
        .slice(0, optionCount - 1);
      
      // Combine correct and incorrect options and shuffle
      const allOptions = [word.meaning, ...incorrectOptions];
      const shuffledOptions = [...allOptions].sort(() => 0.5 - Math.random());
      
      return {
        id: word.id,
        word: word.word,
        correctAnswer: word.meaning,
        options: shuffledOptions
      };
    });
    
    setQuestions(quizQuestions);
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    router.back();
  };

  const handleRetryQuiz = () => {
    resetQuiz();
  };

  // If we haven't generated questions yet, show loading
  if (questions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Sorular hazırlanıyor...</ThemedText>
      </ThemedView>
    );
  }

  // Show quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <ThemedView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.scoreCircle}>
            <ThemedText style={styles.scorePercentage}>{percentage}%</ThemedText>
          </View>
          
          <ThemedText style={styles.resultTitle}>
            Quiz Tamamlandı!
          </ThemedText>
          
          <ThemedText style={styles.resultText}>
            {questions.length} sorudan {score} tanesini doğru cevapladınız.
          </ThemedText>
          
          <ThemedText style={styles.resultFeedback}>
            {percentage >= 80 
              ? 'Harika! Çok iyi bir performans gösterdiniz.' 
              : percentage >= 60 
                ? 'İyi! Biraz daha çalışmayla daha da başarılı olabilirsiniz.' 
                : 'Bu kelimeleri tekrar çalışmanızda fayda var.'}
          </ThemedText>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetryQuiz}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <ThemedText style={styles.buttonText}>Tekrar Dene</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.finishButton}
              onPress={handleFinishQuiz}
            >
              <ThemedText style={styles.buttonText}>Tamamla</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  // Show current question
  const currentQuestionData = questions[currentQuestion];
  return (
    <ThemedView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <ThemedText style={styles.progressText}>
          {currentQuestion + 1} / {questions.length}
        </ThemedText>
      </View>

      <View style={styles.questionContainer}>
        <ThemedText style={styles.questionPrompt}>
          "{currentQuestionData.word}" kelimesinin anlamı nedir?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {currentQuestionData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => handleSelectOption(option)}
            >
              <ThemedText style={styles.optionText}>{option}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedOption && styles.disabledButton
        ]}
        onPress={handleNextQuestion}
        disabled={!selectedOption}
      >
        <ThemedText style={styles.nextButtonText}>
          {currentQuestion < questions.length - 1 ? 'Sonraki' : 'Bitir'}
        </ThemedText>
        <Ionicons 
          name="arrow-forward" 
          size={20} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
  },
  questionContainer: {
    flex: 1,
  },
  questionPrompt: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#4A80F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercentage: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultFeedback: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 15,
  },
  retryButton: {
    backgroundColor: '#7560ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  finishButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  }
});
