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
import { getTestamentName } from '../utils/verseUtils';

const { width } = Dimensions.get('window');

export default function BookListScreen({ navigation }: any) {
  const [oldTestamentBooks, setOldTestamentBooks] = useState<Book[]>([]);
  const [newTestamentBooks, setNewTestamentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const [oldBooks, newBooks] = await Promise.all([
        bibleDB.getBooksByTestament('old'),
        bibleDB.getBooksByTestament('new'),
      ]);
      
      setOldTestamentBooks(oldBooks);
      setNewTestamentBooks(newBooks);

      // Animate content appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Failed to load books:', error);
      Alert.alert('Error', 'Failed to load Bible books');
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('ChapterList', { book });
  };

  const handleTabSwitch = (tab: 'old' | 'new') => {
    setActiveTab(tab);
    Animated.timing(tabIndicatorAnim, {
      toValue: tab === 'old' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderBookItem = ({ item, index }: { item: Book; index: number }) => (
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
        style={styles.bookItem}
        onPress={() => handleBookPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.bookItemGradient}
        >
          <View style={styles.bookItemContent}>
            <View style={styles.bookIconContainer}>
              <Ionicons 
                name="book" 
                size={24} 
                color={item.testament === 'old' ? '#e74c3c' : '#3498db'} 
              />
            </View>
            <View style={styles.bookTextContainer}>
              <Text style={styles.bookName}>{item.name}</Text>
              <Text style={styles.chapterCount}>{item.chapter_count} chapters</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTabBar = () => (
    <Animated.View 
      style={[
        styles.tabBar,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
        style={styles.tabBarGradient}
      >
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabSwitch('old')}
          activeOpacity={0.8}
        >
          <View style={styles.tabContent}>
            <Ionicons 
              name="library" 
              size={20} 
              color={activeTab === 'old' ? '#e74c3c' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'old' ? '#e74c3c' : '#666' }
            ]}>
              Old Testament
            </Text>
            <Text style={[
              styles.tabCount,
              { color: activeTab === 'old' ? '#e74c3c' : '#999' }
            ]}>
              {oldTestamentBooks.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabSwitch('new')}
          activeOpacity={0.8}
        >
          <View style={styles.tabContent}>
            <Ionicons 
              name="library-outline" 
              size={20} 
              color={activeTab === 'new' ? '#3498db' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'new' ? '#3498db' : '#666' }
            ]}>
              New Testament
            </Text>
            <Text style={[
              styles.tabCount,
              { color: activeTab === 'new' ? '#3498db' : '#999' }
            ]}>
              {newTestamentBooks.length}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderBooksList = () => {
    const books = activeTab === 'old' ? oldTestamentBooks : newTestamentBooks;
    const testament = activeTab === 'old' ? 'old' : 'new';
    
    return (
      <Animated.View 
        style={[
          styles.booksContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.bookRow}
        />
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
            <Text style={styles.loadingText}>Loading books...</Text>
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
          <Text style={styles.title}>Bible Books</Text>
          <Text style={styles.subtitle}>Choose a book to read</Text>
        </Animated.View>
        
        {renderTabBar()}
        {renderBooksList()}
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
    marginTop: 15,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
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
  tabBar: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  tabBarGradient: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  booksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  booksList: {
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  bookItem: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookItemGradient: {
    padding: 16,
    minHeight: 100,
  },
  bookItemContent: {
    alignItems: 'center',
    gap: 8,
  },
  bookIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTextContainer: {
    alignItems: 'center',
  },
  bookName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  chapterCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
});
