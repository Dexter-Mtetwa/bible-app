import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { Ionicons } from '@expo/vector-icons';
import { bibleDB, Book } from '../db/bible';

// Individual Book Item with animations
const BookItem = memo(({ item, onPress, index, activeIndex }: { item: Book; onPress: (b: Book) => void; index: number; activeIndex: number }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 4, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  // Card lift if the tab is active
  const activeScale = activeIndex === 0 ? 1.02 : 1;
  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => onPress(item)}>
      <Animated.View style={[styles.bookItem, { opacity: opacityAnim, transform: [{ scale: scaleAnim }, { scale: activeScale }] }]}>
        <Ionicons
          name="book-outline"
          size={22}
          color={item.testament === 'old' ? '#e74c3c' : '#3498db'}
          style={{ marginRight: 16 }}
        />
        <View style={styles.bookTextContainer}>
          <Text style={styles.bookName}>{item.name}</Text>
          <Text style={styles.chapterCount}>{item.chapter_count} chapters</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});

export default function BookListScreen({ navigation }: any) {
  const [oldTestamentBooks, setOldTestamentBooks] = useState<Book[]>([]);
  const [newTestamentBooks, setNewTestamentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  // Animate list spring on page change
  const listAnim = useRef(new Animated.Value(0)).current;

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

  const booksData = [oldTestamentBooks, newTestamentBooks];

  // Animate bottom tab indicator
  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width / 2],
  });

  const onPageSelected = (index: number) => {
    setActiveTab(index);
    // Spring effect
    listAnim.setValue(0);
    Animated.spring(listAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 50,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageScroll={({ nativeEvent }) => {
          const { position, offset } = nativeEvent;
          scrollX.setValue((position + offset) * width);
        }}
        onPageSelected={({ nativeEvent }) => onPageSelected(nativeEvent.position)}
      >
        {booksData.map((books, pageIndex) => (
          <Animated.View
            key={pageIndex}
            style={{ flex: 1, transform: [{ scale: listAnim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) }] }}
          >
            <FlatList
              data={books}
              renderItem={({ item, index }) => <BookItem item={item} onPress={handleBookPress} index={index} activeIndex={activeTab} />}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.booksList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              getItemLayout={(data, idx) => ({ length: 70, offset: 70 * idx, index: idx })}
            />
          </Animated.View>
        ))}
      </PagerView>

      {/* Elegant Bottom Tabs */}
      <View style={styles.bottomTabs}>
        {[
          { label: 'Old Testament', icon: 'library' },
          { label: 'New Testament', icon: 'library-outline' },
        ].map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableWithoutFeedback
              key={tab.label}
              onPress={() => {
                setActiveTab(index);
                pagerRef.current?.setPage(index);
              }}
            >
              <Animated.View style={[styles.tabButton, isActive && { transform: [{ scale: 1.05 }] }]}>
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={isActive ? '#667eea' : '#888'}
                  style={{ marginBottom: 2 }}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
        <Animated.View style={[styles.indicator, { transform: [{ translateX }], width: width / 2 }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#667eea', fontWeight: '500' },

  booksList: { paddingHorizontal: 20, paddingBottom: 70 },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bookTextContainer: {},
  bookName: { fontSize: 16, fontWeight: '600', color: '#333' },
  chapterCount: { fontSize: 13, color: '#666', marginTop: 2 },

  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 },
  tabText: { fontSize: 13, color: '#888', fontWeight: '500' },
  activeTabText: { color: '#667eea', fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 1.5,
  },
});
