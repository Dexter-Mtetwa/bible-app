import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { Book } from '../db/bible';

const { width } = Dimensions.get('window');

export default function ChapterListScreen({ navigation, route }: any) {
  const { book } = route.params;
  const [chapters, setChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadChapters();
  }, [book]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const chapterList = await bibleDB.getChapters(book.id);
      setChapters(chapterList);
      
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
      console.error('Failed to load chapters:', error);
      Alert.alert('Error', 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = (chapter: number) => {
    navigation.navigate('BibleReader', { book, chapter });
  };

  const renderChapterItem = ({ item, index }: { item: number; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }
        ]
      }}
    >
      <TouchableOpacity
        style={styles.chapterItem}
        onPress={() => handleChapterPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={book.testament === 'old' ? ['#e74c3c', '#c0392b'] : ['#3498db', '#2980b9']}
          style={styles.chapterGradient}
        >
          <View style={styles.chapterContent}>
            <Ionicons 
              name="book-open" 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.chapterNumber}>{item}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

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
            <Text style={styles.loadingText}>Loading chapters...</Text>
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
              <Text style={styles.bookTitle}>{book.name}</Text>
              <Text style={styles.chapterCount}>{chapters.length} chapters</Text>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.chaptersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <FlatList
            data={chapters}
            renderItem={renderChapterItem}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
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
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  chapterCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    fontWeight: '500',
  },
  chaptersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  chapterItem: {
    width: (width - 80) / 3,
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
  chapterGradient: {
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterContent: {
    alignItems: 'center',
    gap: 8,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
