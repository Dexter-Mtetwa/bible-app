import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { bibleDB } from '../db/bible';
import { localStore } from '../storage/localStore';
import { formatVerseReference, generatePrayer } from '../utils/verseUtils';
import { Verse } from '../db/bible';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [verseOfTheDay, setVerseOfTheDay] = useState<Verse | null>(null);
  const [prayer, setPrayer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadVerseOfTheDay();
  }, []);

  const loadVerseOfTheDay = async () => {
    try {
      setLoading(true);
      const verse = await bibleDB.getVerseOfTheDay();
      const prayerText = generatePrayer(verse);
      
      setVerseOfTheDay(verse);
      setPrayer(prayerText);
      
      // Add to history
      await localStore.addToHistory(
        `${verse.book}-${verse.chapter}-${verse.verse}`,
        verse.book_name,
        verse.chapter,
        verse.verse,
        verse.text
      );

      // Animate content appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Failed to load verse of the day:', error);
      Alert.alert('Error', 'Failed to load verse of the day');
    } finally {
      setLoading(false);
    }
  };

  const handleVersePress = () => {
    if (verseOfTheDay) {
      navigation.navigate('Bible', {
        screen: 'VerseDetail',
        params: {
          verse: verseOfTheDay,
        },
      });
    }
  };

  const handleRefresh = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);
    loadVerseOfTheDay();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading verse of the day...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View>
              <Text style={styles.title}>Bible App</Text>
              <Text style={styles.subtitle}>Your Daily Spiritual Journey</Text>
            </View>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            style={[
              styles.verseCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
              style={styles.verseCardGradient}
            >
              <View style={styles.verseHeader}>
                <Ionicons name="book" size={24} color="#667eea" />
                <Text style={styles.verseTitle}>Verse of the Day</Text>
              </View>
              {verseOfTheDay && (
                <>
                  <Text style={styles.verseReference}>
                    {formatVerseReference(verseOfTheDay)}
                  </Text>
                  <TouchableOpacity onPress={handleVersePress} style={styles.verseTouchable}>
                    <Text style={styles.verseText}>
                      "{verseOfTheDay.text}"
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#667eea" style={styles.chevron} />
                  </TouchableOpacity>
                </>
              )}
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.prayerCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
              style={styles.prayerCardGradient}
            >
              <View style={styles.prayerHeader}>
                <Ionicons name="heart" size={20} color="#e74c3c" />
                <Text style={styles.prayerTitle}>Prayer</Text>
              </View>
              <Text style={styles.prayerText}>{prayer}</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.quickActions,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Bible')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="book-outline" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Browse Bible</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Utilities')}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>My Notes & Bookmarks</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    fontWeight: '500',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  verseCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  verseCardGradient: {
    padding: 24,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  verseReference: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '700',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verseTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 10,
    marginTop: 5,
  },
  prayerCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  prayerCardGradient: {
    padding: 24,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  prayerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  prayerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    fontWeight: '400',
  },
  quickActions: {
    gap: 15,
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
