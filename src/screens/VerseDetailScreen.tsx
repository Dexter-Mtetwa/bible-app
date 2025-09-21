import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { localStore } from '../storage/localStore';
import { formatVerseReference } from '../utils/verseUtils';
import { Verse } from '../db/bible';

const { width } = Dimensions.get('window');

export default function VerseDetailScreen({ navigation, route }: any) {
  const { verse } = route.params;
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    checkVerseStatus();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [verse]);

  const checkVerseStatus = async () => {
    try {
      const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
      
      const [highlights, bookmarks] = await Promise.all([
        localStore.getHighlights(),
        localStore.getBookmarks(),
      ]);
      
      const highlighted = highlights.some(h => h.verseId === verseId);
      const bookmarked = bookmarks.some(b => b.verseId === verseId);
      
      setIsHighlighted(highlighted);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Failed to check verse status:', error);
    }
  };

  const handleHighlight = async () => {
    try {
      const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
      
      if (isHighlighted) {
        // Remove highlight
        const highlights = await localStore.getHighlights();
        const highlight = highlights.find(h => h.verseId === verseId);
        if (highlight) {
          await localStore.removeHighlight(highlight.id);
        }
        setIsHighlighted(false);
        Alert.alert('Success', 'Highlight removed!');
      } else {
        // Add highlight
        await localStore.saveHighlight(verseId, '#FFD700');
        setIsHighlighted(true);
        Alert.alert('Success', 'Verse highlighted!');
      }
    } catch (error) {
      console.error('Failed to toggle highlight:', error);
      Alert.alert('Error', 'Failed to update highlight');
    }
  };

  const handleBookmark = async () => {
    try {
      const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
      
      if (isBookmarked) {
        // Remove bookmark
        const bookmarks = await localStore.getBookmarks();
        const bookmark = bookmarks.find(b => b.verseId === verseId);
        if (bookmark) {
          await localStore.removeBookmark(bookmark.id);
        }
        setIsBookmarked(false);
        Alert.alert('Success', 'Bookmark removed!');
      } else {
        // Add bookmark
        await localStore.saveBookmark(
          verseId,
          verse.book_name,
          verse.chapter,
          verse.verse,
          verse.text
        );
        setIsBookmarked(true);
        Alert.alert('Success', 'Verse bookmarked!');
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  const handleAddNote = () => {
    Alert.alert('Add Note', 'Note functionality will be implemented');
  };

  const handleAskAI = () => {
    Alert.alert('Ask AI', 'AI functionality will be implemented');
  };

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
              colors={isHighlighted ? ['#FFF8DC', '#FFFACD'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
              style={styles.verseGradient}
            >
              <View style={styles.verseHeader}>
                <Ionicons 
                  name="book" 
                  size={24} 
                  color={verse.testament === 'old' ? '#e74c3c' : '#3498db'} 
                />
                <Text style={styles.verseReference}>
                  {formatVerseReference(verse)}
                </Text>
                {isHighlighted && (
                  <Ionicons 
                    name="bookmark" 
                    size={20} 
                    color="#FFD700" 
                  />
                )}
              </View>
              <Text style={styles.verseText}>{verse.text}</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.actionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.actionButton, isHighlighted && styles.activeButton]}
              onPress={handleHighlight}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isHighlighted ? ['#FFD700', '#FFA500'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.actionGradient}
              >
                <Ionicons 
                  name={isHighlighted ? 'bookmark' : 'bookmark-outline'} 
                  size={20} 
                  color={isHighlighted ? '#FFFFFF' : '#FFD700'} 
                />
                <Text style={[styles.actionButtonText, isHighlighted && styles.activeButtonText]}>
                  {isHighlighted ? 'Remove Highlight' : 'Highlight'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, isBookmarked && styles.activeButton]}
              onPress={handleBookmark}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isBookmarked ? ['#3498db', '#2980b9'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.actionGradient}
              >
                <Ionicons 
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                  size={20} 
                  color={isBookmarked ? '#FFFFFF' : '#3498db'} 
                />
                <Text style={[styles.actionButtonText, isBookmarked && styles.activeButtonText]}>
                  {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddNote}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.actionGradient}
              >
                <Ionicons name="create-outline" size={20} color="#667eea" />
                <Text style={styles.actionButtonText}>Add Note</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAskAI}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.actionGradient}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#667eea" />
                <Text style={styles.actionButtonText}>Ask AI</Text>
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
  verseCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  verseGradient: {
    padding: 24,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  verseReference: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    flex: 1,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 36,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  activeButton: {
    // Active state handled by gradient colors
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});
