import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface QuizType {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  questions: number;
}

// Örnek quiz verileri
const quizTypes: QuizType[] = [
  { 
    id: '1', 
    title: 'Çoktan Seçmeli',
    description: 'Verilen kelime için doğru anlamı seçin',
    icon: 'list-outline',
    color: '#4A80F0',
    questions: 10
  },
  { 
    id: '2', 
    title: 'Eşleştirme',
    description: 'Kelimeleri anlamları ile eşleştirin',
    icon: 'git-compare-outline',
    color: '#7560ED',
    questions: 15
  },
  { 
    id: '3', 
    title: 'Boşluk Doldurma',
    description: 'Cümledeki boşluğa uygun kelimeyi yazın',
    icon: 'create-outline',
    color: '#FF9800',
    questions: 8
  },
  { 
    id: '4', 
    title: 'Dinleme Testi',
    description: 'Dinlediğiniz kelimeyi yazın',
    icon: 'ear-outline',
    color: '#4CAF50',
    questions: 12
  },
];

// Seviye bilgileri
const levels = [
  { id: '1', name: 'Kolay', color: '#4CAF50' },
  { id: '2', name: 'Orta', color: '#FF9800' },
  { id: '3', name: 'Zor', color: '#F44336' },
];

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const [selectedLevel, setSelectedLevel] = useState('1');

  const startQuiz = (quizId: string) => {
    // Navigation to quiz screen with parameters
    router.push({
      pathname: '/home/quiz',
      params: { 
        quizId: quizId,
        levelId: selectedLevel,
        quizName: quizTypes.find(q => q.id === quizId)?.title || '',
        levelName: levels.find(l => l.id === selectedLevel)?.name || ''
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Pratik Yap</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Seviye Seçici */}
        <View style={styles.levelContainer}>
          <ThemedText style={styles.levelTitle}>Zorluk Seviyesi</ThemedText>
          <View style={styles.levelButtonsContainer}>
            {levels.map(level => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelButton,
                  selectedLevel === level.id && {
                    backgroundColor: level.color,
                  }
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <ThemedText
                  style={[
                    styles.levelText,
                    selectedLevel === level.id && { color: '#FFFFFF' }
                  ]}
                >
                  {level.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quiz Tipleri */}
        <ThemedText style={styles.sectionTitle}>Alıştırma Türleri</ThemedText>
        {quizTypes.map(quiz => (
          <View key={quiz.id} style={styles.quizCard}>
            <View style={[styles.quizIconContainer, { backgroundColor: quiz.color }]}>
              <Ionicons name={quiz.icon} size={28} color="#FFFFFF" />
            </View>
            <View style={styles.quizInfo}>
              <ThemedText style={styles.quizTitle}>{quiz.title}</ThemedText>
              <ThemedText style={styles.quizDescription}>{quiz.description}</ThemedText>
              <ThemedText style={styles.quizQuestions}>
                {quiz.questions} soru • Yaklaşık {Math.round(quiz.questions * 0.5)} dakika
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => startQuiz(quiz.id)}
            >
              <Ionicons name="play" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Son Performans */}
        <ThemedText style={styles.sectionTitle}>Son Performansınız</ThemedText>
        <ThemedView style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>85%</ThemedText>
              <ThemedText style={styles.statLabel}>Doğru</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Toplam Test</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>320</ThemedText>
              <ThemedText style={styles.statLabel}>Puan</ThemedText>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <ThemedText>Haftalık Hedef</ThemedText>
              <ThemedText style={styles.progressPercent}>70%</ThemedText>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%', backgroundColor: '#4CAF50' }]} />
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  scrollView: {
    flex: 1,
  },
  levelContainer: {
    padding: 20,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  levelButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quizIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  quizQuestions: {
    fontSize: 12,
    opacity: 0.6,
  },
  startButton: {
    backgroundColor: '#4A80F0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressSection: {
    marginTop: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressPercent: {
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  }
});
