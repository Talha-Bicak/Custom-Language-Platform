import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Menü öğeleri
  const menuItems = [
    { 
      id: '1', 
      title: 'Hesap Bilgileri', 
      icon: 'person-circle',
      screen: '/home/profile/account'
    },
    { 
      id: '2', 
      title: 'Öğrenme İstatistikleri', 
      icon: 'stats-chart',
      screen: '/home/profile/stats'
    },
    { 
      id: '3', 
      title: 'Kaydedilen Kelimeler', 
      icon: 'bookmark',
      screen: '/home/saved' // Doğru yolu güncelledik
    },
    { 
      id: '4', 
      title: 'Ayarlar', 
      icon: 'settings',
      screen: '/home/profile/settings'
    },
    { 
      id: '5', 
      title: 'Yardım & Destek', 
      icon: 'help-circle',
      screen: '/home/profile/help'
    },
  ];

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profil</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {/* Profil Bilgisi */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</ThemedText>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <ThemedText style={styles.userName}>{user?.name || 'Kullanıcı'}</ThemedText>
            <ThemedText style={styles.userEmail}>{user?.email || 'kullanici@email.com'}</ThemedText>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>156</ThemedText>
                <ThemedText style={styles.statLabel}>Kelime</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>23</ThemedText>
                <ThemedText style={styles.statLabel}>Gün</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>8</ThemedText>
                <ThemedText style={styles.statLabel}>Seri</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Profil Menüsü */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => navigateTo(item.screen)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </View>
              <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={Colors[colorScheme ?? 'light'].text}
                style={styles.menuArrow}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <ThemedText style={styles.logoutText}>Çıkış Yap</ThemedText>
        </TouchableOpacity>

        {/* Uygulama Bilgisi */}
        <ThemedView style={styles.appInfoContainer}>
          <ThemedText style={styles.appVersion}>ProjectLearn v1.0.0</ThemedText>
          <ThemedText style={styles.appCopyright}>© 2023 ProjectLearn</ThemedText>
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
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A80F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 15,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  menuArrow: {
    opacity: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    paddingVertical: 12,
    marginHorizontal: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    color: '#F44336',
    marginLeft: 10,
    fontWeight: '500',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    opacity: 0.6,
  },
  appVersion: {
    fontSize: 12,
  },
  appCopyright: {
    fontSize: 10,
    marginTop: 5,
  },
});
