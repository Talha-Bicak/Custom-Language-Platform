import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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
  options?: string[];
  example?: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching';
};

type MatchingPair = {
  english: string;
  turkish: string;
  isSelected?: boolean;
  isMatched?: boolean;
};

export default function QuizScreen() {
  const { quizId, levelId } = useLocalSearchParams<{ quizId: string, levelId: string }>();
  const colorScheme = useColorScheme();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setUserAnswer('');
    setQuizCompleted(false);
    setMatchingPairs([]);
    setSelectedEnglish(null);
    setMatchedPairs(new Set());
    setWrongMatch(null);
    setShowHint(false);
    generateQuestions();
  }, [quizId, levelId]);

  useFocusEffect(
    useCallback(() => {
      resetQuiz();
    }, [resetQuiz])
  );

  const generateQuestions = () => {
    const allWords = [
      ...ieltsWords.words, 
      ...toeflWords.words, 
      ...ydsWords.words, 
      ...generalWords.words
    ];
    
    const questionCount = levelId === '1' ? 5 : levelId === '2' ? 8 : 10;
    const optionCount = levelId === '1' ? 3 : levelId === '2' ? 4 : 5;
    
    const shuffledWords = [...allWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, questionCount);
    
    if (quizId === '2') { // Eşleştirme
      const pairs = selectedWords.map(word => ({
        english: word.word,
        turkish: word.meaning,
        isSelected: false,
        isMatched: false
      }));
      setMatchingPairs(pairs);
    } else {
      const quizQuestions = selectedWords.map(word => {
        if (quizId === '3') { // Boşluk doldurma
          return {
            id: word.id,
            word: word.word,
            correctAnswer: word.word,
            example: word.example?.replace(word.word, '•'.repeat(word.word.length)),
            type: 'fill-in-blank' as const
          };
        } else { // Çoktan seçmeli
          const otherWords = allWords.filter(w => w.id !== word.id);
          const shuffledOtherWords = [...otherWords].sort(() => 0.5 - Math.random());
          
          const incorrectOptions = shuffledOtherWords
            .map(w => w.meaning)
            .slice(0, optionCount - 1);
          
          const allOptions = [word.meaning, ...incorrectOptions];
          const shuffledOptions = [...allOptions].sort(() => 0.5 - Math.random());
          
          return {
            id: word.id,
            word: word.word,
            correctAnswer: word.meaning,
            options: shuffledOptions,
            type: 'multiple-choice' as const
          };
        }
      });
      
      setQuestions(quizQuestions);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleMatchingSelect = (english: string) => {
    if (selectedEnglish === english) {
      setSelectedEnglish(null);
      return;
    }

    if (selectedEnglish) {
      // İkinci seçim yapıldı
      const firstPair = matchingPairs.find(p => p.english === selectedEnglish);
      const secondPair = matchingPairs.find(p => p.english === english);
      
      if (firstPair && secondPair) {
        const isCorrect = firstPair.turkish === secondPair.turkish;
        
        if (isCorrect) {
          setMatchedPairs(prev => new Set([...prev, selectedEnglish, english]));
          setScore(prev => prev + 1);
        }
        
        // Kısa bir gecikme ile seçimleri sıfırla
        setTimeout(() => {
          setSelectedEnglish(null);
        }, 500);
      }
    } else {
      // İlk seçim
      setSelectedEnglish(english);
    }
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'multiple-choice') {
      isCorrect = selectedOption === currentQ.correctAnswer;
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase();
    }

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setUserAnswer('');
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

  if (questions.length === 0 && quizId !== '2') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Sorular hazırlanıyor...</ThemedText>
      </ThemedView>
    );
  }

  if (quizCompleted || (quizId === '2' && matchedPairs.size === matchingPairs.length)) {
    const percentage = Math.round((score / (quizId === '2' ? matchingPairs.length / 2 : questions.length)) * 100);
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
            {quizId === '2' 
              ? `${matchingPairs.length / 2} eşleştirmeden ${score} tanesini doğru yaptınız.`
              : `${questions.length} sorudan ${score} tanesini doğru cevapladınız.`}
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

  if (quizId === '2') {
    // Türkçe kelimeleri karıştır
    const shuffledTurkish = [...matchingPairs]
      .map(pair => pair.turkish)
      .sort(() => 0.5 - Math.random());

    return (
      <ThemedView style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(matchedPairs.size / matchingPairs.length) * 100}%` }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>
            {matchedPairs.size / 2} / {matchingPairs.length / 2} eşleştirme
          </ThemedText>
        </View>

        <View style={styles.matchingContainer}>
          <ThemedText style={styles.matchingTitle}>
            Kelimeleri anlamlarıyla eşleştirin
          </ThemedText>

          <View style={styles.matchingColumns}>
            {/* İngilizce Kelimeler */}
            <View style={styles.matchingColumn}>
              {matchingPairs.map((pair, index) => {
                const isMatched = matchedPairs.has(pair.english);
                return (
                  <TouchableOpacity
                    key={`eng-${index}`}
                    style={[
                      styles.matchingCard,
                      selectedEnglish === pair.english && styles.selectedCard,
                      isMatched && styles.matchedCard
                    ]}
                    onPress={() => {
                      if (!isMatched && !selectedEnglish) {
                        setSelectedEnglish(pair.english);
                      }
                    }}
                    disabled={isMatched || selectedEnglish !== null}
                  >
                    <ThemedText style={styles.matchingText}>
                      {pair.english}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Türkçe Kelimeler */}
            <View style={styles.matchingColumn}>
              {shuffledTurkish.map((turkish, index) => {
                const isMatched = matchingPairs.some(
                  pair => pair.turkish === turkish && matchedPairs.has(pair.english)
                );
                const isWrongMatch = wrongMatch === turkish;

                return (
                  <TouchableOpacity
                    key={`tr-${index}`}
                    style={[
                      styles.matchingCard,
                      isMatched && styles.matchedCard,
                      isWrongMatch && styles.wrongCard
                    ]}
                    onPress={() => {
                      if (selectedEnglish && !isMatched) {
                        const englishPair = matchingPairs.find(p => p.english === selectedEnglish);
                        if (englishPair && englishPair.turkish === turkish) {
                          setMatchedPairs(prev => new Set([...prev, selectedEnglish]));
                          setScore(prev => prev + 1);
                        } else {
                          setWrongMatch(turkish);
                          setTimeout(() => {
                            setWrongMatch(null);
                            setSelectedEnglish(null);
                          }, 500);
                        }
                      }
                    }}
                    disabled={!selectedEnglish || isMatched}
                  >
                    <ThemedText style={styles.matchingText}>
                      {turkish}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ThemedView>
    );
  }

  if (quizId === '3') {
    const currentQuestionData = questions[currentQuestion];
    const correctAnswer = currentQuestionData.correctAnswer;
    const exampleText = currentQuestionData.example;
    const blankDisplay = '_'.repeat(correctAnswer.length);

    // example text içinde kelimeyi bulup boşluk ile değiştir
    const textWithBlank = exampleText?.replace(new RegExp(`\\b${correctAnswer}\\b`, 'i'), blankDisplay);

    // İpucu için kelimenin Türkçe anlamını bul
    const wordMeaning = generalWords.words.find(word => word.word.toLowerCase() === correctAnswer.toLowerCase())?.meaning;

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
            Soru {currentQuestion + 1} / {questions.length}
          </ThemedText>
        </View>

        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionPrompt}>
            Aşağıdaki cümlede boş bırakılan yere uygun kelimeyi yazın:
          </ThemedText>
          
          <View style={styles.exampleContainer}>
            <ThemedText style={styles.exampleText}>
              {textWithBlank}
            </ThemedText>
          </View>

          {showHint && wordMeaning && (
            <ThemedText style={styles.hintText}>İpucu: {wordMeaning}</ThemedText>
          )}

          {!showHint && (
            <TouchableOpacity
              style={styles.hintButton}
              onPress={() => setShowHint(true)}
            >
              <ThemedText style={styles.hintButtonText}>İpucu Göster</ThemedText>
            </TouchableOpacity>
          )}

          <TextInput
            style={[
              styles.answerInput,
              userAnswer.length > 0 && styles.answerInputFilled
            ]}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Cevabınızı buraya yazın..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !userAnswer && styles.disabledButton
            ]}
            onPress={handleNextQuestion}
            disabled={!userAnswer}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // Çoktan seçmeli soru kısmı
  if (quizId === '1') {
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
            Soru {currentQuestion + 1} / {questions.length}
          </ThemedText>
        </View>

        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionPrompt}>
            "{currentQuestionData.word}" kelimesinin anlamı nedir?
          </ThemedText>

          <View style={styles.optionsContainer}>
            {currentQuestionData.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.selectedOption
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <ThemedText style={styles.optionText}>
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
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
              {currentQuestion < questions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }
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
  exampleContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  exampleText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: '#212529',
  },
  answerInput: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  answerInputFilled: {
    borderColor: '#4A80F0',
    backgroundColor: '#F8F9FA',
  },
  matchingContainer: {
    flex: 1,
  },
  matchingTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  matchingColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  matchingColumn: {
    flex: 1,
    gap: 10,
  },
  matchingCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  matchedCard: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  wrongCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  matchingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  hintButton: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  hintButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
