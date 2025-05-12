import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// JSON dosyalarını import et
import ieltsWords from '@/data/vocabulary/ielts.json';
import toeflWords from '@/data/vocabulary/toefl.json';
import ydsWords from '@/data/vocabulary/yds.json';
import generalWords from '@/data/vocabulary/general.json';

// Kategori tipleri
const categories = [
  { id: '1', name: 'IELTS', words: ieltsWords.words },
  { id: '2', name: 'TOEFL', words: toeflWords.words },
  { id: '3', name: 'YDS', words: ydsWords.words },
  { id: '4', name: 'Genel', words: generalWords.words },
];

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [vocabularyItems, setVocabularyItems] = useState([]);

  useEffect(() => {
    const category = categories.find(c => c.id === selectedCategory);
    if (category) {
      setVocabularyItems(category.words);
    }
  }, [selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const { saveWord, savedWords } = useAuth();

  const handleSaveWord = async (item: any) => {
    const wordToSave = {
      ...item,
      category: categories.find(c => c.id === selectedCategory)?.name || 'Genel'
    };
    await saveWord(wordToSave);
  };

  // Render kısmında kaydet butonunu güncelleyelim
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Kelime Öğren</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Kategori Seçici */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && {
                    backgroundColor: Colors[colorScheme ?? 'light'].tint,
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && { color: '#FFFFFF' }
                  ]}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bilgi Kartı */}
        <ThemedView style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          </View>
          <ThemedText style={styles.infoText}>
            Kelimeleri öğrenmek için kartlara tıklayabilirsiniz. Düzenli tekrar yapmayı unutmayın!
          </ThemedText>
        </ThemedView>

        {/* Kelime Listesi */}
        <View style={styles.vocabularyList}>
          {vocabularyItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.vocabularyItem}
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.vocabularyHeader}>
                <ThemedText style={styles.vocabularyWord}>{item.word}</ThemedText>
                <Ionicons 
                  name={expandedItem === item.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={Colors[colorScheme ?? 'light'].text} 
                />
              </View>
              
              {expandedItem === item.id && (
                <View style={styles.vocabularyDetails}>
                  <ThemedText style={styles.vocabularyMeaning}>
                    <ThemedText style={styles.labelText}>Anlam: </ThemedText>
                    {item.meaning}
                  </ThemedText>
                  <ThemedText style={styles.vocabularyExample}>
                    <ThemedText style={styles.labelText}>Örnek: </ThemedText>
                    {item.example}
                  </ThemedText>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="volume-medium" size={20} color={Colors[colorScheme ?? 'light'].tint} />
                      <ThemedText style={styles.actionText}>Dinle</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSaveWord(item)}
                    >
                      <Ionicons 
                        name={savedWords.some(w => w.id === item.id) ? "bookmark" : "bookmark-outline"} 
                        size={20} 
                        color={Colors[colorScheme ?? 'light'].tint} 
                      />
                      <ThemedText style={styles.actionText}>
                        {savedWords.some(w => w.id === item.id) ? 'Kaydedildi' : 'Kaydet'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  categoryContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4A80F0',
  },
  infoIconContainer: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  vocabularyList: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  vocabularyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vocabularyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vocabularyWord: {
    fontSize: 18,
    fontWeight: '600',
  },
  vocabularyDetails: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  labelText: {
    fontWeight: '600',
  },
  vocabularyMeaning: {
    fontSize: 16,
    marginBottom: 8,
  },
  vocabularyExample: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,
  }
});
