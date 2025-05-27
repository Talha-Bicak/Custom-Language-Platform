import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { generateEnglishPractice } from '@/services/gemini';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: 'en' | 'tr';
};

type Language = 'en' | 'tr';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Karşılama mesajı
    const welcomeMessage: Message = {
      id: '1',
      text: selectedLanguage === 'en' 
        ? 'Hello! I am your English practice assistant. You can speak with me in English or Turkish. How can I help you?'
        : 'Merhaba! Ben senin İngilizce pratik asistanınım. Benimle İngilizce veya Türkçe konuşabilirsin. Nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date(),
      language: selectedLanguage,
    };
    setMessages([welcomeMessage]);
  }, [selectedLanguage]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await generateEnglishPractice(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedLanguage === 'en'
          ? `${result.conversation}\n\nPronunciation: ${result.pronunciation}\n\nUsage: ${result.usage}`
          : `${result.conversation}\n\nTelaffuz: ${result.pronunciation}\n\nKullanım: ${result.usage}`,
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage,
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Mesajı seçili dilde sesli oku
      await Speech.speak(result.conversation, {
        language: selectedLanguage,
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedLanguage === 'en'
          ? 'Sorry, an error occurred. Please try again.'
          : 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    try {
      await Speech.speak(text, {
        language: selectedLanguage,
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const toggleLanguage = () => {
    setSelectedLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">
          {selectedLanguage === 'en' ? 'English Practice' : 'İngilizce Pratik'}
        </ThemedText>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <ThemedText style={styles.languageText}>
            {selectedLanguage === 'en' ? 'TR' : 'EN'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <View style={styles.messageContent}>
                <ThemedText style={[
                  styles.messageText,
                  message.isUser && styles.userMessageText
                ]}>
                  {message.text}
                </ThemedText>
                {!message.isUser && (
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => handleSpeak(message.text)}
                  >
                    <Ionicons name="volume-high" size={20} color="#4A80F0" />
                  </TouchableOpacity>
                )}
              </View>
              <ThemedText style={[
                styles.timestamp,
                message.isUser && styles.userTimestamp
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={selectedLanguage === 'en' ? 'Type a message...' : 'Bir mesaj yazın...'}
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() ? '#FFFFFF' : '#CCCCCC'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  languageButton: {
    backgroundColor: '#4A80F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  languageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A80F0',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  messageText: {
    fontSize: 16,
    flex: 1,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: '#FFFFFF',
  },
  speakButton: {
    marginLeft: 10,
    padding: 5,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4A80F0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
}); 