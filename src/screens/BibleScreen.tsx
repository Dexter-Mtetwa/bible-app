import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ActionSheetIOS,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { bibleDB } from '../db/bible';
import { localStore } from '../storage/localStore';
import { formatVerseReference } from '../utils/verseUtils';
import { Verse, Chapter } from '../db/bible';

const { width } = Dimensions.get('window');

export default function BibleScreen({ navigation, route }: any) {
  const { book, chapter } = route.params;
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadChapter();
    loadHighlights();
  }, [book, chapter]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      const data = await bibleDB.getChapter(book.id, chapter);
      setChapterData(data);
      
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
      ]).start();
    } catch (error) {
      console.error('Failed to load chapter:', error);
      Alert.alert('Error', 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const loadHighlights = async () => {
    try {
      const highlightData = await localStore.getHighlights();
      const verseIds = highlightData.map(h => h.verseId);
      setHighlights(verseIds);
    } catch (error) {
      console.error('Failed to load highlights:', error);
    }
  };

  const handleVersePress = (verse: Verse) => {
    const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Highlight', 'Add Note', 'Bookmark', 'Ask AI'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleHighlight(verse);
          } else if (buttonIndex === 2) {
            handleAddNote(verse);
          } else if (buttonIndex === 3) {
            handleBookmark(verse);
          } else if (buttonIndex === 4) {
            handleAskAI(verse);
          }
        }
      );
    } else {
      // For Android, you would use a different action sheet implementation
      Alert.alert(
        'Verse Options',
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Highlight', onPress: () => handleHighlight(verse) },
          { text: 'Add Note', onPress: () => handleAddNote(verse) },
          { text: 'Bookmark', onPress: () => handleBookmark(verse) },
          { text: 'Ask AI', onPress: () => handleAskAI(verse) },
        ]
      );
    }
  };

  const handleHighlight = async (verse: Verse) => {
    try {
      const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
      await localStore.saveHighlight(verseId, '#FFD700'); // Gold color
      await loadHighlights();
      Alert.alert('Success', 'Verse highlighted!');
    } catch (error) {
      console.error('Failed to highlight verse:', error);
      Alert.alert('Error', 'Failed to highlight verse');
    }
  };

  const handleAddNote = (verse: Verse) => {
    // Navigate to note screen or show modal
    Alert.alert('Add Note', 'Note functionality will be implemented');
  };

  const handleBookmark = async (verse: Verse) => {
    try {
      const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
      await localStore.saveBookmark(
        verseId,
        verse.book_name,
        verse.chapter,
        verse.verse,
        verse.text
      );
      Alert.alert('Success', 'Verse bookmarked!');
    } catch (error) {
      console.error('Failed to bookmark verse:', error);
      Alert.alert('Error', 'Failed to bookmark verse');
    }
  };

  const handleAskAI = (verse: Verse) => {
    // Navigate to AI assistant screen
    Alert.alert('Ask AI', 'AI functionality will be implemented');
  };

  const renderVerse = ({ item, index }: { item: Verse; index: number }) => {
    const verseId = `${item.book}-${item.chapter}-${item.verse}`;
    const isHighlighted = highlights.includes(verseId);

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
          ]
        }}
      >
        <TouchableOpacity
          style={[styles.verseContainer, isHighlighted && styles.highlightedVerse]}
          onPress={() => handleVersePress(item)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isHighlighted ? ['#FFF8DC', '#FFFACD'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            style={styles.verseGradient}
          >
            <View style={styles.verseContent}>
              <View style={styles.verseNumberContainer}>
                <Text style={styles.verseNumber}>{item.verse}</Text>
              </View>
              <Text style={styles.verseText}>{item.text}</Text>
              {isHighlighted && (
                <Ionicons 
                  name="bookmark" 
                  size={16} 
                  color="#FFD700" 
                  style={styles.highlightIcon}
                />
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
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
            <Text style={styles.loadingText}>Loading chapter...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!chapterData) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#FFFFFF" />
            <Text style={styles.errorText}>Chapter not found</Text>
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
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={book.testament === 'old' ? ['#e74c3c', '#c0392b'] : ['#3498db', '#2980b9']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons 
              name={book.testament === 'old' ? 'library' : 'library-outline'} 
              size={28} 
              color="#FFFFFF" 
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.chapterTitle}>
                {book.name} Chapter {chapter}
              </Text>
              <Text style={styles.verseCount}>
                {chapterData.verses.length} verses
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.versesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <FlatList
            data={chapterData.verses}
            renderItem={renderVerse}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    margin: 20,
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
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  verseCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    fontWeight: '500',
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  verseContainer: {
    marginBottom: 12,
    borderRadius: 12,
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
  highlightedVerse: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  verseGradient: {
    padding: 16,
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontWeight: '400',
  },
  highlightIcon: {
    marginLeft: 8,
    marginTop: 2,
  },
});
