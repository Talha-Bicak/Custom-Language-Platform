import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SavedWordsScreen() {
  const colorScheme = useColorScheme();
  const { savedWords, removeWord } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Kaydedilen Kelimeler</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {savedWords.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={64} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.emptyText}>Henüz kaydedilmiş kelime bulunmuyor</ThemedText>
          </ThemedView>
        ) : (
          <View style={styles.wordList}>
            {savedWords.map(word => (
              <View key={word.id} style={styles.wordItem}>
                <View style={styles.wordHeader}>
                  <ThemedText style={styles.word}>{word.word}</ThemedText>
                  <ThemedText style={styles.category}>{word.category}</ThemedText>
                </View>
                
                <ThemedText style={styles.meaning}>
                  <ThemedText style={styles.label}>Anlam: </ThemedText>
                  {word.meaning}
                </ThemedText>
                
                <ThemedText style={styles.example}>
                  <ThemedText style={styles.label}>Örnek: </ThemedText>
                  {word.example}
                </ThemedText>

                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeWord(word.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  <ThemedText style={styles.removeText}>Kaldır</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  wordList: {
    padding: 15,
  },
  wordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    opacity: 0.6,
  },
  label: {
    fontWeight: '600',
  },
  meaning: {
    fontSize: 16,
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
    opacity: 0.8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF2F2',
    borderRadius: 20,
  },
  removeText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#FF3B30',
  }
});