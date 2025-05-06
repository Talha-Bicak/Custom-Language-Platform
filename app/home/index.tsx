import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  
  const handleLogout = () => {
    logout();
  };

  const navigateToLearn = () => {
    router.push('/home/learn');
  };

  const navigateToPractice = () => {
    router.push('/home/practice');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">ProjectLearn</ThemedText>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Karşılama Mesajı */}
        <ThemedView style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeText}>
            Hoş Geldin, {user?.name || 'Öğrenci'}!
          </ThemedText>
          <ThemedText style={styles.welcomeSubtext}>
            Bugün hangi becerilerini geliştirmek istersin?
          </ThemedText>
        </ThemedView>

        {/* İlerleme Kartı */}
        <ThemedView style={styles.progressCard}>
          <ThemedText style={styles.cardTitle}>Haftalık İlerleme</ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <ThemedText style={styles.progressText}>65% tamamlandı</ThemedText>
          <ThemedText style={styles.streakText}>
            <Ionicons name="flame" size={16} color="#FF9500" /> 7 günlük seri
          </ThemedText>
        </ThemedView>

        {/* Hızlı Erişim Kartları */}
        <ThemedText style={styles.sectionTitle}>Hızlı Erişim</ThemedText>
        <View style={styles.cardGrid}>
          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: '#4A80F0' }]} 
            onPress={navigateToLearn}
          >
            <Ionicons name="book-outline" size={32} color="#FFFFFF" />
            <ThemedText style={styles.quickCardText}>Kelime Öğren</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: '#7560ED' }]}
            onPress={navigateToPractice}
          >
            <Ionicons name="fitness-outline" size={32} color="#FFFFFF" />
            <ThemedText style={styles.quickCardText}>Pratik Yap</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="trophy-outline" size={32} color="#FFFFFF" />
            <ThemedText style={styles.quickCardText}>Sıralamalar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="newspaper-outline" size={32} color="#FFFFFF" />
            <ThemedText style={styles.quickCardText}>Günlük Quiz</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Önerilen Dersler */}
        <ThemedText style={styles.sectionTitle}>Önerilen Dersler</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScroll}
        >
          {[1, 2, 3].map(index => (
            <TouchableOpacity key={index} style={styles.lessonCard}>
              <View style={styles.lessonImageContainer}>
                <Ionicons name="school" size={48} color="#FFFFFF" style={styles.lessonIcon} />
              </View>
              <View style={styles.lessonInfo}>
                <ThemedText style={styles.lessonTitle}>IELTS Kelime Grubu {index}</ThemedText>
                <ThemedText style={styles.lessonDetail}>25 kelime • Başlangıç</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeSubtext: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  progressCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    marginTop: 5,
  },
  streakText: {
    fontSize: 14,
    marginTop: 5,
    color: '#FF9500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  quickCard: {
    width: '45%',
    height: 120,
    margin: 5,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingBottom: 30,
  },
  lessonCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonImageContainer: {
    height: 120,
    backgroundColor: '#7560ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonIcon: {
    opacity: 0.9,
  },
  lessonInfo: {
    padding: 15,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  lessonDetail: {
    fontSize: 14,
    opacity: 0.7,
  }
});