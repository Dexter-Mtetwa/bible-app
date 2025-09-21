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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import { bibleDB, Book } from '../db/bible';

export default function BookListScreen({ navigation }: any) {
  const [oldTestamentBooks, setOldTestamentBooks] = useState<Book[]>([]);
  const [newTestamentBooks, setNewTestamentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

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

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
    >
      <Ionicons
        name="book-outline"
        size={22}
        color={item.testament === 'old' ? '#e74c3c' : '#3498db'}
      />
      <View style={styles.bookTextContainer}>
        <Text style={styles.bookName}>{item.name}</Text>
        <Text style={styles.chapterCount}>{item.chapter_count} chapters</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading books...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Animate indicator
  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width / 2],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* Material Top Tabs */}
        <View style={styles.topTabs}>
          {['Old Testament', 'New Testament'].map((label, index) => (
            <TouchableOpacity
              key={label}
              style={styles.tabButton}
              activeOpacity={0.7}
              onPress={() => {
                setActiveTab(index);
                pagerRef.current?.setPage(index);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Indicator */}
          <Animated.View
            style={[
              styles.indicator,
              { transform: [{ translateX }], width: width / 2 },
            ]}
          />
        </View>

        {/* Pager */}
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageScroll={(e) => {
            const { offset, position } = e.nativeEvent;
            scrollX.setValue((position + offset) * width);
          }}
          onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
        >
          <View key="0">
            <FlatList
              data={oldTestamentBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.booksList}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View key="1">
            <FlatList
              data={newTestamentBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.booksList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </PagerView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  booksList: { paddingHorizontal: 20, paddingBottom: 20 },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  bookTextContainer: { marginLeft: 12 },
  bookName: { fontSize: 16, fontWeight: '600', color: '#333' },
  chapterCount: { fontSize: 13, color: '#666', marginTop: 2 },

  // Material Top Tabs
  topTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    height: 48,
    position: 'relative',
  },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { fontSize: 14, color: '#555', fontWeight: '500' },
  activeTabText: { color: '#667eea', fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 1.5,
  },
});
